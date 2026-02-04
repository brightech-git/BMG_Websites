import React, { useEffect } from "react";
import "./SchemePrivacyPolicy.css";
import HeaderWithAuth from "../layouts/HeaderWithAuth";
import Footertwo from "../layouts/Footer";

function SchemePrivacyPolicy() {
    const handleExternalLink = (url) => {
        window.open(url, "_blank");
    };

    const handleEmail = () => (window.location.href = "mailto:Contact@bmgjewellers.in");
    const handlePhoneCall = () => (window.location.href = "tel:+919514333601");

    const policySections = [
        {
            title: "Introduction",
            icon: "info",
            content:
                "At BMG Jewellers, your privacy is our top priority. This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you use our Jewellery Chit App, website, or related services.",
        },
        {
            title: "Information We Collect",
            icon: "person",
            subsections: [
                {
                    title: "Personal Information",
                    content:
                        "Full Name, Date of Birth, Gender, Contact Details, Residential Address, Government-issued ID (Aadhaar, PAN), Photographs",
                },
                {
                    title: "Financial Information",
                    content:
                        "Bank Account Details, UPI ID, Transaction History, Payment Records, Chit contributions",
                },
                {
                    title: "Technical Information",
                    content:
                        "Device Information, IP Address, Location, App usage patterns",
                },
            ],
        },
        {
            title: "Purpose of Data Collection",
            icon: "data_usage",
            content:
                "Register and manage your account, Enable chit scheme participation, Process payments and transactions, Verify identity and prevent fraud, Communicate updates and offers, Enhance app performance and security",
        },
        {
            title: "Data Sharing & Disclosure",
            icon: "share",
            subsections: [
                {
                    title: "We Share With",
                    content:
                        "Trusted Service Providers, Legal Authorities (when required), Business Transfers (merger/acquisition)",
                },
                {
                    title: "We Never Share With",
                    content: "Third parties for commercial gain without your consent",
                },
            ],
        },
        {
            title: "Your Rights",
            icon: "security",
            content:
                "Access your data, Correct inaccurate information, Withdraw consent, Request data portability, Request deletion (subject to legal requirements)",
        },
        {
            title: "Data Security",
            icon: "lock",
            content:
                "Encryption of sensitive data (SSL/HTTPS), Controlled access to information, Secure data centers, Regular system audits, Confidentiality of login credentials",
        },
        {
            title: "Children's Privacy",
            icon: "child_care",
            content:
                "Our services are intended for individuals aged 18 years and above. We do not knowingly collect personal data from minors.",
        },
    ];

    const ContactInfo = ({ icon, label, value, onClick, isLink = false }) => (
        <div className="contact-item">
            <div className="contact-row">
                <span className="material-icons contact-icon">{icon}</span>
                <span className="contact-label">{label}</span>
            </div>
            <span
                className={`contact-value ${isLink ? "link" : ""}`}
                onClick={onClick}
            >
                {value}
            </span>
        </div>
    );

    return (
        <div className="privacy-container">
            <div className="privacy-bg">
                <HeaderWithAuth />

                <div className="content-wrapper">
                    {policySections.map((section, index) => (
                        <div key={index} className="policy-card">
                            <div className="policy-header">
                                <div className="icon-box">
                                    <span className="material-icons">{section.icon}</span>
                                </div>
                                <h3 className="policy-title">{section.title}</h3>
                            </div>

                            {section.content && (
                                <p className="policy-content">{section.content}</p>
                            )}

                            {section.subsections?.map((sub, idx) => (
                                <div key={idx} className="sub-section">
                                    <h4 className="sub-title">{sub.title}</h4>
                                    <p className="sub-content">{sub.content}</p>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Contact Section */}
                    <div className="contact-card">
                        <h3 className="contact-title">Contact Our Grievance Officer</h3>

                        <ContactInfo
                            icon="email"
                            label="Email"
                            value="Contact@bmgjewellers.in"
                            onClick={handleEmail}
                            isLink={true}
                        />

                        <ContactInfo
                            icon="phone"
                            label="Phone"
                            value="+91-95143 33601"
                            onClick={handlePhoneCall}
                        />

                        <ContactInfo
                            icon="business"
                            label="Address"
                            value="M/s. BMG Jewellers Pvt Ltd, 160, Melamasi St, Madurai-625001"
                        />

                        <ContactInfo
                            icon="access_time"
                            label="Office Hours"
                            value="Mon-Sat 10:00 AM - 6:00 PM, Sun 11:00 AM - 4:00 PM"
                        />
                    </div>

                    <div className="legal-footer">
                        <span className="material-icons">gavel</span>
                        <p>
                            Governed by Indian Laws • Information Technology Act, 2000
                        </p>
                    </div>

                    <div className="copyright">
                        © {new Date().getFullYear()} BMG Jewellers. All rights reserved.
                    </div>
                </div>

                <Footertwo />
            </div>
        </div>
    );
}

export default SchemePrivacyPolicy;
