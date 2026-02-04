import React, { createContext, useState, useEffect, useContext } from "react";
import { getCompanyDetails } from "../../service/companyDetials";

const companyDetailContext = createContext();

export const CompanyDetailsProvider = ({ children }) => {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getCompanyDetails();
                setDetails(data?.[0]);
            } catch (err) {
                console.error("Failed to fetch company details", err);
            }
        };
        fetchDetails();
    }, []);

    return (
        <companyDetailContext.Provider value={{ details }}>
            {children}
        </companyDetailContext.Provider>
    );
};

export const useCompanyDetails = () => useContext(companyDetailContext);
