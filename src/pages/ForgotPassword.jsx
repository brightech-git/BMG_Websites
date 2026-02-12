import React, { Fragment } from 'react';
import ForgotPasswordContent from '../components/sections/home/forgot-password/Content';
import { useDocumentMeta } from '../utils/meta/useMeta';

const ForgotPassword = () => {
    // Set page title and description
    useDocumentMeta({
        title: "Bmg | Forgot Password",
        description: "Reset your BMG account password",
    });

    return (
        <Fragment>
         
            {/* <Breadcrumb breadcrumb={{ pagename: 'Forgot Password' }} /> */}
            <ForgotPasswordContent />
       
        </Fragment>
    );
};

export default ForgotPassword;
