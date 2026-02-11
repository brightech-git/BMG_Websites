import React, { useEffect, useState } from "react";
import "./SupportPage.css";
import { getCompanyDetails } from "../../service/companyDetials";

function SupportPage() {
    const [companyInfo, setCompanyInfo] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getCompanyDetails();
                setCompanyInfo(data?.[0]);
            } catch (error) {
                console.error("Error fetching company details:", error);
            }
        })();
    }, []);

    const cleanPhone = (num) => num?.replace(/\D/g, "");

    const handleCall = (phone) => {
        if (!phone) return;
        window.location.href = `tel:${cleanPhone(phone)}`;
    };

    const handleEmail = (email) => {
        if (!email) return;
        window.location.href = `mailto:${email}`;
    };

    const handleWhatsApp = (msg) => {
        const phone = cleanPhone(companyInfo?.cPhone);
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
    };

    const handleOpenMap = () => {
        const fullAddress = `${companyInfo?.cAddress1}, ${companyInfo?.cAddress2}, ${companyInfo?.cPincode}`;
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
        );
    };

    return (
        <div className="support-container">
            <div className="support-bg">
             

                <div className="support-content">
                    {/* QUICK ACTION GRID */}
                    <div className="quick-grid">
                        <div
                            className="quick-box"
                            onClick={() =>
                                handleWhatsApp("Hello! I need help via Live Chat.")
                            }
                        >
                            <i className="material-icons">chat</i>
                            <p>Live Chat</p>
                        </div>

                        <div
                            className="quick-box"
                            onClick={() => handleCall(companyInfo?.cPhone)}
                        >
                            <i className="material-icons">description</i>
                            <p>Leave Message</p>
                        </div>

                        <div
                            className="quick-box"
                            onClick={() => handleEmail(companyInfo?.cEmail)}
                        >
                            <i className="material-icons">mail</i>
                            <p>Send Email</p>
                        </div>

                        <div
                            className="quick-box"
                            onClick={() => handleCall(companyInfo?.cPhone)}
                        >
                            <i className="material-icons">call</i>
                            <p>Call Support</p>
                        </div>

                        <div className="quick-box" onClick={() => handleOpenMap()}>
                            <i className="material-icons">location_on</i>
                            <p>Location</p>
                        </div>

                        <div
                            className="quick-box"
                        >
                            <i className="material-icons">help_outline</i>
                            <p>FAQs</p>
                        </div>
                    </div>

                    {/* SUPPORT HOURS */}
                    <div className="hours-card">
                        <h3>Customer Support Hours</h3>

                        <div className="hours-row">
                            <span>Monday - Saturday</span>
                            <span>10:00 AM - 6:00 PM</span>
                        </div>

                        <div className="hours-row">
                            <span>Sunday</span>
                            <span>11:00 AM - 4:00 PM</span>
                        </div>
                    </div>
                </div>

            
            </div>
        </div>
    );
}

export default SupportPage;
