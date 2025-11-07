import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

import { Provider } from 'react-redux';
import { store } from './store/index'; // adjust path
import { NotificationProvider } from './context/notification/NotificationContext';

const queryClient = new QueryClient();

// ✅ Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('bmg'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <BrowserRouter>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
              draggable
            />
          </BrowserRouter>
        </NotificationProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

serviceWorker.unregister();
