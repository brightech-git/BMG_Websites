import React from 'react';
import { useSelector } from 'react-redux';
import RecentlyViewed from './RecentlyViewed';

const RecentlyViewedWrapper = () => {
    const user = useSelector((state) => state.user?.user); // adjust if your slice is named differently

    if (!user) return null; // User not logged in

    return <RecentlyViewed />;
};

export default RecentlyViewedWrapper;
