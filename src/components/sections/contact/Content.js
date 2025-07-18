import React from 'react';
import { Alert } from 'react-bootstrap';
import ReCAPTCHA from "react-google-recaptcha";
import Contacthelper from '../../../helper/Contacthelper';

class Content extends Contacthelper {
    render() {
        return (
            <section className="about-contact-section">
                <div className="container">
                    <div className="row">
                        {/* Left Info Column */}
                        <div className="col-lg-5">
                            <div className="contact-info-box">
                                <h3>Address</h3>
                                <p>M/s. BMG Jewellers Pvt Ltd, 160,<br /> Melamasi St, Madurai-625001</p>

                                <h3>Phone</h3>
                                <p>Mobile: +91-95143 33601<br />Landline: 95143 33609</p>

                                <h3>Email</h3>
                                <p>Contact@bmgjewellers.in<br />Contact@bmgjewellers.in</p>

                                <h3>Social</h3>
                                <div className="social-icons">
                                    <a href="#"><i className="fab fa-facebook-f" /></a>
                                    <a href="#"><i className="fab fa-twitter" /></a>
                                    <a href="#"><i className="fab fa-instagram" /></a>
                                </div>
                            </div>
                        </div>

                        {/* Right Form Column */}
                        <div className="col-lg-7">
                            <div className="message-form">
                                <h2>Tell Us Your Message</h2>
                                <form onSubmit={this.handleSubmit} method="GET">
                                    <div className="form-group">
                                        <input type="text" placeholder="Name" name="name" value={this.state.name} onChange={this.onNameChange} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" placeholder="Email" name="email" value={this.state.email} onChange={this.onEmailChange} required />
                                    </div>
                                    <div className="form-group">
                                        <textarea placeholder="Comment" name="message" value={this.state.message} onChange={this.onMessageChange} required />
                                    </div>
                                    {/* <div className="form-group form-check">
                                        <input type="checkbox" className="form-check-input" />
                                        <label>Save my name, email, and website in this browser.</label>
                                    </div> */}
                                    <ReCAPTCHA
                                        sitekey="6LdxUhMaAAAAAIrQt-_6Gz7F_58S4FlPWaxOh5ib"
                                        onChange={this.reCaptchaLoaded.bind(this)}
                                        size="invisible"
                                    />
                                    <button type="submit" className="main-btn btn-filleds">Send</button>

                                    {/* Success/Error Alert */}
                                    <Alert variant="success" className="d-none mt-3" id="server_response_success">
                                        <strong>Success!</strong> Message submitted successfully.
                                    </Alert>
                                    <Alert variant="danger" className="d-none mt-3" id="server_response_danger">
                                        <strong>Error!</strong> Please try again later.
                                    </Alert>
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
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </section>
        );
    }
}

export default Content;
