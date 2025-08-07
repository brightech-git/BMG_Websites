import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import { UserAuthProvider } from './context/authContext/UserAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ToastContainer } from 'react-toastify'; // ✅ Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // ✅ Import styles

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

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <UserAuthProvider>
          <BrowserRouter>
            <App />
            <ToastContainer // ✅ Add this below App to show toasts anywhere
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
              draggable
            />
          </BrowserRouter>
        </UserAuthProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('bmg')
);

serviceWorker.unregister();
