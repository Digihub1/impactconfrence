import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';


const container = document.getElementById('root');

if (!container) {
  throw new Error("Root container '#root' not found.");
}

try {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  container.innerHTML = `<div style="font-family: ui-sans-serif, system-ui; padding: 24px; color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin: 24px;">
    <h1 style="font-size: 16px; font-weight: 800; margin: 0 0 8px;">App failed to mount</h1>
    <pre style="white-space: pre-wrap; font-size: 12px; margin: 0;">${message}</pre>
  </div>`;
  // eslint-disable-next-line no-console
  console.error('Failed to mount React app:', err);
}

