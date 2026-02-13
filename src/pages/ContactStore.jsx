import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useContactFormQuery } from "../hook/contactForm/useContactFormQuery";
import { useCompanyDetails } from "../context/clientDetails/clientDetialContext";
import largerImg from '../assets/videos/store.jpg';
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    FileText,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Loader,
    Send,
    CheckCircle,
    AlertTriangle,
    Navigation,
    Clock,
    CreditCard,
    ParkingCircle
} from 'lucide-react';
import 'animate.css';

const ContactStore = () => {
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

    useEffect(() => {
        const handleResize = () => {
            setBanner(largerImg);
            setIsMobile(window.innerWidth <= 767);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        mutation.mutate(formData, {
            onSuccess: () => {
                // Push event to GTM
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: "formSubmissionSuccess",
                    formName: "Contact Form",
                });

                toast.success("Message submitted successfully!");
                setFormData({
                    name: "",
                    email: "",
                    comment: "",
                    mobileNumber: "",
                });

                navigate("/contactstore/success");
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

    const logo = `https://app.bmgjewellers.com${companyDetails?.logo?.trim()}`;
    const fullAddress = `${companyDetails?.ADDRESS1 || ""}, ${companyDetails?.ADDRESS2 || ""} - ${companyDetails?.AREACODE || ""}`;

    const contactInfo = [
        {
            icon: MapPin,
            title: "Address",
            content: fullAddress,
            link: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(fullAddress),
            bgColor: "bg-[var(--orange-100)]",
            iconColor: "text-[var(--orange-600)]"
        },
        {
            icon: Phone,
            title: "Phone",
            content: companyDetails?.PHONE ? `Mobile: ${companyDetails.PHONE}` : "Not Available",
            link: `tel:${companyDetails?.PHONE || ""}`,
            bgColor: "bg-[var(--orange-50)]",
            iconColor: "text-[var(--orange-500)]"
        },
        {
            icon: Mail,
            title: "Email",
            content: companyDetails?.EMAIL || "Not Available",
            link: `mailto:${companyDetails?.EMAIL || ""}`,
            bgColor: "bg-[var(--orange-100)]",
            iconColor: "text-[var(--orange-600)]"
        },
        {
            icon: FileText,
            title: "GST Number",
            content: companyDetails?.GSTNO || "Not Available",
            link: "#",
            bgColor: "bg-[var(--orange-50)]",
            iconColor: "text-[var(--orange-500)]"
        }
    ];

    const socialLinks = [
        { icon: Facebook, url: companyDetails?.FACEBOOKLINK || "#", bgColor: "bg-[var(--orange-500)]" },
        { icon: Twitter, url: companyDetails?.TWITTERLINK || "#", bgColor: "bg-[var(--orange-600)]" },
        { icon: Instagram, url: companyDetails?.INSTALINK || "#", bgColor: "bg-[var(--orange-500)]" },
        { icon: Youtube, url: companyDetails?.YOUTUBELINK || "#", bgColor: "bg-[var(--orange-600)]" }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-8 animate__animated animate__fadeIn font-primary">
            {/* Header Section */}
            <div className="text-center mb-8 animate__animated animate__fadeInDown">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-[var(--primary-text-color)] mb-4 font-secondary">
                    உங்களுக்காக புதிய தங்கம் ஜொலிக்கும் வெள்ளி நகைகள் உலகம்
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-[var(--orange-500)] to-[var(--orange-600)] mx-auto"></div>
            </div>

            {/* Banner Image */}
            <div className="mb-12 animate__animated animate__slideInLeft">
                <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-lg)]">
                    <img
                        src={banner}
                        alt="Contact Banner"
                        className="w-full h-[300px] md:h-[400px] object-cover transform hover:scale-105 transition-[var(--transition)] duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
            </div>

            {/* Main Contact Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Info Column */}
                <div className="lg:col-span-5 animate__animated animate__slideInLeft">
                    <div className="bg-[var(--primary-color)] rounded-2xl shadow-[var(--shadow-lg)] p-8 sticky top-8">
                        <div className="mb-8">
                            <h3 className="text-lg md:text-xl font-bold text-[var(--primary-text-color)] mb-2">Contact Information</h3>
                            <p className="text-xs md:text-sm text-[var(--secondary-text-color)]">Say something to start a live chat!</p>
                        </div>

                        <div className="space-y-4">
                            {contactInfo.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <a
                                        key={index}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-start gap-4 p-4 rounded-xl transition-[var(--transition)] hover:shadow-[var(--shadow-md)] group animate__animated animate__fadeInLeft ${item.bgColor}`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className={`p-3 rounded-lg bg-[var(--white-color)] group-hover:scale-110 transition-[var(--transition)] ${item.iconColor}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-[var(--primary-text-color)]">{item.title}</h4>
                                            <p className="text-xs text-[var(--secondary-text-color)] mt-1">{item.content}</p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Social Connect */}
                        <div className="mt-8 pt-8 border-t border-[var(--orange-200)]">
                            <h4 className="text-base md:text-lg font-semibold text-[var(--primary-text-color)] mb-4">Follow Us</h4>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`p-3 rounded-full ${social.bgColor} text-[var(--white-color)] hover:opacity-80 transition-[var(--transition)] transform hover:scale-110 animate__animated animate__bounceIn`}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Form Column */}
                <div className="lg:col-span-7 animate__animated animate__slideInRight">
                    <div className="bg-[var(--primary-color)] rounded-2xl shadow-[var(--shadow-lg)] p-8">
                        <div className="mb-8">
                            <h2 className="text-lg md:text-xl font-bold text-[var(--primary-text-color)] mb-2 font-secondary">உங்கள் தகவலை பகிருங்கள்</h2>
                            <p className="text-xs md:text-sm text-[var(--secondary-text-color)]">
                                புதிய கலெக்ஷன் preview-களும், லாஞ்ச் நாள் சிறப்பு ஆஃபர்களும் நேரடியாக உங்களைச் சேரும்.
                            </p>
                        </div>

                        <form id="contactForm" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-xs md:text-sm font-medium text-[var(--primary-text-color)]">
                                        Full Name <span className="text-[var(--orange-600)]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 text-sm rounded-lg border border-[var(--orange-200)] focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-200)] transition-[var(--transition)] outline-none bg-[var(--white-color)] text-[var(--primary-text-color)] placeholder:text-[var(--secondary-text-color)]/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs md:text-sm font-medium text-[var(--primary-text-color)]">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 text-sm rounded-lg border border-[var(--orange-200)] focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-200)] transition-[var(--transition)] outline-none bg-[var(--white-color)] text-[var(--primary-text-color)] placeholder:text-[var(--secondary-text-color)]/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="mobileNumber" className="text-xs md:text-sm font-medium text-[var(--primary-text-color)]">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    placeholder="Enter your mobile number"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 text-sm rounded-lg border border-[var(--orange-200)] focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-200)] transition-[var(--transition)] outline-none bg-[var(--white-color)] text-[var(--primary-text-color)] placeholder:text-[var(--secondary-text-color)]/50"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={mutation.isLoading}
                                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[var(--orange-500)] to-[var(--orange-600)] text-[var(--white-color)] text-sm font-semibold rounded-lg hover:from-[var(--orange-600)] hover:to-[var(--orange-700)] transform hover:scale-105 transition-[var(--transition)] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-lg)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate__animated animate__pulse animate__infinite animate__slow"
                                >
                                    {mutation.isLoading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            <span className="text-xs md:text-sm">Sending Message...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span className="text-xs md:text-sm">Send Message</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {mutation.isSuccess && (
                                <div className="mt-6 p-4 bg-[var(--green-color)]/10 border border-[var(--green-color)] rounded-lg animate__animated animate__fadeInUp">
                                    <div className="flex items-center gap-3 text-[var(--green-color)]">
                                        <CheckCircle className="w-5 h-5" />
                                        <div>
                                            <strong className="text-sm font-semibold">Success!</strong>
                                            <p className="text-xs">Your message has been sent successfully. We'll get back to you soon.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {mutation.isError && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate__animated animate__shakeX">
                                    <div className="flex items-center gap-3 text-red-700">
                                        <AlertTriangle className="w-5 h-5" />
                                        <div>
                                            <strong className="text-sm font-semibold">Error!</strong>
                                            <p className="text-xs">Failed to send message. Please try again later.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Store Location Section */}
            <div className="mt-16 animate__animated animate__fadeInUp">
                <div className="text-center mb-8">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[var(--primary-text-color)] mb-2">Visit Our Store</h2>
                    <p className="text-xs md:text-sm text-[var(--secondary-text-color)]">Come experience the brilliance of BMG Jewellers in person</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-[var(--orange-500)] to-[var(--orange-600)] mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Store Info Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-[var(--primary-color)] rounded-2xl shadow-[var(--shadow-lg)] p-6 h-full animate__animated animate__fadeInLeft">
                            <div className="mb-6">
                                <h3 className="text-base md:text-lg font-bold text-[var(--primary-text-color)]">BMG Jewellers</h3>
                                <span className="inline-block px-3 py-1 bg-[var(--orange-100)] text-[var(--orange-700)] text-xs font-semibold rounded-full mt-2">
                                    Main Store
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-[var(--orange-500)] flex-shrink-0 mt-1" />
                                    <span className="text-xs text-[var(--secondary-text-color)]">{fullAddress || "M/s. BMG Jewellers Pvt Ltd, 160, Melamasi St, Madurai-625001"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-[var(--orange-500)]" />
                                    <span className="text-xs text-[var(--secondary-text-color)]">{companyDetails?.phone || "+91-95143 33601"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-[var(--orange-500)]" />
                                    <span className="text-xs text-[var(--secondary-text-color)]">{companyDetails?.email || "Contact@bmgjewellers.in"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-[var(--orange-500)]" />
                                    <span className="text-xs text-[var(--secondary-text-color)]">{companyDetails?.businessHours || "Mon - Sun: 10:00 AM - 9:00 PM"}</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-2">
                                <div className="text-center p-2 bg-[var(--orange-50)] rounded-lg">
                                    <ParkingCircle className="w-4 h-4 text-[var(--orange-500)] mx-auto mb-1" />
                                    <span className="text-[10px] md:text-xs text-[var(--secondary-text-color)]">Parking</span>
                                </div>
                                <div className="text-center p-2 bg-[var(--orange-50)] rounded-lg">
                                    <CreditCard className="w-4 h-4 text-[var(--orange-500)] mx-auto mb-1" />
                                    <span className="text-[10px] md:text-xs text-[var(--secondary-text-color)]">Cards</span>
                                </div>
                                <div className="text-center p-2 bg-[var(--orange-50)] rounded-lg">
                                    <Navigation className="w-4 h-4 text-[var(--orange-500)] mx-auto mb-1" />
                                    <span className="text-[10px] md:text-xs text-[var(--secondary-text-color)]">GPS</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-4 py-2 bg-[var(--orange-500)] text-[var(--white-color)] text-xs font-semibold rounded-lg hover:bg-[var(--orange-600)] transition-[var(--transition)] flex items-center justify-center gap-2"
                                >
                                    <Navigation className="w-3 h-3" />
                                    Directions
                                </a>
                                <a
                                    href={`tel:${companyDetails?.phone || '+91-95143-33601'}`}
                                    className="flex-1 px-4 py-2 bg-[var(--orange-600)] text-[var(--white-color)] text-xs font-semibold rounded-lg hover:bg-[var(--orange-700)] transition-[var(--transition)] flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-3 h-3" />
                                    Call Now
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className="lg:col-span-8 animate__animated animate__fadeInRight">
                        <div className="bg-[var(--primary-color)] rounded-2xl shadow-[var(--shadow-lg)] overflow-hidden h-[450px]">
                            <iframe
                                title="BMG Jewellers Location"
                                src={companyDetails?.MAPEMBED || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.394863191887!2d78.11334837488296!3d9.916122890185033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c52cde0dc627%3A0x8f265e55e17fdc92!2sBMG%20Jewellers!5e1!3m2!1sen!2sin!4v1764324069943!5m2!1sen!2sin"}
                                className="w-full h-full"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactStore;