export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  image: string;
  dietary: string[];
  signature?: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  role: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'interior' | 'dish' | 'wine' | 'experience';
  image: string;
  description: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableType: 'standard' | 'chef-table' | 'window' | 'cellar';
  specialRequests?: string;
  confirmationCode: string;
  status: 'confirmed' | 'pending';
}

export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  body: string;
  messageId?: string;
}

export interface GmailConfig {
  clientId: string;
  accessToken: string | null;
  expiryTime: number | null;
  userEmail: string | null;
  userName: string | null;
}

