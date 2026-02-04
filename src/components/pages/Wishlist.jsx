import React from 'react';
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/wishlist/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta';



function Wishlist(){

        useDocumentMeta({
                title: "Bmg | Wishlist",
                description: "Your wishlist items",
})
        return (
        <>
                <Header />
                <Breadcrumb pages={"Whislist"} />
                <Content />
                <Footer />
        </>
        );
}

export default Wishlist;