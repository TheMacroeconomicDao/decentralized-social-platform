/* eslint-disable @conarti/feature-sliced/public-api */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset.css';
import './styles/globals.css';
import { Provider } from 'react-redux';
import { store } from './model/index.ts';
import { QueryClientApp } from './TanstackQuery/QueryClientApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientApp />
    </Provider>
  </StrictMode>
);