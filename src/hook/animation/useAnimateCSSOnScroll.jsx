import { useEffect } from "react";

export function useAnimateCSSOnScroll(selector, animationClass) {
    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>(selector);
        if (!elements.length) return;

        // Hide initially
        elements.forEach((el) => el.classList.add("opacity-0"));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove("opacity-0");
                        entry.target.classList.add("animate__animated", animationClass);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [selector, animationClass]);
}
