// src/components/layouts/HeaderWithAuth.js
import React from 'react';
import Header from './Header';
import { useSelector } from 'react-redux';

const HeaderWithAuth = (props) => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    console.log('HeaderWithAuth isAuthenticated:', isAuthenticated); // Debug

    return <Header {...props} isAuthenticated={isAuthenticated} />;
};

export default HeaderWithAuth;