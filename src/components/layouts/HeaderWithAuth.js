// src/components/layouts/HeaderWithAuth.js
import React from 'react';
import Header from './Header'; // Your existing class component
import { useSelector } from 'react-redux';

const HeaderWithAuth = (props) => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    return <Header {...props} isAuthenticated={isAuthenticated} />;
};

export default HeaderWithAuth;
