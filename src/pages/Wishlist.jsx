import React from 'react';
import Breadcrumb from '../components/layouts/Breadcrumbs';
import Content from '../components/sections/wishlist/Content';
import { useDocumentMeta } from '../utils/meta/useMeta';



function Wishlist() {

        useDocumentMeta({
                title: "Bmg | Wishlist",
                description: "Your wishlist items",
        })
        return (
                <>

                        <Breadcrumb pages={"Whislist"} />
                        <Content />

                </>
        );
}

export default Wishlist;