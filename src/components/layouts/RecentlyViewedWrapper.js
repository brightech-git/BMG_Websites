import React from 'react';
import { useSelector } from 'react-redux';
import RecentlyViewed from './RecentlyViewed';

const RecentlyViewedWrapper = () => {
    const isAuthenticated = useSelector((state) => state.user?.isAuthenticated);
    //console.log(isAuthenticated,'recentlyViewed');

    if (!isAuthenticated) return null; // User not logged in

    return <RecentlyViewed />;
};

export default RecentlyViewedWrapper;
