import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ProgresoProvider } from './context/ProgresoContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProgresoProvider>
      <App />
    </ProgresoProvider>
  </React.StrictMode>,
);
