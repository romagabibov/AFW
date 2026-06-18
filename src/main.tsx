import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Analytics } from "@vercel/analytics/react";
import App from './App.tsx';
import './index.css';

const gaId = import.meta.env.VITE_GA_ID;
if (gaId) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  const initScript = document.createElement("script");
  initScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  `;
  document.head.appendChild(initScript);
}

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Analytics />
  </>
);
