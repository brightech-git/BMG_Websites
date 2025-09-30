import React, { useState ,useEffect} from "react";
import { Alert } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';
import { useContactFormQuery } from "../../../hook/contactForm/useContactFormQuery";
import "./Contact.css";

const Content = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobileNumber: "",
        comment: "",
        // correct field name
    });


    // react-query mutation
    const mutation = useContactFormQuery();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    console.log("Submitting form with data:", formData);
    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData, {
            onSuccess: () => {
                toast.success("Message submitted successfully!");
                setFormData({ name: "", email: "", comment: "", mobileNumber:""});
            },
            onError: () => {
                toast.error("Something went wrong. Please try again later.");
            },
        });

    };
    useEffect(() => {
        if (mutation.isSuccess || mutation.isError) {
            const timer = setTimeout(() => {
                mutation.reset(); // clears isSuccess/isError
            }, 3000); // 3 seconds
            return () => clearTimeout(timer);
        }
    }, [mutation.isSuccess, mutation.isError]);

    return (
        <section className="about-contact-section">
            <div className="container">
                <div className="row">
                    {/* Left Info Column */}
                    <div className="col-lg-5">
                        <div className="contact-info-box">
                            <h3>Address</h3>
                            <p>
                                M/s. BMG Jewellers Pvt Ltd, 160,
                                <br /> Melamasi St, Madurai-625001
                            </p>

                            <h3>Phone</h3>
                            <p>
                                Mobile: +91-95143 33601
                                <br />
                                Landline: 95143 33609
                            </p>

                            <h3>Email</h3>
                            <p>
                                Contact@bmgjewellers.in
                                <br />
                                Contact@bmgjewellers.in
                            </p>

                            <h3>Social</h3>
                            <div className="social-icons">
                                <a href="#">
                                    <i className="fab fa-facebook-f" />
                                </a>
                                <a href="#">
                                    <i className="fab fa-twitter" />
                                </a>
                                <a href="#">
                                    <i className="fab fa-instagram" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="col-lg-7">
                        <div className="message-form">
                            <h2>Tell Us Your Message</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Your MobileNumber"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        placeholder="What you think"
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            
                                <button
                                    type="submit"
                                    className="main-btn btn-filleds"
                                    disabled={mutation.isLoading}
                                >
                                    {mutation.isLoading ? "Sending..." : "Send"}
                                </button>

                                {mutation.isSuccess && (
                                    <Alert variant="success" className="mt-3">
                                        <strong>Success!</strong> Message submitted successfully.
                                    </Alert>
                                )}
                                {mutation.isError && (
                                    <Alert variant="danger" className="mt-3">
                                        <strong>Error!</strong> Please try again later.
                                    </Alert>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Map Embed */}
            <div className="google-map-container mt-5">
                <iframe
                    title="BMG Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.026453413985!2d78.10065249999995!3d9.931754800000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00cfab0d83a629%3A0x1f9b7f8a8f891494!2sBMG%20JEWELLERS%20-%20The%20Best%20Jewelry%20Shop%20in%20Madurai!5e0!3m2!1sen!2sin!4v1752745983063!5m2!1sen!2sin"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </section>
    );
};

export default Content;
