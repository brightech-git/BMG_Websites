// src/components/layouts/HeaderWithAuth.js
import React from 'react';
import Header from './Header'; // your existing class component
import { useAuth } from '../../context/authContext/UserAuthContext';

const HeaderWithAuth = (props) => {
    const { isAuthenticated } = useAuth();
    return <Header {...props} isAuthenticated={isAuthenticated} />;
};

export default HeaderWithAuth;
