import React from 'react';
import Breadcrumb from '../../../components/layouts/Breadcrumbs';
import Content from './wishlist/Content';
import { useDocumentMeta } from '../../../utils/meta/useMeta';



function Wishlist() {

        useDocumentMeta({
                title: "Bmg | Wishlist",
                description: "Your wishlist items",
        })
        return (
                <>

                        <Breadcrumb pages={"Wishlist"} />
                        <Content />

                </>
        );
}

export default Wishlist;