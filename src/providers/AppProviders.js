// src/providers/AppProviders.js
import React from 'react';
import { UserAuthProvider } from '../context/authContext/UserAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AppProviders = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <UserAuthProvider>
            {children}
        </UserAuthProvider>
    </QueryClientProvider>
);

export default AppProviders;
