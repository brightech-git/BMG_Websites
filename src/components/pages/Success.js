import React from "react";
import './Success.css';
import Headers from "../layouts/HeaderWithAuth";
import Footertwo from "../layouts/Footerthree";

const Success = () => {
    return (

        <>
        <section>
           <Headers />
        </section>
        <div className="success-page-container">
            <div className="success-card animate-fade-in">
                <i className="fas fa-check-circle success-icon"></i>
                <h2>Form Submitted Successfully!</h2>
                <p>Thank you for reaching out. We will get back to you shortly.</p>

                    <a
                        href="/"
                        className="gtm-click animate-fade-out"
                        onClick={() => window.dataLayer.push({ event: "formSubmissionSuccess",formName: "Contact Form" })}
                    >
                        Go Back Home
                    </a>

            </div>
        </div>
        <section>
            <Footertwo />
        </section>
        </>
    );
};

export default Success;
