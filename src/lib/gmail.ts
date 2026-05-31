import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import { GmailMessage } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider with accurate scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');

// Secure in-memory access token cache
let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Initialize Firebase authentication state listener.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Google Sign-In with popup via standard Firebase Auth.
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google Auth.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In failed via Firebase popup:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieve current active access token.
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Synchronous accessor for in-memory token.
 */
export const getCachedAccessTokenSync = (): string | null => {
  return cachedAccessToken;
};

/**
 * Manually update the cached access token (for custom client IDs background sync).
 */
export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Revokes current authentication sessions.
 */
export const logoutGmail = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Default OAuth Client ID if not configured in environment
export const DEFAULT_CLIENT_ID = '316972046894-3u48bevgqsc385966v8v42j4l1bepk0o.apps.googleusercontent.com'; // Demo Google client ID

/**
 * Initiates standard client-side implicit grant flow for Google Gmail API.
 * This works beautifully inside iframe environments since the popup handles origin redirects 
 * and communicates credentials back to our main window.
 */
export const initiateGoogleOAuth = (clientId: string, redirectUri: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: scopes,
      include_granted_scopes: 'true',
      state: 'aurelia-luxury-gmail',
      prompt: 'consent'
    }).toString();

    // Open popup
    const popup = window.open(authUrl, 'google_oauth_popup', 'width=600,height=700,status=no,toolbar=no,menubar=no');

    if (!popup) {
      reject(new Error('Popup blocked. Please enable popups in your browser to authorize access to Gmail.'));
      return;
    }

    // Set up message listener for return
    const messageListener = (event: MessageEvent) => {
      // Allow parent-child popup postMessage exchanges
      if (event.data?.type === 'AURELIA_OAUTH_SUCCESS' && event.data?.accessToken) {
        window.removeEventListener('message', messageListener);
        resolve(event.data.accessToken);
      }
    };

    window.addEventListener('message', messageListener);

    // Poll the popup window state to reject on explicit manual close
    const pollInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollInterval);
        window.removeEventListener('message', messageListener);
        // Sometimes the message fires right before closing, allow some delay before rejecting
        setTimeout(() => {
          reject(new Error('Authentication window closed by user.'));
        }, 1200);
      }
    }, 1000);
  });
};

/**
 * Handle incoming callback hash on redirect (embedded in popup callback handler)
 */
export const checkAndDispatchOAuthCallback = () => {
  if (window.location.hash) {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    const state = params.get('state');

    if (accessToken && state === 'aurelia-luxury-gmail') {
      if (window.opener) {
        window.opener.postMessage({
          type: 'AURELIA_OAUTH_SUCCESS',
          accessToken: accessToken
        }, '*');
        window.close();
      }
    }
  }
};

/**
 * Call the user info endpoint to fetch details of the authenticated account
 */
export const fetchGoogleUserInfo = async (accessToken: string) => {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    throw new Error('Failed to retrieve Google profile information.');
  }
  return await res.json(); // { email, name, picture }
};

/**
 * Encodes subjects and bodies as RAW base64 according to the RFC 2822 specification
 */
