import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Send, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Clock, 
  Settings, 
  Cpu, 
  HelpCircle, 
  Copy, 
  Inbox, 
  ChevronRight, 
  CornerUpLeft, 
  Sliders, 
  UserCheck, 
  FileText,
  Workflow
} from 'lucide-react';
import { 
  DEFAULT_CLIENT_ID, 
  initiateGoogleOAuth, 
  fetchGoogleUserInfo, 
  listGmailInbox, 
  sendGmailMessage,
  initAuth,
  googleSignIn,
  logoutGmail,
  setCachedAccessToken
} from '../lib/gmail';
import { GmailMessage } from '../types';

export default function GmailHub() {
  const [clientId, setClientId] = useState(DEFAULT_CLIENT_ID);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ email: string; name: string; picture?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [redirectUri, setRedirectUri] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'inbox' | 'template' | 'campaign'>('inbox');

  // Inbox list state
  const [inboxEmails, setInboxEmails] = useState<GmailMessage[]>([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxQuery, setInboxQuery] = useState('subject:Aurelia OR subject:Reservation OR subject:Contact');
  const [selectedEmail, setSelectedEmail] = useState<GmailMessage | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Template State
  const [autoSend, setAutoSend] = useState(true);
  const [emailSubject, setEmailSubject] = useState('Your Culinary Reservation Confirmed: [Code]');
  const [emailTemplate, setEmailTemplate] = useState(
    `Dear [Name],<br/><br/>` +
    `We are delighted to confirm your upcoming reservation at <strong>Aurelia (L'Elégance)</strong>.<br/><br/>` +
    `<strong>Details of Your Culinary Journey:</strong><br/>` +
    `<ul>` +
    `  <li><strong>Reference Confirmation Code:</strong> <span style="color:#D4AF37; font-weight:bold;">[Code]</span></li>` +
    `  <li><strong>Date:</strong> [Date]</li>` +
    `  <li><strong>Preferred Seating Hour:</strong> [Time]</li>` +
    `  <li><strong>Guest Count:</strong> [Guests] Guests</li>` +
    `  <li><strong>Salon Seating Category:</strong> Grand Dining Salon</li>` +
    `</ul><br/>` +
    `Our culinary brigade and wine curators look forward to presenting your tasting menus. If you'd like to adjust dietary choices or beverage selections, please reply directly to this mail.<br/><br/>` +
    `<em>Warm regards,<br/>The Concierge at Aurelia</em>`
  );

  // Custom campaign state
  const [campaignTo, setCampaignTo] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('Exclusive Invitation: Chef Julian\'s Private Plating Event');
  const [campaignBody, setCampaignBody] = useState(
    `<p>Dear Patron,</p>` +
    `<p>It is our privilege to invite you to an upcoming exclusive sensory dinner featuring our latest vintages.</p>` +
    `<p>Please reply directly to reserve your private cellar suite seating.</p>`
  );
  const [campaignLoading, setCampaignLoading] = useState(false);

  // Load configured keys on boot
  useEffect(() => {
    // Generate valid redirect URL based on app origin
    const origin = window.location.origin;
    // Strip trailing slashes to keep OAuth callback matching perfect
    const parsedRedirect = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    setRedirectUri(parsedRedirect);

    // Initialize Firebase Auth listener
    const unsubscribe = initAuth(
      async (user, token) => {
        setAccessToken(token);
        localStorage.setItem('aurelia_gmail_token', token);
        try {
          const profile = {
            email: user.email || '',
            name: user.displayName || '',
            picture: user.photoURL || undefined
          };
          setUserProfile(profile);
          fetchEmails(token, inboxQuery);
        } catch (e) {
          console.error('Failed to parse profile after Firebase Auth link', e);
        }
      },
      () => {
        // Fallback: Check manual/demo client ID oauth tokens from localStorage
        const savedToken = localStorage.getItem('aurelia_gmail_token');
        if (savedToken) {
          setAccessToken(savedToken);
          setCachedAccessToken(savedToken);
          loadUserProfile(savedToken);
        }
      }
    );

    // Load from localStorage
    const savedClientId = localStorage.getItem('aurelia_gmail_client_id');
    const savedAutoSend = localStorage.getItem('aurelia_gmail_auto_send');
    const savedSubject = localStorage.getItem('aurelia_gmail_template_subject');
    const savedBody = localStorage.getItem('aurelia_gmail_template_body');

    if (savedClientId) setClientId(savedClientId);
    if (savedAutoSend) setAutoSend(savedAutoSend === 'true');
    if (savedSubject) setEmailSubject(savedSubject);
    if (savedBody) setEmailTemplate(savedBody);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadUserProfile = async (token: string) => {
    try {
      setIsLoading(true);
      const profile = await fetchGoogleUserInfo(token);
      setUserProfile(profile);
      setErrorMsg(null);
      // Fetch initial emails
      fetchEmails(token, inboxQuery);
    } catch (err: any) {
      console.warn('Credentials expired or invalid.', err);
      handleDisconnect();
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Attempt standard Google custom project login via Firebase Auth (most secure, no setup required)
      const res = await googleSignIn();
      if (res) {
        const { user, accessToken: token } = res;
        localStorage.setItem('aurelia_gmail_token', token);
        setAccessToken(token);
        
        const profile = {
          email: user.email || '',
          name: user.displayName || '',
          picture: user.photoURL || undefined
        };
        setUserProfile(profile);
        setSuccessMsg(`Aurelia restaurant has successfully established links to Gmail as ${profile.email}`);
        fetchEmails(token, inboxQuery);
      }
    } catch (firebaseErr: any) {
      console.warn('Firebase Auth popup failed or cancelled. Trying manual developer client fallback...', firebaseErr);
      
      // 2. Fallback: Run implicit OAuth if custom Client ID is explicitly specified or needed
      try {
        localStorage.setItem('aurelia_gmail_client_id', clientId);
        const token = await initiateGoogleOAuth(clientId, redirectUri);
        
        localStorage.setItem('aurelia_gmail_token', token);
        setCachedAccessToken(token);
        setAccessToken(token);
        
        const profile = await fetchGoogleUserInfo(token);
        setUserProfile(profile);
        setSuccessMsg(`Aurelia restaurant has successfully established links to Gmail using custom Client ID as ${profile.email}`);
        fetchEmails(token, inboxQuery);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Authorization failed. Please verify that your client setup / Client ID matches.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logoutGmail();
    } catch (e) {
      console.error('Error during logout', e);
    }
    localStorage.removeItem('aurelia_gmail_token');
    setAccessToken(null);
    setUserProfile(null);
    setInboxEmails([]);
    setSelectedEmail(null);
  };

  const fetchEmails = async (token: string, queryStr: string) => {
    if (!token) return;
    setInboxLoading(true);
    try {
      const msgs = await listGmailInbox(token, queryStr);
      setInboxEmails(msgs);
    } catch (err: any) {
      console.error(err);
    } finally {
      setInboxLoading(false);
    }
  };

  const handleTriggerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken) {
      fetchEmails(accessToken, inboxQuery);
    }
  };

  const handleSaveTemplate = () => {
    localStorage.setItem('aurelia_gmail_auto_send', String(autoSend));
    localStorage.setItem('aurelia_gmail_template_subject', emailSubject);
    localStorage.setItem('aurelia_gmail_template_body', emailTemplate);
    setSuccessMsg('Culinary email receipt template updated successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setErrorMsg('No active connection. Link Gmail before dispatching campaigns.');
      return;
    }
    if (!campaignTo || !campaignSubject || !campaignBody) {
      setErrorMsg('Recipient email and message fields are strictly mandatory.');
      return;
    }

    setCampaignLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await sendGmailMessage(accessToken, campaignTo, campaignSubject, campaignBody);
      setSuccessMsg(`Prestige email invitation successfully dispatched to ${campaignTo}!`);
      setCampaignTo('');
      // Refresh inbox to show sent mail if matching search query
      fetchEmails(accessToken, inboxQuery);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to dispatch prestige email.');
    } finally {
      setCampaignLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedEmail || !replyBody) return;

    setReplyLoading(true);
    try {
      // Determine recipient (usually whoever sent it to us, extracted from 'from' header)
      let replyRecipient = selectedEmail.from;
      // Capture email inside brackets if present, e.g. "John Doe <john@gmail.com>"
      const emailMatch = selectedEmail.from.match(/<([^>]+)>/);
      if (emailMatch && emailMatch[1]) {
        replyRecipient = emailMatch[1];
      }

      const replySubject = selectedEmail.subject.toLowerCase().startsWith('re:') 
        ? selectedEmail.subject 
        : `Re: ${selectedEmail.subject}`;

      await sendGmailMessage(
        accessToken,
        replyRecipient,
        replySubject,
        `<p>${replyBody.replace(/\n/g, '<br/>')}</p>`,
        selectedEmail.messageId
      );

      setSuccessMsg('Reply successfully sent!');
      setReplyBody('');
      setTimeout(() => setSuccessMsg(null), 3000);
      
      // Refresh inbox
      fetchEmails(accessToken, inboxQuery);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send reply.');
    } finally {
      setReplyLoading(false);
    }
  };

  const copyRedirectUri = () => {
    navigator.clipboard.writeText(redirectUri);
    setSuccessMsg('Authorized redirect URL copied!');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <section id="gmail-hub" className="relative py-24 sm:py-32 w-full bg-transparent overflow-hidden border-t border-gold-500/5 text-xs text-gold-100">
      <div id="gmail-ambient" className="absolute top-1/4 left-1/3 w-80 h-80 bg-gold-900/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Module Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-gold-accent flex items-center justify-center gap-1.5">
            <Workflow className="w-3.5 h-3.5" /> Google Workspace Integration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white mt-3 font-light tracking-wide">
            Gmail <span className="italic text-gold-accent">Communications</span>
          </h2>
          <div className="w-12 h-[1px] bg-gold-accent/40 mx-auto mt-6" />
        </div>

        {/* Global Connection Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-8 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[13px] uppercase tracking-widest text-[#D4AF37] font-serif flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Server Authentication Settings
                </h3>
                <span className={`px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase ${accessToken ? 'bg-gold-accent/20 text-gold-accent border border-gold-accent/30' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {accessToken ? 'Active Link' : 'Disconnected'}
                </span>
              </div>
              <p className="text-zinc-400 leading-relaxed max-w-3xl mb-6 font-sans">
                Aurelia integrates natively with Google Workspace. Link your restaurant Google Account to automatically dispatch exquisite reservation summaries to guests and interact with booking inquiries.
              </p>

              {!accessToken && (
                <div className="bg-[#0e0e0e] border border-white/5 p-4 rounded-sm space-y-4 font-sans mb-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500 block">Google Cloud OAuth 2.0 Web Client ID</label>
                    <input 
                      type="text" 
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-accent font-mono rounded-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-gold-accent/[0.02] border border-gold-accent/10 gap-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-gold-accent block font-semibold mb-0.5">Authorized Redirect URL for Google Console</span>
                      <span className="text-[10px] text-zinc-400 font-mono select-all break-all">{redirectUri}</span>
                    </div>
                    <button 
                      onClick={copyRedirectUri}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-[#D4AF37]/15 text-gold-accent border border-white/10 hover:border-[#D4AF37]/35 text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy URL
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 border-t border-white/5 pt-4">
              {!accessToken ? (
                <button 
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="gsi-material-button cursor-pointer focus:outline-none hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents tracking-wider py-1.5">Connect Aurelia with Gmail</span>
                  </div>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                  <div className="flex items-center gap-3.5">
                    {userProfile?.picture ? (
                      <img src={userProfile.picture} alt="Profile" className="w-10 h-10 rounded-full border border-gold-accent/40" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gold-accent/20 flex items-center justify-center border border-gold-accent/30 text-gold-accent text-sm font-serif">
                        {userProfile?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div>
                      <span className="text-[11px] text-white block uppercase tracking-wider font-semibold font-sans">{userProfile?.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{userProfile?.email}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleDisconnect}
                    className="px-4 py-2 border border-red-500/20 hover:border-red-500/60 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[10px] uppercase tracking-widest font-semibold transition-all cursor-pointer"
                  >
                    Disconnect Link
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-sm flex flex-col justify-between">
            <div>
              <h3 className="text-[13px] uppercase tracking-widest text-[#D4AF37] font-serif mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> OAuth Connection Guide
              </h3>
              <ul className="space-y-3 font-sans text-zinc-400 text-[11px] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-gold-accent font-bold">1.</span>
                  <span>Set up an OAuth Consent screen in Google Consoles with <strong>Gmail Send/Read</strong> scopes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-accent font-bold">2.</span>
                  <span>Register the copied Redirect URL shown inside the settings on your web client credential.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-accent font-bold">3.</span>
                  <span>For testing without custom setup, use our pre-configured demo client.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-gold-accent/75 font-sans justify-center bg-gold-accent/5 p-2 rounded-sm border border-gold-accent/15">
              <span>● Google Authentication Sandbox Is Active</span>
            </div>
          </div>
        </div>

        {/* Action Status Messages */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3.5 mb-8 rounded-sm font-sans"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-gold-accent/10 border border-gold-accent/40 text-gold-accent text-xs flex items-center gap-3.5 mb-8 rounded-sm font-sans"
            >
              <Check className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard Panel */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-sm">
          
          {/* Internal Navigation Tabs */}
          <div className="border-b border-white/10 flex flex-wrap font-serif text-[11px] uppercase tracking-wider bg-black/20">
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`px-6 py-4 flex items-center gap-2 border-r border-white/10 transition-colors cursor-pointer ${activeTab === 'inbox' ? 'bg-[#0A0A0A] text-gold-accent font-bold border-b-2 border-b-gold-accent' : 'text-zinc-500 hover:text-white'}`}
            >
              <Inbox className="w-3.5 h-3.5" /> Communications Inbox {accessToken && inboxEmails.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-gold-accent text-[#0A0A0A] font-mono text-[9px] font-bold rounded-full">{inboxEmails.length}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('template')}
              className={`px-6 py-4 flex items-center gap-2 border-r border-white/10 transition-colors cursor-pointer ${activeTab === 'template' ? 'bg-[#0A0A0A] text-gold-accent font-bold border-b-2 border-b-gold-accent' : 'text-zinc-500 hover:text-white'}`}
            >
              <FileText className="w-3.5 h-3.5" /> Booking Receipt Auto-Gmail
            </button>
            <button 
              onClick={() => setActiveTab('campaign')}
              className={`px-6 py-4 flex items-center gap-2 transition-colors cursor-pointer ${activeTab === 'campaign' ? 'bg-[#0A0A0A] text-gold-accent font-bold border-b-2 border-b-gold-accent' : 'text-zinc-500 hover:text-white'}`}
            >
              <Send className="w-3.5 h-3.5" /> VIP Invitation Campaign
            </button>
          </div>

          <div className="p-6">
            
            {/* Disconnected state warning message within dashboard tab contents */}
            {!accessToken && (
              <div className="py-16 text-center max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-gold-500/40 mx-auto mb-4" />
                <h4 className="font-serif text-lg text-white mb-2 tracking-wide font-light">Interactive Module Locked</h4>
                <p className="font-sans text-zinc-500 text-xs leading-relaxed">
                  Link Gmail using the Server Authentication config above to browse actual mailbox folders, generate client templates, and trigger gourmet invitations.
                </p>
              </div>
            )}

            {accessToken && (
              <>
                {/* TAB 1: GMAIL COMMUNICATIONS INBOX */}
                {activeTab === 'inbox' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Mailbox List */}
                    <div className="lg:col-span-5 flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold">Latest Inquiry Threads</span>
                        <button 
                          onClick={() => fetchEmails(accessToken, inboxQuery)}
                          disabled={inboxLoading}
                          className="p-1 px-2.5 bg-white/5 hover:bg-white/10 text-gold-accent border border-white/15 text-[9px] uppercase tracking-widest font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${inboxLoading ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                      </div>

                      {/* Search Bar filter */}
                      <form onSubmit={handleTriggerSearch} className="flex gap-2 font-sans">
                        <div className="relative flex-grow">
                          <input 
                            type="text" 
                            placeholder="Filter queries... (e.g. subject:reservation)" 
                            value={inboxQuery}
                            onChange={(e) => setInboxQuery(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 pl-8 pr-3 py-2 text-[11px] text-white focus:outline-none focus:border-gold-accent rounded-none"
                          />
                          <Search className="w-3.5 h-3.5 text-zinc-600 absolute left-2.5 top-2.5" />
                        </div>
                        <button type="submit" className="px-4 bg-[#D4AF37] text-black font-semibold text-[10px] uppercase tracking-wider hover:brightness-110 rounded-none cursor-pointer">Search</button>
                      </form>

                      {/* List container */}
                      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                        {inboxLoading && inboxEmails.length === 0 ? (
                          <div className="py-12 text-center text-zinc-500 font-sans">
                            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gold-accent" /> Loading connected mailbox content...
                          </div>
                        ) : inboxEmails.length === 0 ? (
                          <div className="py-12 text-center text-zinc-500 font-sans">
                            No matching inquiry emails found on connected Google account.
                          </div>
                        ) : (
                          inboxEmails.map((email) => (
                            <div 
                              key={email.id}
                              onClick={() => setSelectedEmail(email)}
                              className={`p-3.5 border transition-all duration-300 relative cursor-pointer text-left ${selectedEmail?.id === email.id ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-white/[0.02] border-white/5 hover:border-gold-accent/40'}`}
                            >
                              <div className="flex justify-between items-start gap-2 mb-1.5">
                                <span className="font-sans font-semibold text-white truncate text-[11px] block max-w-[160px]">{email.from}</span>
                                <span className="font-mono text-[8px] text-zinc-500 whitespace-nowrap">{email.date.split(',')[1] || email.date}</span>
                              </div>
                              <h5 className="font-serif text-white text-[11px] truncate mb-1">{email.subject}</h5>
                              <p className="font-sans text-zinc-500 text-[10px] line-clamp-2 leading-relaxed">{email.snippet}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Email Reader & Reply Compose */}
                    <div className="lg:col-span-7 border-l border-white/5 pl-0 lg:pl-6">
                      {selectedEmail ? (
                        <div className="space-y-6 text-left">
                          
                          {/* Thread Header */}
                          <div className="border-b border-white/10 pb-4">
                            <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 block mb-1">Inquiry Reader</span>
                            <h3 className="font-serif text-xl text-white font-light tracking-wide mb-3">{selectedEmail.subject}</h3>
                            
                            <div className="space-y-1 text-zinc-400 font-sans text-[11px]">
                              <div><strong className="text-zinc-500 font-normal">From:</strong> <span className="text-white font-medium">{selectedEmail.from}</span></div>
                              <div><strong className="text-zinc-500 font-normal">To:</strong> <span>{selectedEmail.to}</span></div>
                              <div><strong className="text-zinc-500 font-normal">Date:</strong> <span>{selectedEmail.date}</span></div>
                            </div>
                          </div>

                          {/* Email Body */}
                          <div className="bg-black/40 border border-white/5 p-6 rounded-sm min-h-[160px] max-h-[300px] overflow-y-auto">
                            {selectedEmail.body.includes('<') ? (
                              <div className="font-sans text-xs leading-relaxed text-[#eee]" dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
                            ) : (
                              <p className="font-serif text-xs leading-relaxed text-[#eee] whitespace-pre-wrap">{selectedEmail.body}</p>
                            )}
                          </div>

                          {/* Reply formulation */}
                          <div className="border-t border-white/10 pt-5 space-y-4 font-sans">
                            <h4 className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1.5">
                              <CornerUpLeft className="w-3.5 h-3.5" /> Compose Reply
                            </h4>
                            <form onSubmit={handleSendReply} className="space-y-4">
                              <textarea 
                                placeholder="Write elegant feedback or response to guest. Sent directly through linked Gmail account..."
                                value={replyBody}
                                onChange={(e) => setReplyBody(e.target.value)}
                                rows={4}
                                required
                                className="w-full bg-[#111] border border-white/10 p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-gold-accent rounded-none"
                              />
                              <div className="flex justify-end">
                                <button 
                                  type="submit" 
                                  disabled={replyLoading || !replyBody}
                                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-semibold text-[11px] uppercase tracking-widest hover:brightness-115 flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer rounded-none"
                                >
                                  {replyLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Send Reply Mail
                                </button>
                              </div>
                            </form>
                          </div>

                        </div>
                      ) : (
                        <div className="h-full flex flex-col justify-center items-center text-center py-20 text-zinc-500 font-sans">
                          <Mail className="w-12 h-12 text-gold-500/20 mb-3" />
                          <p className="text-xs">Select an inquiry thread from the left list workspace to review culinary content, customer requests, or write mail replies.</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* TAB 2: BOOKING RECEIPT AUTO-GMAIL TEMPLATES */}
                {activeTab === 'template' && (
                  <div className="max-w-4xl mx-auto space-y-6 text-left font-sans">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-[14px] uppercase tracking-widest text-[#D4AF37] font-serif">Aurelia Auto-Mailer Configuration</h3>
                        <p className="text-xs text-zinc-500 mt-1">Configure automated gourmet receipts sent when tables are booked successfully.</p>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Automate Services:</label>
                        <button 
                          onClick={() => setAutoSend(!autoSend)}
                          className={`w-12 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${autoSend ? 'bg-[#D4AF37]' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-5 h-5 bg-[#000] rounded-full transition-all duration-300 ${autoSend ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 p-6 rounded-sm border border-white/5">
                      
                      {/* Template Editors */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-widest text-zinc-500">Email Title / Subject Line</label>
                          <input 
                            type="text"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-accent font-sans rounded-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-500">HTML Mail Template Content</label>
                            <span className="text-[8px] font-mono text-gold-accent">Supported tags: HTML / CSS styling</span>
                          </div>
                          <textarea 
                            value={emailTemplate}
                            onChange={(e) => setEmailTemplate(e.target.value)}
                            rows={12}
                            className="w-full bg-[#111] border border-white/10 p-3 text-[11px] font-mono text-[#D4AF37] focus:outline-none focus:border-gold-accent rounded-none leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Help documentation on placeholders */}
                      <div className="flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">Format Placeholders (Strictly Cases)</h4>
                          <p className="text-zinc-500 text-xs">Our system replaces the following brackets at execution to personalize confirmation mailings:</p>
                          
                          <div className="grid grid-cols-2 gap-3.5 font-mono text-[9px]">
                            <div className="p-2 bg-[#121212] border border-white/5 rounded-sm">
                              <span className="text-gold-accent block mb-0.5">[Name]</span>
                              <span className="text-zinc-400">Guest Name</span>
                            </div>
                            <div className="p-2 bg-[#121212] border border-white/5 rounded-sm">
                              <span className="text-gold-accent block mb-0.5">[Code]</span>
                              <span className="text-zinc-400">AUR receipt code</span>
                            </div>
                            <div className="p-2 bg-[#121212] border border-white/5 rounded-sm">
                              <span className="text-gold-accent block mb-0.5">[Date]</span>
                              <span className="text-zinc-400">Booking calendar date</span>
                            </div>
                            <div className="p-2 bg-[#121212] border border-white/5 rounded-sm">
                              <span className="text-gold-accent block mb-0.5">[Time]</span>
                              <span className="text-zinc-400">Seating hour chosen</span>
                            </div>
                            <div className="p-2 bg-[#121212] border border-white/5 rounded-sm">
                              <span className="text-gold-accent block mb-0.5">[Guests]</span>
                              <span className="text-zinc-400">Cover size / Guests count</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gold-accent/[0.02] border border-gold-accent/20 p-4 rounded-sm text-[11px] leading-relaxed text-zinc-400">
                          <strong className="text-white block font-serif uppercase tracking-widest text-[9px] mb-1.5">● Preview rendering template is active</strong>
                          Upon submitting a booking, the customer will receive an elegant email constructed from this markup, sent immediately via your connected account.
                        </div>

                        <div className="flex justify-end pt-4">
                          <button 
                            onClick={handleSaveTemplate}
                            className="px-6 py-2.5 bg-[#D4AF37] text-black font-semibold text-[11px] uppercase tracking-widest hover:brightness-110 transition-colors rounded-none cursor-pointer"
                          >
                            Save Auto-Mailer Settings
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 3: VIP INVITATION MOVES */}
                {activeTab === 'campaign' && (
                  <form onSubmit={handleSendCampaign} className="max-w-3xl mx-auto space-y-5 text-left font-sans">
                    <div>
                      <h3 className="text-[14px] uppercase tracking-widest text-[#D4AF37] font-serif">VIP Invitation Dispatcher</h3>
                      <p className="text-xs text-zinc-500 mt-1">Broadcast high-concept newsletters, private dinners, or winery suite invitations directly to loyal patrons.</p>
                    </div>

                    <div className="bg-black/30 border border-white/5 p-6 rounded-sm space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-zinc-500 block font-semibold">Recipient E-mail *</label>
                        <input 
                          type="email"
                          required
                          value={campaignTo}
                          onChange={(e) => setCampaignTo(e.target.value)}
                          placeholder="e.g. lady-byron@estate.org"
                          className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-gold-accent rounded-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-zinc-500 block font-semibold">Subject Title *</label>
                        <input 
                          type="text"
                          required
                          value={campaignSubject}
                          onChange={(e) => setCampaignSubject(e.target.value)}
                          className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-accent rounded-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-zinc-500 block font-semibold">Invitation Body Content (HTML / Text Preview) *</label>
                        <textarea 
                          required
                          value={campaignBody}
                          onChange={(e) => setCampaignBody(e.target.value)}
                          rows={6}
                          className="w-full bg-[#111] border border-white/10 p-3 text-xs text-[#D4AF37] font-mono focus:outline-none focus:border-gold-accent rounded-none leading-relaxed"
                        />
                      </div>

                      <div className="flex justify-end pt-4">
                        <button 
                          type="submit" 
                          disabled={campaignLoading}
                          className="px-6 py-2.5 bg-[#D4AF37] text-black font-semibold text-[11px] uppercase tracking-widest hover:brightness-110 flex items-center gap-2 transition-all cursor-pointer rounded-none"
                        >
                          {campaignLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Dispatch Prestige Invitation
                        </button>
                      </div>
                    </div>

                  </form>
                )}

              </>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
