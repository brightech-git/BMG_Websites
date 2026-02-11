import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { toast } from 'react-toastify';
import { useContactFormQuery } from "../../../hook/contactForm/useContactFormQuery";
import { useCompanyDetails } from "../../../context/clientDetails/clientDetialContext";
import './Contact.css';
import largerImg from '../../../assets/videos/silverIcon.png';
import mobileImg from '../../../assets/videos/silverIcon.png';
import { useNavigate } from "react-router-dom";
import SmartButton from "../../ui/SmartButton";
import { PDFDownloadLink } from '@react-pdf/renderer';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobileNumber: "",
        comment: "",
    });
    const navigate = useNavigate()
    const { details: companyDetails } = useCompanyDetails();
    const mutation = useContactFormQuery();

    const [banner, setBanner] = useState(largerImg);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            // If width is less than 768px, use portrait, else landscape
            if (window.innerWidth < 768) {
                setBanner(largerImg);
            } else {
                setBanner(largerImg);
            }
            const checkWidth = () => setIsMobile(window.innerWidth <= 767);
            checkWidth(); // initial check
            window.addEventListener("resize", checkWidth);
            return () => window.removeEventListener("resize", checkWidth);
        };

        handleResize(); // Set initial image
        window.addEventListener('resize', handleResize); // Update on resize

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim() || !formData.comment.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        mutation.mutate(formData, {
            onSuccess: () => {
                toast.success("Message submitted successfully!");
                setFormData({
                    name: "",
                    email: "",
                    comment: "",
                    mobileNumber: ""
                });
                navigate('/success');
            },
            onError: () => {
                toast.error("Something went wrong. Please try again later.");
            },
        });
    };

    useEffect(() => {
        if (mutation.isSuccess || mutation.isError) {
            const timer = setTimeout(() => {
                mutation.reset();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [mutation.isSuccess, mutation.isError]);

    // Contact information items
    const logo = `https://app.bmgjewellers.com${companyDetails?.LOGO?.trim()}`;



    // Build full address
    const fullAddress = `${companyDetails?.ADDRESS1 || ""}, ${companyDetails?.ADDRESS2 || ""} - ${companyDetails?.AREACODE || ""}`;

    // Contact info for left column
    const contactInfo = [
        {
            icon: "fas fa-map-marker-alt",
            title: "Address",
            content: fullAddress,
            link: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(fullAddress)
        },

        {
            icon: "fas fa-phone",
            title: "Phone",
            content: companyDetails?.PHONE ? `Mobile: ${companyDetails.PHONE}` : "Not Available",
            link: `tel:${companyDetails?.phone || ""}`
        },
        {
            icon: "fas fa-envelope",
            title: "Email",
            content: companyDetails?.EMAIL || "Not Available",
            link: `mailto:${companyDetails?.EMAIL || ""}`
        },
        {
            icon: "fas fa-file-invoice",
            title: "GST Number",
            content: companyDetails?.GSTNO || "Not Available",
            link: "#"
        }
    ];

    // Social links (kept blank if API has none)
    const socialLinks = [
        { icon: "fab fa-facebook-f", url: companyDetails?.FACEBOOKLINK || "#" },
        { icon: "fab fa-twitter", url: companyDetails?.TWITTERLINK || "#" },
        { icon: "fab fa-instagram", url: companyDetails?.INSTALINK || "#" },
        { icon: "fab fa-youtube", url: companyDetails?.YOUTUBELINK || "#" }
    ];


    return (
        <>

         <section className="contact-main-section animate-fade-in m-2 ">
                {/* Header Section */}
                <div className="contacts-header-section">

                    <div className="header-title-sections row align-items-center">

                        <div className="contact-header-content">
                            <h1 className="contact-main-title">
                                உங்களுக்காக புதிய தங்கம் ஜொலிக்கும் வெள்ளி நகைகள் உலகம்
                            </h1>

                            <PDFDownloadLink
                                document={
                                    <PrintStatement
                                        orderId={'ORD-105060'}
                                        orderDate={'10-01-2026'}
                                        originAddress={{
                                            name: "BMG JEWELLERS PRIVATE LIMITED",
                                            lines: [
                                                "160, West Masi Street, Madurai",
                                                "contact@bmgjewellers.in",
                                                "GSTIN : 33AAICB0416C1ZG"
                                            ]
                                        }}
                                        customerName={'Aswinkumar'}
                                        customerMobile={99898989898}
                                        customerAddress={["160, West Masi Street, Madurai",
                                            "contact@bmgjewellers.in",
                                            "GSTIN : 33AAICB0416C1ZG ,Tamil Nadu, India"]}
                                        paymentMode={'ONLINE'}
                                        paymentStatus={'PAID'}
                                        transactionId={'TRAN-505050'}
                                        items={res.items.map(i => ({
                                            name: i.product_name,
                                            qty: i.quantity,
                                            amount: i.price
                                        }))}
                                        totalAmount={1500}
                                    />
                                }
                                fileName={`BMG_Receipt_${res.orderId}.pdf`}
                            >
                                {({ loading }) => (
                                    <SmartButton variant="outline" className="flex items-center" icon={Download}>
                                        {loading ? "Generating PDF..." : "Download Receipt"}
                                    </SmartButton>
                                )}

                            </PDFDownloadLink>
                        </div>
                    </div>
                </div>
                {/* Banner Image */}
                <div className="banner-containers">
                    <div
                        className="contact-banner-container animate-slide-in-left"

                    >
                        <picture>
                            <img src={banner} alt="Contact Banner" className="contact-banner-img" />
                        </picture>
                    </div>
                </div>

                {/* Main Contact Section */}

                <div className="row">
                    <div className="col-lg-7">
                        <div className="contact-form-wrapper animate-slide-in-right">
                            <div className="form-header">
                                <h2>உங்கள் தகவலை பகிருங்கள்</h2>
                                <p>புதிய கலெக்ஷன் preview-களும், லாஞ்ச் நாள் சிறப்பு ஆஃபர்களும் நேரடியாக உங்களைச் சேரும்.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="name">Full Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="form-control-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-control-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mobileNumber">Mobile Number</label>
                                    <input
                                        type="tel"
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        placeholder="Enter your mobile number"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        className="form-control-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="comment">Your Message *</label>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        placeholder="Tell us about your requirements..."
                                        value={formData.comment}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="form-control-input"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={mutation.isLoading}
                                    >
                                        {mutation.isLoading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin" />
                                                Sending Message...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>

                                {mutation.isSuccess && (
                                    <Alert variant="success" className="mt-4">
                                        <i className="fas fa-check-circle" />
                                        <strong>Success!</strong> Your message has been sent successfully. We'll get back to you soon.
                                    </Alert>
                                )}
                                {mutation.isError && (
                                    <Alert variant="danger" className="mt-4">
                                        <i className="fas fa-exclamation-triangle" />
                                        <strong>Error!</strong> Failed to send message. Please try again later.
                                    </Alert>
                                )}
                            </form>
                        </div>
                    </div>
                    {/* Left Info Column */}
                    <div className="col-lg-5">
                        <div className="contact-info-wrapper">
                            <div className="contact-info-header">
                                <h3>Contact Information</h3>
                                <p>Say something to start a live chat!</p>
                            </div>
                            <div className="contact-info-list">
                                {contactInfo.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-info-item animate-slide-in-left contact-info-clickable"
                                    >
                                        <div className="info-icon">
                                            <i className={item.icon} />
                                        </div>
                                        <div className="info-content">
                                            <h4>{item.title}</h4>
                                            <p>{item.content}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>


                            {/* Social Connect */}
                            <div className="social-connect">
                                <h4>Follow Us</h4>
                                <div className="social-icons">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-icon-link animate-bounce-in"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <i className={social.icon} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Column */}

                </div>


                {/* Store Location Section */}
                <div className="store-location-section">

                    <div className="section-header text-center">
                        <h2>Visit Our Store</h2>
                        <p>Come experience the brilliance of BMG Jewellers in person</p>
                    </div>

                    <div className="row align-items-center">
                        {/* <div className="col-lg-4">
                            <div className="location-content">
                                <div className="location-card">
                                    <div className="location-header">
                                        <h3>BMG Jewellers</h3>
                                        <span className="location-badge">Main Store</span>
                                    </div>

                                    <div className="location-details">
                                        <div className="detail-item">
                                            <i className="fas fa-map-marker-alt" />
                                            <span>{fullAddress || "M/s. BMG Jewellers Pvt Ltd, 160, Melamasi St, Madurai-625001"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-phone" />
                                            <span>{companyDetails?.phone || "+91-95143 33601"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-envelope" />
                                            <span>{companyDetails?.email || "Contact@bmgjewellers.in"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-clock" />
                                            <span>{companyDetails?.businessHours || "Mon - Sun: 10:00 AM - 9:00 PM"}</span>
                                        </div>
                                    </div>

                                    <div className="location-features">
                                        <div className="feature-item">
                                            <i className="fas fa-parking" />
                                            <span>Parking Available</span>
                                        </div>
                                        {/* <div className="feature-item">
                                            <i className="fas fa-wheelchair" />
                                            <span>Wheelchair Accessible</span>
                                        </div> */}
                        {/* <div className="feature-item">
                                            <i className="fas fa-credit-card" />
                                            <span>All Cards Accepted</span>
                                        </div>
                                    </div>

                                    <div className="location-actions">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-directions"
                                        >
                                            <i className="fas fa-directions" />
                                            Get Directions
                                        </a>
                                        <a
                                            href={`tel:${companyDetails?.phone || '+91-95143-33601'}`}
                                            className="btn-call"
                                        >
                                            <i className="fas fa-phone" />
                                            Call Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        <div className="">
                            <div className="map-container">
                                <iframe
                                    title="BMG Jewellers Location"
                                    src={companyDetails?.MAPEMBED || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.394863191887!2d78.11334837488296!3d9.916122890185033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c52cde0dc627%3A0x8f265e55e17fdc92!2sBMG%20Jewellers!5e1!3m2!1sen!2sin!4v1764324069943!5m2!1sen!2sin"}
                                    className="google-map"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </>
    );
};

export default Contact;