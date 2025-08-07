import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProviders';

import { ToastContainer } from 'react-toastify'; // ✅ Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // ✅ Import styles

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'animate.css/animate.css';
import 'magnific-popup/dist/magnific-popup.css';
import './assets/css/font-awesome.min.css';
import './assets/css/flaticon.css';
import './assets/fonts/flaticon/flaticon-2.css';
import './assets/css/default.css';
import './assets/css/style.css';
import 'react-image-lightbox/style.css';

<<<<<<< Updated upstream
import { Provider } from 'react-redux';
import { store } from './store/index'; // adjust path

const queryClient = new QueryClient();
=======
import * as serviceWorker from './serviceWorker';
>>>>>>> Stashed changes

const container = document.getElementById('laramiss');
const root = createRoot(container);

root.render(
  <React.StrictMode>
<<<<<<< Updated upstream
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <UserAuthProvider>
          <BrowserRouter>
            <App />
            <ToastContainer // ✅ Add this below App to show toasts anywhere
              position="top-right"
              autoClose={3000}
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
=======
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
>>>>>>> Stashed changes
);

serviceWorker.unregister();
