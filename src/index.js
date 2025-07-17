// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import { UserAuthProvider } from './context/authContext/UserAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// CSS
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/slick-carousel/slick/slick.css';
import '../node_modules/slick-carousel/slick/slick-theme.css';
import '../node_modules/animate.css/animate.css';
import '../node_modules/magnific-popup/dist/magnific-popup.css';
import './assets/css/font-awesome.min.css';
import './assets/css/flaticon.css';
import './assets/fonts/flaticon/flaticon-2.css';
import './assets/css/default.css';
import './assets/css/style.css';

// Create react-query client
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserAuthProvider>
        <BrowserRouter basename="/themes/themeforest/react/laramiss">
          <App />
        </BrowserRouter>
      </UserAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('laramiss')
);

serviceWorker.unregister();
