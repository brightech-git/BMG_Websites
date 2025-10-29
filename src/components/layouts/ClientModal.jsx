import React, { useEffect, useState } from 'react';
import './ClientModal.css';

const ClientModal = ({ logoSrc, onComplete }) => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const modalShown = sessionStorage.getItem('clientModalShown');
        console.log('CHECKING MODAL:', modalShown); // Check this in console

        if (!modalShown) {
            setShowModal(true);
            sessionStorage.setItem('clientModalShown', 'true');

            const timer = setTimeout(() => {
                setShowModal(false);
                onComplete?.();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            onComplete?.();
        }
    }, [onComplete]);

    if (!showModal) {
        return null;
    }

    return (
        <div className="client-modal-backdrop" onClick={() => {
            setShowModal(false);
            onComplete?.();
        }}>
            <div className="client-modal-content">
                <img src={logoSrc} alt="Client Logo" className="client-logo" />
            </div>
        </div>
    );
};

export default ClientModal;