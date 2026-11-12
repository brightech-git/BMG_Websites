import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import MaintenancePage from './features/maintenance/components/MaintenancePage';
import { useWebsiteMaintenance } from './features/maintenance/hooks/useWebsiteMaintenance';

import {QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// CSS
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './assets/css/animations.css';



import { Provider } from 'react-redux';
import { store } from './store/index'; // adjust path
import { NotificationProvider } from './context/notification/NotificationContext';
import { CompanyDetailsProvider } from './context/clientDetails/clientDetialContext';

import './assets/css/style.css';
import './assets/css/animations.css';
import './index.css';


import { PincodeProvider } from './context/pinocde/PincodeContext';
import MainLayout from './component/layout/MainLayout';
import { queryClient } from './component/reactQuery/queryClient';


const maintenanceAccessKey = "bmg-maintenance-access";

function Root() {
  const [hasAccess, setHasAccess] = useState(() => {
    try {
      return localStorage.getItem(maintenanceAccessKey) === "granted";
    } catch {
      return false;
    }
  });

  function grantAccess() {
    try {
      localStorage.setItem(maintenanceAccessKey, "granted");
    } catch {
      // Access still works for the current visit if storage is unavailable.
    }
    setHasAccess(true);
  }

  const { data: maintenance, isPending } = useWebsiteMaintenance();

  console.log(maintenance,'maintenance')

  if (isPending) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--orange-50)]">
        <p role="status">Loading bmg world</p>
      </main>
    );
  }

  if (maintenance && !hasAccess) {
    return (
      <MaintenancePage
        message={maintenance.maintenanceMsg}
        onAccess={grantAccess}
      />
    );
  }

  return (
    <NotificationProvider>
      <CompanyDetailsProvider>
        <PincodeProvider>
          <MainLayout>
            <App />
          </MainLayout>
        </PincodeProvider>
      </CompanyDetailsProvider>
    </NotificationProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Root />
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
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)
