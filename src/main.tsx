import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkAndDispatchOAuthCallback } from './lib/gmail';

// Check if this window was opened as an OAuth popup
checkAndDispatchOAuthCallback();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