const makeRawEmailPayload = (to: string, subject: string, htmlBody: string, messageIdToReply?: string): string => {
  const boundary = 'aurelia-email-boundary';
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ];

  if (messageIdToReply) {
    emailLines.push(`In-Reply-To: ${messageIdToReply}`);
    emailLines.push(`References: ${messageIdToReply}`);
  }

  emailLines.push('');
  emailLines.push(`--${boundary}`);
  emailLines.push('Content-Type: text/plain; charset="utf-8"');
  emailLines.push('Content-Transfer-Encoding: 7bit');
  emailLines.push('');
  // Plaintext version (strip tags)
  emailLines.push(htmlBody.replace(/<[^>]*>?/gm, ''));
  emailLines.push('');
  emailLines.push(`--${boundary}`);
  emailLines.push('Content-Type: text/html; charset="utf-8"');
  emailLines.push('Content-Transfer-Encoding: base64');
  emailLines.push('');
  
  // Base64 encode the HTML body
  const utf8EncodedHtml = unescape(encodeURIComponent(htmlBody));
  const base64Body = btoa(utf8EncodedHtml);
  // Gmail expects standard line breaks for transfer encoding
  const chunks = base64Body.match(/.{1,76}/g) || [base64Body];
  emailLines.push(...chunks);
  emailLines.push('');
  emailLines.push(`--${boundary}--`);

  const fullEmail = emailLines.join('\r\n');
  
  // Base64URL encode the entire raw string
  return btoa(unescape(encodeURIComponent(fullEmail)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Sends an email using the connected Gmail account
 */
export const sendGmailMessage = async (
  accessToken: string,
  to: string,
  subject: string,
  htmlBody: string,
  messageIdToReply?: string
): Promise<{ id: string; threadId: string }> => {
  const raw = makeRawEmailPayload(to, subject, htmlBody, messageIdToReply);
  
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Failed to dispatch email via Gmail API.');
  }

  return await res.json();
};

/**
 * Lists the latest messages from the authenticated Gmail mailbox
 */
export const listGmailInbox = async (accessToken: string, query: string = ''): Promise<GmailMessage[]> => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?` + new URLSearchParams({
    maxResults: '12',
    q: query
  }).toString();

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    throw new Error('Could not pull mailbox list from Gmail REST endpoints.');
  }

  const { messages } = await res.json();
  if (!messages || messages.length === 0) {
    return [];
  }

  // Resolve full details for each message in parallel
  const detailPromises = messages.map(async (msg: { id: string; threadId: string }) => {
    try {
      const detailsUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`;
      const detailRes = await fetch(detailsUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!detailRes.ok) return null;

      const fullData = await detailRes.json();
      
      const headers = fullData.payload.headers || [];
      const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

      const subject = getHeader('subject') || '(No Subject)';
      const from = getHeader('from') || 'Unknown Sender';
      const to = getHeader('to') || 'Unknown Recipient';
      const date = getHeader('date') || '';
      const messageId = getHeader('message-id') || '';
      
      // Attempt to extract the body content
      let body = '';
      if (fullData.payload.parts) {
        // Look for plain or html parts
        const htmlPart = fullData.payload.parts.find((p: any) => p.mimeType === 'text/html');
        const textPart = fullData.payload.parts.find((p: any) => p.mimeType === 'text/plain');
        const activePart = htmlPart || textPart || fullData.payload.parts[0];
        if (activePart && activePart.body && activePart.body.data) {
          body = parseGmailBodyBase64(activePart.body.data);
        }
      } else if (fullData.payload.body && fullData.payload.body.data) {
        body = parseGmailBodyBase64(fullData.payload.body.data);
      }

      return {
        id: msg.id,
        threadId: msg.threadId,
        subject,
        from,
        to,
        date,
        snippet: fullData.snippet || '',
        body: body || fullData.snippet || '',
        messageId
      };
    } catch (e) {
      console.error(`Failed to handle details for message ${msg.id}`, e);
      return null;
    }
  });

  const resolved = await Promise.all(detailPromises);
  return resolved.filter((item): item is GmailMessage => item !== null);
};

/**
 * Decode base64url content safely to UTF-8 text/HTML
 */
const parseGmailBodyBase64 = (base64urlStr: string): string => {
  try {
    const base64 = base64urlStr.replace(/-/g, '+').replace(/_/g, '/');
    const binaryStr = atob(base64);
    
    // Convert binary to array of bytes
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    
    // Safely decode Multi-Byte Unicode sequences (e.g. Emoji, accents)
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
  } catch (err) {
    console.error('Failed to parse base64 body segment:', err);
    return 'Could not decode message source.';
  }
};
