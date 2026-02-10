import React from 'react';
import HeaderWithAuth from '../../layouts/HeaderWithAuth';
import Breadcrumbs from '../../layouts/Breadcrumbs';
import Footer from '../../layouts/Footer';
import AppointmentPage from './VirtualShop';
import { useDocumentMeta } from '../../../utils/meta/useMeta';


function Appointment(){


    useDocumentMeta({
        title: "Bmg | Virtual Appointment",
        description: "Book a virtual shopping appointment with BMG",
    });
return(

        <>
        <HeaderWithAuth />
            {/* Pass query params into breadcrumb just like ShopLeft */}
            <Breadcrumbs pages={"Virtual Appointment"} />
            <AppointmentPage />
            <Footer />
        </>

)
} 
export default Appointment;