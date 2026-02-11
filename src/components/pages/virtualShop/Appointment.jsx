import React from 'react';
import Breadcrumbs from '../../layouts/Breadcrumbs';
import AppointmentPage from './VirtualShop';
import { useDocumentMeta } from '../../../utils/meta/useMeta';


function Appointment(){


    useDocumentMeta({
        title: "Bmg | Virtual Appointment",
        description: "Book a virtual shopping appointment with BMG",
    });
return(

        <>
            {/* Pass query params into breadcrumb just like ShopLeft */}
            <Breadcrumbs pages={"Virtual Appointment"} />
            <AppointmentPage />
        
        </>

)
} 
export default Appointment;