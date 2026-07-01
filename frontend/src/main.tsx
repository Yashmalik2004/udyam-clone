/**
 * main.tsx — React Application Entry Point
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppRouter } from './routes/AppRouter';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in the DOM.');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
