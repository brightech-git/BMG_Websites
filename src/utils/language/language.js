// src/utils/language.ts
export const getLanguage = () => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("lang")) || "en";
};

export const setLanguage = (lang) => {
    
    localStorage.setItem("lang", lang);
};
