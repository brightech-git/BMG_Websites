import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaShoppingCart, FaHome, FaHeadset } from 'react-icons/fa';
import { useCreateAppointment } from '../../../hook/virtualVideo/useVideoAppointment';
import './AppointmentPage.css'; // Assuming CSS is in a separate file

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

    const { mutate: createAppointment, isLoading, isError, error } = useCreateAppointment();

    const categories = ['Gold', 'Gold Polished', 'Silver'];
    const subCategories = {
        Gold: [
            'RINGS',
            'EARRINGS',
            'NECKLACES_AND_SETS',
            'BANGLES_AND_BRACELETS',
            'ANKLES_AND_TOE_RINGS',
            'PENDENTS_AND_CHAINS',
            'MAANG_TIKKA_AND_HAIR_ACCESS',
        ],
        'Gold Polished': [
            'RINGS',
            'EARRINGS',
            'NECKLACES_AND_SETS',
            'BANGLES_AND_BRACELETS',
            'ANKLES_AND_TOE_RINGS',
            'PENDENTS_AND_CHAINS',
            'MAANG_TIKKA_AND_HAIR_ACCESS',
        ],
        Silver: [
            'RINGS',
            'EARRINGS',
            'NECKLACES_AND_SETS',
            'BANGLES_AND_BRACELETS',
            'ANKLES_AND_TOE_RINGS',
            'PENDENTS_AND_CHAINS',
            'MAANG_TIKKA_AND_HAIR_ACCESS',
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
                setShowSuccess(true);
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
                setTimeout(() => setShowSuccess(false), 5000);
            },
        });
    };

    return (
        <Container className="my-5 appointment-page">
            {showSuccess && (
                <Alert
                    variant="success"
                    className="mb-4 rounded-3 shadow-sm"
                    onClose={() => setShowSuccess(false)}
                    dismissible
                >
                    Your appointment has been booked successfully! We'll contact you shortly.
                </Alert>
            )}

            {isError && (
                <Alert variant="danger" className="mb-4 rounded-3 shadow-sm" dismissible>
                    {error?.message || 'Failed to book appointment. Please try again.'}
                </Alert>
            )}

            <Row className="mb-5">
                <Col lg={6} className="mb-4 mb-lg-0">
                    <div className="video-container ratio ratio-16x9 shadow">
                        <iframe
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="Virtual Shopping Demo"
                            allowFullScreen
                            aria-label="Virtual shopping demo video"
                        ></iframe>
                    </div>
                </Col>

                <Col lg={6}>
                    <Form
                        onSubmit={handleSubmit}
                        className="p-4 rounded-3 shadow form-container"
                        style={{ background: 'var(--primary-card-color)' }}
                    >
                        <h3 className="mb-4 text-center title">Book Your Virtual Appointment</h3>

                        <Form.Group className="mb-3">
                            <Form.Label className="form-label">Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                isInvalid={!!formErrors.name}
                                className="form-input"
                                aria-required="true"
                            />
                            <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="form-label">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.email}
                                        className="form-input"
                                        aria-required="true"
                                    />
                                    <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="form-label">Mobile Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.mobileNumber}
                                        className="form-input"
                                        aria-required="true"
                                    />
                                    <Form.Control.Feedback type="invalid">{formErrors.mobileNumber}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="form-label">City/Country</Form.Label>
                            <Form.Control
                                type="text"
                                name="cityOrCountry"
                                value={formData.cityOrCountry}
                                onChange={handleChange}
                                isInvalid={!!formErrors.cityOrCountry}
                                className="form-input"
                                aria-required="true"
                            />
                            <Form.Control.Feedback type="invalid">{formErrors.cityOrCountry}</Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="form-label">Category</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.category}
                                        className="form-input"
                                        aria-required="true"
                                    >
                                        <option value="">Select a category</option>
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
                                <Form.Group className="mb-3">
                                    <Form.Label className="form-label">Subcategory</Form.Label>
                                    <Form.Select
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        disabled={!formData.category}
                                        isInvalid={!!formErrors.subCategory}
                                        className="form-input"
                                        aria-required="true"
                                    >
                                        <option value="">Select a subcategory</option>
                                        {formData.category &&
                                            subCategories[formData.category].map((sub) => (
                                                <option key={sub} value={sub}>
                                                    {sub.replace('_', ' ')}
                                                </option>
                                            ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{formErrors.subCategory}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="form-label">Preferred Language</Form.Label>
                            <Form.Select
                                name="preferredLanguage"
                                value={formData.preferredLanguage}
                                onChange={handleChange}
                                isInvalid={!!formErrors.preferredLanguage}
                                className="form-input"
                                aria-required="true"
                            >
                                <option value="">Select a language</option>
                                {languages.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{formErrors.preferredLanguage}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="form-label">Message (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="form-label">Appointment Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        isInvalid={!!formErrors.appointmentDate}
                                        className="form-input"
                                        aria-required="true"
                                    />
                                    <Form.Control.Feedback type="invalid">{formErrors.appointmentDate}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="form-label">Appointment Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="appointmentTime"
                                        value={formData.appointmentTime}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.appointmentTime}
                                        className="form-input"
                                        aria-required="true"
                                    />
                                    <Form.Control.Feedback type="invalid">{formErrors.appointmentTime}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-2 submit-btn"
                            disabled={isLoading}
                            style={{ background: 'var(--button-bg)', border: 'none' }}
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

            <section className="py-5 how-it-works rounded-3" style={{ background: 'var(--feature-bg-color)' }}>
                <h2 className="text-center mb-5 title">How It Works</h2>
                <Row>
                    <Col md={4} className="text-center mb-4 mb-md-0">
                        <div
                            className="p-4 rounded-3 shadow-sm step-card"
                            style={{ background: 'var(--secondary-card-color)' }}
                        >
                            <div
                                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 step-number"
                                style={{ background: 'var(--primary-hover-color)' }}
                            >
                                <span className="h4 mb-0">1</span>
                            </div>
                            <h4 className="step-title">Sign Up Online</h4>
                            <p className="step-text">
                                Fill out our simple form to book your virtual shopping appointment.
                            </p>
                        </div>
                    </Col>
                    <Col md={4} className="text-center mb-4 mb-md-0">
                        <div
                            className="p-4 rounded-3 shadow-sm step-card"
                            style={{ background: 'var(--secondary-card-color)' }}
                        >
                            <div
                                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 step-number"
                                style={{ background: 'var(--primary-hover-color)' }}
                            >
                                <span className="h4 mb-0">2</span>
                            </div>
                            <h4 className="step-title">Confirm Appointment</h4>
                            <p className="step-text">
                                Receive confirmation details and a link to join your session.
                            </p>
                        </div>
                    </Col>
                    <Col md={4} className="text-center">
                        <div
                            className="p-4 rounded-3 shadow-sm step-card"
                            style={{ background: 'var(--secondary-card-color)' }}
                        >
                            <div
                                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 step-number"
                                style={{ background: 'var(--primary-hover-color)' }}
                            >
                                <span className="h4 mb-0">3</span>
                            </div>
                            <h4 className="step-title">Shop via Live Video</h4>
                            <p className="step-text">
                                Connect with our team in real-time to explore products.
                            </p>
                        </div>
                    </Col>
                </Row>
            </section>

            <section className="py-5 benefits-section">
                <Row>
                    <Col md={4} className="text-center mb-4 mb-md-0">
                        <div className="p-3">
                            <FaShoppingCart size={48} className="text-primary mb-3" style={{ color: 'var(--primary-hover-color)' }} />
                            <h4 className="benefit-title">Shop from Anywhere</h4>
                            <p className="benefit-text">Access our store from any location with an internet connection.</p>
                        </div>
                    </Col>
                    <Col md={4} className="text-center mb-4 mb-md-0">
                        <div className="p-3">
                            <FaHome size={48} className="text-primary mb-3" style={{ color: 'var(--primary-hover-color)' }} />
                            <h4 className="benefit-title">Comfort of Your Home</h4>
                            <p className="benefit-text">Enjoy personalized shopping without leaving your house.</p>
                        </div>
                    </Col>
                    <Col md={4} className="text-center">
                        <div className="p-3">
                            <FaHeadset size={48} className="text-primary mb-3" style={{ color: 'var(--primary-hover-color)' }} />
                            <h4 className="benefit-title">Interactive Sales Team</h4>
                            <p className="benefit-text">Get real-time answers from our experts.</p>
                        </div>
                    </Col>
                </Row>
            </section>
        </Container>
    );
};

export default AppointmentPage;