import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';


const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Failed to find the root element');
const root = ReactDOMClient.createRoot(rootEl);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
