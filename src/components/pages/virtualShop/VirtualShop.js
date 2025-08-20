import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaShoppingCart, FaHome, FaHeadset, FaArrowRight, FaCalendarAlt, FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useCreateAppointment } from '../../../hook/virtualVideo/useVideoAppointment';
import './AppointmentPage.css';

const AppointmentPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        cityOrCountry: '',
        category: '',
        subCategory: '',
        preferredLanguage: '',
        message: '',
        appointmentDate: '',
        appointmentTime: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { mutate: createAppointment, isLoading, isError, error } = useCreateAppointment();

    const categories = ['Gold', 'Gold Polished', 'Silver'];

    const subCategories = {
        Gold: [
            'Rings',
            'Earrings',
            'Necklaces and Sets',
            'Bangles and Bracelets',
            'Ankles and Toe Rings',
            'Pendents and Chains',
            'Maang Tikka and Hair Access',
        ],
        'Gold Polished': [
            'Rings',
            'Earrings',
            'Necklaces and Sets',
            'Bangles and Bracelets',
            'Ankles and Toe Rings',
            'Pendents and Chains',
            'Maang Tikka and Hair Access',
        ],
        Silver: [
            'Rings',
            'Earrings',
            'Necklaces and Sets',
            'Bangles and Bracelets',
            'Ankles and Toe Rings',
            'Pendents and Chains',
            'Maang Tikka and Hair Access',
        ],
    };

    const languages = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }
        if (!formData.mobileNumber.trim()) errors.mobileNumber = 'Mobile number is required';
        if (!formData.cityOrCountry.trim()) errors.cityOrCountry = 'City/Country is required';
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.subCategory) errors.subCategory = 'Subcategory is required';
        if (!formData.preferredLanguage) errors.preferredLanguage = 'Language is required';
        if (!formData.appointmentDate) errors.appointmentDate = 'Date is required';
        if (!formData.appointmentTime) errors.appointmentTime = 'Time is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const appointmentData = {
            ...formData,
            appointmentDateTime: `${formData.appointmentDate}T${formData.appointmentTime}`,
        };

        createAppointment(appointmentData, {
            onSuccess: () => {
                setShowSuccessModal(true);
                setFormData({
                    name: '',
                    email: '',
                    mobileNumber: '',
                    cityOrCountry: '',
                    category: '',
                    subCategory: '',
                    preferredLanguage: '',
                    message: '',
                    appointmentDate: '',
                    appointmentTime: '',
                });
            },
        });
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
    };

    return (
        <Container className="my-4 appointment-page">
            {showSuccess && (
                <Alert
                    variant="success"
                    className="mb-3 success-alert"
                    onClose={() => setShowSuccess(false)}
                    dismissible
                >
                    Your appointment has been booked successfully! We'll contact you shortly.
                </Alert>
            )}

            {isError && (
                <Alert variant="danger" className="mb-3 error-alert" dismissible>
                    {error?.message || 'Failed to book appointment. Please try again.'}
                </Alert>
            )}

            <Row className="mb-4 main-content-row">
                <Col lg={6} className="mb-3 mb-lg-0">
                    <div className="video-container ratio ratio-16x9">
                        <iframe
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="Virtual Shopping Demo"
                            allowFullScreen
                            aria-label="Virtual shopping demo video"
                            className="video-iframe"
                        ></iframe>
                    </div>
                </Col>

                <Col lg={6}>
                    <Form onSubmit={handleSubmit} className="professional-form compact-form">
                        <h3 className="form-title mb-3">Book Your Virtual Appointment</h3>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2 form-group">
                                    <Form.Label className="professional-label">Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.name}
                                        className="professional-input compact-input"
                                        placeholder="Your full name"
                                        aria-required="true"
                                    />
                                    <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2 form-group">
                                    <Form.Label className="professional-label">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.email}
                                        className="professional-input compact-input"
                                        placeholder="your@email.com"
                                        aria-required="true"
                                    />
                                    <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2 form-group">
                                    <Form.Label className="professional-label">Mobile Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.mobileNumber}
                                        className="professional-input compact-input"
                                        placeholder="+91 12345 67890"
                                        aria-required="true"
                                    />
                                    <Form.Control.Feedback type="invalid">{formErrors.mobileNumber}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2 form-group">
                                    <Form.Label className="professional-label">City/Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cityOrCountry"
                                        value={formData.cityOrCountry}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.cityOrCountry}
                                        className="professional-input compact-input"
                                        placeholder="e.g., Chennai"
                                        aria-required="true"
                                    />
                                    <Form.Control.Feedback type="invalid">{formErrors.cityOrCountry}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2 form-group">
                                    <Form.Label className="professional-label">Category</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.category}
                                        className="professional-input compact-input professional-select"
                                        aria-required="true"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{formErrors.category}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2 form-group">
                                    <Form.Label className="professional-label">Subcategory</Form.Label>
                                    <Form.Select
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        disabled={!formData.category}
                                        isInvalid={!!formErrors.subCategory}
                                        className="professional-input compact-input professional-select"
                                        aria-required="true"
                                    >
                                        <option value="">Select subcategory</option>
                                        {formData.category &&
                                            subCategories[formData.category].map((sub) => (
                                                <option key={sub} value={sub}>
                                                    {sub.replace(/_/g, ' ')}
                                                </option>
                                            ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{formErrors.subCategory}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2 form-group">
                                    <Form.Label className="professional-label">Preferred Language</Form.Label>
                                    <Form.Select
                                        name="preferredLanguage"
                                        value={formData.preferredLanguage}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.preferredLanguage}
                                        className="professional-input compact-input professional-select"
                                        aria-required="true"
                                    >
                                        <option value="">Select language</option>
                                        {languages.map((lang) => (
                                            <option key={lang} value={lang}>
                                                {lang}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{formErrors.preferredLanguage}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2 form-group">
                                    <Form.Label className="professional-label">Message (Optional)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="professional-input compact-input professional-textarea"
                                        placeholder="Your preferences..."
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label className="professional-label">Appointment Date</Form.Label>
                                    <div className="input-with-icon">
                                        <Form.Control
                                            type="date"
                                            name="appointmentDate"
                                            value={formData.appointmentDate}
                                            onChange={handleChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            isInvalid={!!formErrors.appointmentDate}
                                            className="professional-input compact-input with-icon"
                                            aria-required="true"
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid">{formErrors.appointmentDate}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label className="professional-label">Appointment Time</Form.Label>
                                    <div className="input-with-icon">
                                        <Form.Control
                                            type="time"
                                            name="appointmentTime"
                                            value={formData.appointmentTime}
                                            onChange={handleChange}
                                            isInvalid={!!formErrors.appointmentTime}
                                            className="professional-input compact-input with-icon"
                                            aria-required="true"
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid">{formErrors.appointmentTime}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button
                            variant="primary"
                            type="submit"
                            className="professional-submit-btn compact-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Booking...
                                </>
                            ) : (
                                'Book Appointment'
                            )}
                        </Button>
                    </Form>
                </Col>
            </Row>

            <section className="how-it-works-section">
                <h2 className="section-title">How It Works</h2>
                <Row className="steps-row">
                    <Col lg={4} md={12} className="step-col">
                        <div className="step-card">
                            <div className="step-number">
                                <span>1</span>
                            </div>
                            <h4 className="step-title">Sign Up Online</h4>
                            <p className="step-text">
                                Fill out our simple form to book your virtual shopping appointment.
                            </p>
                        </div>
                    </Col>
                    <Col lg={4} md={12} className="step-col">
                        <div className="step-card">
                            <div className="step-number">
                                <span>2</span>
                            </div>
                            <h4 className="step-title">Confirm Appointment</h4>
                            <p className="step-text">
                                Receive confirmation details and a link to join your session.
                            </p>
                        </div>
                    </Col>
                    <Col lg={4} md={12} className="step-col">
                        <div className="step-card">
                            <div className="step-number">
                                <span>3</span>
                            </div>
                            <h4 className="step-title">Shop via Live Video</h4>
                            <p className="step-text">
                                Connect with our team in real-time to explore products.
                            </p>
                        </div>
                    </Col>
                </Row>
            </section>

            <section className="benefits-section">
                <Row className="benefits-row">
                    <Col lg={4} md={6} sm={12} className="benefit-col">
                        <div className="benefit-cards">
                            <FaShoppingCart size={40} className="benefit-icon" />
                            <h4 className="benefit-title">Shop from Anywhere</h4>
                        </div>
                    </Col>
                    <Col lg={4} md={6} sm={12} className="benefit-col">
                        <div className="benefit-cards">
                            <FaHome size={40} className="benefit-icon" />
                            <h4 className="benefit-title">Comfort of Your Home</h4>
                        </div>
                    </Col>
                    <Col lg={4} md={12} sm={12} className="benefit-col">
                        <div className="benefit-cards">
                            <FaHeadset size={40} className="benefit-icon" />
                            <h4 className="benefit-title">Interactive Sales Team</h4>
                        </div>
                    </Col>
                </Row>
            </section>

            {/* Success Modal - Compact Version */}
            <Modal
                show={showSuccessModal}
                onHide={handleCloseModal}
                centered
                size="sm"
                className="success-modal"
                backdrop="static"
            >
                <div className="success-modal-header">
                    <button
                        type="button"
                        className="modal-close-x"
                        onClick={handleCloseModal}
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>
                    <div className="success-icon">
                        <FaCheckCircle />
                    </div>
                    <h2 className="success-title">Successfully Registered!</h2>
                </div>
                <div className="success-modal-body">
                    <p className="success-message">
                        Your virtual appointment has been successfully booked. Our expert team will contact you soon to confirm the details.
                    </p>
                    <div className="success-details">
                        <h5>What happens next?</h5>
                        <ul>
                            <li>Our team will call you within 10 minutes</li>
                            <li>We'll confirm your appointment date and time</li>
                            <li>Get ready for a personalized jewelry shopping experience</li>
                            <li>You'll receive a video call link before your appointment</li>
                        </ul>
                    </div>
                    <Button
                        className="close-btn"
                        onClick={handleCloseModal}
                    >
                        Got it, Thanks!
                    </Button>
                </div>
            </Modal>
        </Container>
    );
};

export default AppointmentPage;