import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { useContactFormQuery } from "../../../hook/contactForm/useContactFormQuery";
import { useCompanyDetails } from "../../../context/clientDetails/clientDetialContext";
import "./Contact.css";
import largerImg from "../../../assets/images/store.jpg";
import { useNavigate } from "react-router-dom";

const Contact = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobileNumber: "",
        comment: "",
    });

    const navigate = useNavigate();

    const { details: companyDetails } = useCompanyDetails();
    const mutation = useContactFormQuery();

    const [banner, setBanner] = useState(largerImg);
    const [isMobile, setIsMobile] = useState(false);

    // Redirect countdown
    const [redirectSeconds, setRedirectSeconds] = useState(null);


    // =========================================================
    // RESPONSIVE BANNER
    // =========================================================

    useEffect(() => {

        const handleResize = () => {

            if (window.innerWidth < 768) {
                setBanner(largerImg);
            } else {
                setBanner(largerImg);
            }

            setIsMobile(window.innerWidth <= 767);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, []);


    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // =========================================================
    // FORM SUBMIT
    // =========================================================

    const handleSubmit = (e) => {

        e.preventDefault();

        // Basic Validation
        if (!formData.name.trim() || !formData.comment.trim()) {

            toast.error("Please fill in all required fields.");

            return;
        }


        // Email Validation
        if (
            formData.email &&
            !/\S+@\S+\.\S+/.test(formData.email)
        ) {

            toast.error("Please enter a valid email address.");

            return;
        }


        // Submit API
        mutation.mutate(formData, {

            onSuccess: () => {

                toast.success("Message submitted successfully!");

                // Clear Form
                setFormData({
                    name: "",
                    email: "",
                    comment: "",
                    mobileNumber: "",
                });

                // Start 5 second redirect countdown
                setRedirectSeconds(5);
            },


            onError: () => {

                toast.error(
                    "Something went wrong. Please try again later."
                );

            },

        });

    };


    // =========================================================
    // REDIRECT COUNTDOWN
    // =========================================================

    useEffect(() => {

        if (redirectSeconds === null) {
            return;
        }


        // When countdown reaches zero
        if (redirectSeconds === 0) {

            navigate("/");

            return;
        }


        // Reduce countdown every second
        const timer = setTimeout(() => {

            setRedirectSeconds((previous) => previous - 1);

        }, 1000);


        // Cleanup timer
        return () => clearTimeout(timer);

    }, [redirectSeconds, navigate]);


    // =========================================================
    // RESET ERROR STATE
    // =========================================================

    useEffect(() => {

        // Only automatically reset error.
        // Do NOT reset success because we want to display
        // the success + redirect message for 5 seconds.

        if (mutation.isError) {

            const timer = setTimeout(() => {

                mutation.reset();

            }, 3000);


            return () => clearTimeout(timer);
        }

    }, [mutation.isError]);


    // =========================================================
    // COMPANY DETAILS
    // =========================================================

    const logo =
        `https://app.bmgjewellers.com${companyDetails?.LOGO?.trim()}`;


    const fullAddress =
        `${companyDetails?.ADDRESS1 || ""}, ` +
        `${companyDetails?.ADDRESS2 || ""} - ` +
        `${companyDetails?.AREACODE || ""}`;


    // =========================================================
    // CONTACT INFO
    // =========================================================

    const contactInfo = [

        {
            icon: "fas fa-map-marker-alt",

            title: "Address",

            content: fullAddress,

            link:
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(fullAddress),
        },

        {
            icon: "fas fa-phone",

            title: "Phone",

            content: companyDetails?.PHONE
                ? `Mobile: ${companyDetails.PHONE}`
                : "Not Available",

            link: `tel:${companyDetails?.PHONE || ""}`,
        },

        {
            icon: "fas fa-envelope",

            title: "Email",

            content:
                companyDetails?.EMAIL ||
                "Not Available",

            link:
                `mailto:${companyDetails?.EMAIL || ""}`,
        },

        {
            icon: "fas fa-file-invoice",

            title: "GST Number",

            content:
                companyDetails?.GSTNO ||
                "Not Available",

            link: "#",
        },

    ];


    // =========================================================
    // SOCIAL LINKS
    // =========================================================

    const socialLinks = [

        {
            icon: "fab fa-facebook-f",
            url: companyDetails?.FACEBOOKLINK || "#",
        },

        {
            icon: "fab fa-twitter",
            url: companyDetails?.TWITTERLINK || "#",
        },

        {
            icon: "fab fa-instagram",
            url: companyDetails?.INSTALINK || "#",
        },

        {
            icon: "fab fa-youtube",
            url: companyDetails?.YOUTUBELINK || "#",
        },

    ];


    // =========================================================
    // UI
    // =========================================================

    return (

        <>

            <section className="contact-main-section animate-fade-in m-2">


                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="contacts-header-section">

                    <div className="header-title-sections row align-items-center">

                        <div className="contact-header-content">

                            <h1 className="contact-main-title">

                                உங்களுக்காக புதிய தங்கம் ஜொலிக்கும் வெள்ளி நகைகள் உலகம்

                            </h1>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    BANNER
                ===================================================== */}

                <div className="banner-containers">

                    <div className="contact-banner-container animate-slide-in-left">

                        <picture>

                            <img
                                src={banner}
                                alt="Contact Banner"
                                className="contact-banner-img"
                            />

                        </picture>

                    </div>

                </div>


                {/* =====================================================
                    CONTACT SECTION
                ===================================================== */}

                <div className="row">


                    {/* =================================================
                        CONTACT FORM
                    ================================================= */}

                    <div className="col-lg-7">

                        <div className="contact-form-wrapper animate-slide-in-right">


                            <div className="form-header">

                                <h2>
                                    உங்கள் தகவலை பகிருங்கள்
                                </h2>

                                <p>
                                    புதிய கலெக்ஷன் preview-களும்,
                                    லாஞ்ச் நாள் சிறப்பு ஆஃபர்களும்
                                    நேரடியாக உங்களைச் சேரும்.
                                </p>

                            </div>


                            <form
                                onSubmit={handleSubmit}
                                className="contact-form"
                            >


                                {/* NAME + EMAIL */}

                                <div className="row">


                                    {/* NAME */}

                                    <div className="col-md-6">

                                        <div className="form-group">

                                            <label htmlFor="name">

                                                Full Name *

                                            </label>

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


                                    {/* EMAIL */}

                                    <div className="col-md-6">

                                        <div className="form-group">

                                            <label htmlFor="email">

                                                Email Address

                                            </label>

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


                                {/* MOBILE NUMBER */}

                                <div className="form-group">

                                    <label htmlFor="mobileNumber">

                                        Mobile Number

                                    </label>

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


                                {/* MESSAGE */}

                                <div className="form-group">

                                    <label htmlFor="comment">

                                        Your Message *

                                    </label>

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


                                {/* SUBMIT BUTTON */}

                                <div className="form-actions">

                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={
                                            mutation.isLoading ||
                                            redirectSeconds !== null
                                        }
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


                                {/* =================================================
                                    SUCCESS MESSAGE
                                ================================================= */}

                                {mutation.isSuccess && (

                                    <Alert
                                        variant="success"
                                        className="mt-4"
                                    >

                                        <i className="fas fa-check-circle me-2" />

                                        <strong>
                                            Success!
                                        </strong>

                                        {" "}

                                        Your message has been sent successfully.
                                        We'll get back to you soon.


                                        {/* REDIRECT MESSAGE */}

                                        {redirectSeconds !== null && (

                                            <div
                                                className="mt-3"
                                                style={{
                                                    textAlign: "center",
                                                    fontWeight: "600",
                                                    fontSize: "15px",
                                                }}
                                            >

                                                Redirecting to Home Page in{" "}

                                                <strong>
                                                    {redirectSeconds}
                                                </strong>

                                                {" "}

                                                second
                                                {redirectSeconds !== 1 ? "s" : ""}
                                                ...

                                            </div>

                                        )}

                                    </Alert>

                                )}


                                {/* ERROR MESSAGE */}

                                {mutation.isError && (

                                    <Alert
                                        variant="danger"
                                        className="mt-4"
                                    >

                                        <i className="fas fa-exclamation-triangle me-2" />

                                        <strong>
                                            Error!
                                        </strong>

                                        {" "}

                                        Failed to send message.
                                        Please try again later.

                                    </Alert>

                                )}


                            </form>

                        </div>

                    </div>


                    {/* =================================================
                        CONTACT INFORMATION
                    ================================================= */}

                    <div className="col-lg-5">

                        <div className="contact-info-wrapper">


                            <div className="contact-info-header">

                                <h3>
                                    Contact Information
                                </h3>

                                <p>
                                    Say something to start a live chat!
                                </p>

                            </div>


                            <div className="contact-info-list">

                                {contactInfo.map((item, index) => (

                                    <a
                                        key={index}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            contact-info-item
                                            animate-slide-in-left
                                            contact-info-clickable
                                        "
                                    >

                                        <div className="info-icon">

                                            <i className={item.icon} />

                                        </div>


                                        <div className="info-content">

                                            <h4>
                                                {item.title}
                                            </h4>

                                            <p>
                                                {item.content}
                                            </p>

                                        </div>

                                    </a>

                                ))}

                            </div>


                            {/* SOCIAL CONNECT */}

                            <div className="social-connect">

                                <h4>
                                    Follow Us
                                </h4>

                                <div className="social-icons">

                                    {socialLinks.map((social, index) => (

                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                social-icon-link
                                                animate-bounce-in
                                            "
                                            style={{
                                                animationDelay:
                                                    `${index * 0.1}s`,
                                            }}
                                        >

                                            <i className={social.icon} />

                                        </a>

                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    STORE LOCATION
                ===================================================== */}

                <div className="store-location-section">


                    <div className="section-header text-center">

                        <h2>
                            Visit Our Store
                        </h2>

                        <p>
                            Come experience the brilliance of
                            BMG Jewellers in person
                        </p>

                    </div>


                    <div className="row align-items-center">

                        <div className="">

                            <div className="map-container">

                                <iframe
                                    title="BMG Jewellers Location"
                                    src={
                                        companyDetails?.MAPEMBED ||
                                        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.394863191887!2d78.11334837488296!3d9.916122890185033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c52cde0dc627%3A0x8f265e55e17fdc92!2sBMG%20Jewellers!5e1!3m2!1sen!2sin!4v1764324069943!5m2!1sen!2sin"
                                    }
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