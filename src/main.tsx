import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Debug logging
console.log('Environment:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  VITE_API_URL: (import.meta as any).env.VITE_API_URL,
  BASE_URL: import.meta.env.BASE_URL
});

// Add error handling for debugging
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div>Error: Root element not found</div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('Error rendering React app:', error);
    rootElement.innerHTML = '<div>Error loading app. Check console for details.</div>';
  }
}