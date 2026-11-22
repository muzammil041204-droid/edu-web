// Fonts are bundled with the site (no third-party font requests).
import '@fontsource-variable/plus-jakarta-sans/index.css';
import '@fontsource/instrument-serif/400-italic.css';
import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
