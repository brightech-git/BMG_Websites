// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../components/pages/Home';
import About from '../components/pages/About';
import Account from '../components/pages/Account';
import Blogdetail from '../components/pages/Blogdetail';
import Bloggrid from '../components/pages/Bloggrid';
import Bloggridsidebar from '../components/pages/Bloggridsidebar';
import Bloglist from '../components/pages/Bloglist';
import Cart from '../components/pages/Cart';
import Checkout from '../components/pages/Checkout';
import Classification from '../components/pages/Classification';
import Comingsoon from '../components/pages/Comingsoon';
import Contact from '../components/pages/Contact';
import Error from '../components/pages/Error';
import Faq from '../components/pages/Faq';
import Gallery from '../components/pages/Gallery';
import Gallerytwo from '../components/pages/Gallerytwo';
import Legal from '../components/pages/Legal';
import Login from '../components/pages/Login';
import Register from '../components/pages/Register';
import Shopdetail from '../components/pages/Shopdetail';
import Shopleft from '../components/pages/Shopleft';
import Team from '../components/pages/Team';
import Typography from '../components/pages/Typography';
import Wishlist from '../components/pages/Wishlist';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />
        <Route path="/blog-detail" element={<Blogdetail />} />
        <Route path="/blog-grid" element={<Bloggrid />} />
        <Route path="/blog-grid-sidebar" element={<Bloggridsidebar />} />
        <Route path="/blog-list" element={<Bloglist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/classification" element={<Classification />} />
        <Route path="/coming-soon" element={<Comingsoon />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery-two" element={<Gallerytwo />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop-detail" element={<Shopdetail />} />
        <Route path="/shop-left" element={<Shopleft />} />
        <Route path="/team" element={<Team />} />
        <Route path="/typography" element={<Typography />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<Error />} />
    </Routes>
);

export default AppRoutes;
