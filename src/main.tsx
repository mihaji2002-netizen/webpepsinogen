import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// `basename` lets the app work both at the domain root (Vercel/Netlify) and
// under a sub-path (GitHub Pages, e.g. /webpepsinogen/). Vite injects BASE_URL
// from the build `base` option; we strip the trailing slash for React Router.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
