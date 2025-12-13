import React, { useState } from 'react';
import { FaShoppingCart, FaHome, FaHeadset, FaCheckCircle, FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useCreateAppointment } from '../../../hook/virtualVideo/useVideoAppointment';
import SmartButton from '../../../components/ui/SmartButton';

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
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }));
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

    const handleCloseModal = () => setShowSuccessModal(false);

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w mx-auto px-4 py-8 font-sans bg-[#eeece8]">
            {/* Error Alert */}
            {isError && (
                <div className="mb-2 p-2 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
                    {error?.message || 'Failed to book appointment. Please try again.'}
                </div>
            )}

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-2 mb-2">
                {/* Video Section */}
                <div className="order-1 sm:order-1">
                    <div className="relative overflow-hidden rounded-lg shadow-xl aspect-video bg-black">
                        <iframe
                            src="https://www.youtube.com/embed/HpS729OinR8?mute=1&autoplay=1&loop=1&playlist=HpS729OinR8"
                            title="Virtual Shopping Demo"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full auto"
                        ></iframe>
                    </div>
                </div>

                {/* Form Section */}
                <div className="order-2 sm:order-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-amber-100 px-3 ">
                        <h3 className="text-base mt-2 sm:text-lg font-bold text-center text-[var(--primary-text-color)] mb-2">
                            Book Your Virtual Appointment
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name & Email */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--primary-text-color)] mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        className={`w-full p-2 border h-10 ${formErrors.name ? 'border-red-500' : 'border-gray-300'} text-[var(--primary-text-color)] rounded-sm bg-white`}
                                    />
                                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--primary-text-color)] mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className={`w-full p-2 h-10 bg-white text-[var(--primary-text-color)] border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-sm `}
                                    />
                                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                                </div>
                            </div>

                            {/* Mobile & City */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--primary-text-color)] mb-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        placeholder="+91 12345 67890"
                                        className={`w-full p-2 h-10 bg-white text-[var(--primary-text-color)] border ${formErrors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded-sm `}
                                    />
                                    {formErrors.mobileNumber && <p className="text-red-500 text-xs mt-1">{formErrors.mobileNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">City/Country</label>
                                    <input
                                        type="text"
                                        name="cityOrCountry"
                                        value={formData.cityOrCountry}
                                        onChange={handleChange}
                                        placeholder="e.g., Chennai"
                                        className={`w-full h-10 bg-white text-[var(--primary-text-color)] p-2 border ${formErrors.cityOrCountry ? 'border-red-500' : 'border-gray-300'} rounded-sm `}
                                    />
                                    {formErrors.cityOrCountry && <p className="text-red-500 text-xs mt-1">{formErrors.cityOrCountry}</p>}
                                </div>
                            </div>

                            {/* Category & Subcategory */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`w-full h-10 bg-white text-[var(--primary-text-color)] p-2 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-sm `}
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Subcategory</label>
                                    <select
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        disabled={!formData.category}
                                        className={`w-full p-2 border h-10 bg-white text-[var(--primary-text-color)] ${formErrors.subCategory ? 'border-red-500' : 'border-gray-300'} rounded-sm  ${!formData.category && 'bg-gray-100 cursor-not-allowed'}`}
                                    >
                                        <option value="">Select subcategory</option>
                                        {formData.category && subCategories[formData.category].map((sub) => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                    {formErrors.subCategory && <p className="text-red-500 text-xs mt-1">{formErrors.subCategory}</p>}
                                </div>
                            </div>

                            {/* Language & Message */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Language</label>
                                    <select
                                        name="preferredLanguage"
                                        value={formData.preferredLanguage}
                                        onChange={handleChange}
                                        className={`w-full p-2  h-10 bg-white text-[var(--primary-text-color)] border ${formErrors.preferredLanguage ? 'border-red-500' : 'border-gray-300'} rounded-sm `}
                                    >
                                        <option value="">Select language</option>
                                        {languages.map((lang) => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                    {formErrors.preferredLanguage && <p className="text-red-500 text-xs mt-1">{formErrors.preferredLanguage}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message (Optional)</label>
                                    <textarea
                                        name="message"
                                        rows={3}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your preferences..."
                                        className="w-full p-2 border h-20 bg-white text-[var(--primary-text-color)]  border-gray-300 rounded-sm  resize-vertical"
                                    />
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Appointment Date</label>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleChange}
                                        min={today}
                                        className={`w-full p-2 h-10 bg-white text-[var(--primary-text-color)] border ${formErrors.appointmentDate ? 'border-red-500' : 'border-gray-300'} rounded-sm `}
                                    />
                                    {formErrors.appointmentDate && <p className="text-red-500 text-xs mt-1">{formErrors.appointmentDate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Appointment Time</label>
                                    <input
                                        type="time"
                                        name="appointmentTime"
                                        value={formData.appointmentTime}
                                        onChange={handleChange}
                                        className={`w-full p-2 h-10 bg-white text-[var(--primary-text-color)] border ${formErrors.appointmentTime ? 'border-red-500' : 'border-gray-300'} rounded-sm `}
                                    />
                                    {formErrors.appointmentTime && <p className="text-red-500 text-xs mt-1">{formErrors.appointmentTime}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex text-center pt-2 items-center justify-center pb-2 ">
                                <SmartButton
                                    type="submit"
                                    disabled={isLoading}
                                 
                                >
                                    {isLoading ? 'Booking...' : 'Book Appointment'}
                                </SmartButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className='w-full max-w-6xl mx-auto'>                           
            {/* How It Works */}
            <section className="bg-gradient-to-b from-white to-amber-50 rounded-2xl p-2 mb-4 shadow-lg">
                <h2 className="text-base sm:text-lg font-bold text-center text-[var(--primary-text-color)] mb-2">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { title: "Sign Up Online", text: "Fill out our simple form to book your virtual shopping appointment." },
                        { title: "Confirm Appointment", text: "Receive confirmation details and a link to join your session." },
                        { title: "Shop via Live Video", text: "Connect with our team in real-time to explore products." },
                    ].map((step, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm ">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2 shadow-sm">
                                {i + 1}
                            </div>
                            <h4 className="text-sm font-bold text-amber-700 mb-1">{step.title}</h4>
                            <p className="text-gray-600 text-xs leading-relaxed">{step.text}</p>
                        </div>
                    ))}
                </div>
            </section>
      
            {/* Benefits */}
            <section className="mb-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: FaShoppingCart, title: "Shop from Anywhere" },
                        { icon: FaHome, title: "Comfort of Your Home" },
                        { icon: FaHeadset, title: "Interactive Sales Team" },
                    ].map((benefit, i) => (
                        <div key={i} className="bg-white rounded-xl p-2 text-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition">
                            <benefit.icon className="text-2xl text-amber-600 mx-auto mb-4" />
                            <h4 className="text-sm font-semibold text-gray-800">{benefit.title}</h4>
                        </div>
                    ))}
                </div>
            </section>
            </div> 
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] p-4">
                    <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
                        <div className="bg-gradient-to-r from-[var(--primary-hover-color)] to-amber-600 text-white p-2 text-center relative">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-2 right-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center transition"
                            >
                                <FaTimes className="text-red-600 text-sm" />
                            </button>

                            <FaCheckCircle className="text-4xl mx-auto mb-1 animate-bounce"/>
                            <h2 className="text-lg font-bold text-white">Successfully Registered!</h2>
                        </div>
                        <div className="p-4 text-center">
                            <p className="text-gray-700 mb-3">
                                Your virtual appointment has been successfully booked. Our expert team will contact you soon.
                            </p>
                            <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-green-500 mb-6 text-left">
                                <h5 className="font-semibold text-sm text-green-700 mb-2">What happens next?</h5>
                                <ul className="text-xs text-gray-700 space-y-1 ml-4">
                                    <li>Our team will call you within 10 minutes</li>
                                    <li>We'll confirm your appointment date and time</li>
                                    <li>Get ready for a personalized jewelry shopping experience</li>
                                    <li>You'll receive a video call link before your appointment</li>
                                </ul>
                            </div>
                            <div className='flex items-center justify-center'>

                            <SmartButton
                                onClick={handleCloseModal}
                                variant='success'
                               
                            >
                                Got it, Thanks!
                            </SmartButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentPage;