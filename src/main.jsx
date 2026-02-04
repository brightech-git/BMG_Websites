import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// CSS
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import '../node_modules/animate.css/animate.css';

import './assets/css/animations.css';
import { Provider } from 'react-redux';
import { store } from './store/index'; // adjust path
import { NotificationProvider } from './context/notification/NotificationContext';
import { CompanyDetailsProvider } from './context/clientDetails/clientDetialContext';

import './assets/css/style.css';
import './assets/css/animations.css';
import './assets/css/utils.css';

import './index.css'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
}); 

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <CompanyDetailsProvider>
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
          </CompanyDetailsProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)
