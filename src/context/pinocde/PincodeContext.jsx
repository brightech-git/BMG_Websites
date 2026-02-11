'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const PincodeContext = createContext();

export const PincodeProvider = ({ children }) => {
    const [pincode, setPincode] = useState('');
    const [pincodeData, setPincodeData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load pincode from localStorage on initial load
    useEffect(() => {
        const savedPincode = localStorage.getItem('userPincode');
        const savedPincodeData = localStorage.getItem('userPincodeData');

        if (savedPincode) {
            setPincode(savedPincode);
        }
        if (savedPincodeData) {
            try {
                setPincodeData(JSON.parse(savedPincodeData));
            } catch (e) {
                console.error('Failed to parse saved pincode data', e);
            }
        }
    }, []);

    // Listen for pincode changes from other components (like shop page)
    useEffect(() => {
        const handlePincodeChanged = (event) => {
            if (event.detail) {
                const { pincode: newPincode, data } = event.detail;
                setPincode(newPincode);
                setPincodeData(data);

                // Also update localStorage
                if (newPincode) {
                    localStorage.setItem('userPincode', newPincode);
                }
                if (data) {
                    localStorage.setItem('userPincodeData', JSON.stringify(data));
                }
            }
        };

        // Listen for custom events
        window.addEventListener('pincodeChanged', handlePincodeChanged);

        return () => {
            window.removeEventListener('pincodeChanged', handlePincodeChanged);
        };
    }, []);

    // Update pincode and save to localStorage
    const updatePincode = async (newPincode, data = null) => {
        setIsLoading(true);
        try {
            setPincode(newPincode);
            setPincodeData(data);
            localStorage.setItem('userPincode', newPincode);

            if (data) {
                localStorage.setItem('userPincodeData', JSON.stringify(data));
            }

            // Dispatch custom event for other components to listen to
            window.dispatchEvent(new CustomEvent('pincodeChanged', {
                detail: { pincode: newPincode, data }
            }));
        } catch (error) {
            console.error('Error updating pincode:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear pincode
    const clearPincode = () => {
        setPincode('');
        setPincodeData(null);
        localStorage.removeItem('userPincode');
        localStorage.removeItem('userPincodeData');
        window.dispatchEvent(new CustomEvent('pincodeChanged', {
            detail: { pincode: '', data: null }
        }));
    };

    return (
        <PincodeContext.Provider value={{
            pincode,
            pincodeData,
            isLoading,
            updatePincode,
            clearPincode,
            setPincodeData
        }}>
            {children}
        </PincodeContext.Provider>
    );
};

export const usePincode = () => {
    const context = useContext(PincodeContext);
    if (!context) {
        throw new Error('usePincode must be used within a PincodeProvider');
    }
    return context;
};