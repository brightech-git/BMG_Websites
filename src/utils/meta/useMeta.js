// src/utils/useDocumentMeta.js
import { useEffect } from "react";

export function useDocumentMeta(options) {
    const { title, description } = options || {};
    useEffect(() => {
        if (title) document.title = title;

        if (description) {
            let meta = document.querySelector("meta[name='description']");
            if (!meta) {
                meta = document.createElement("meta");
                meta.name = "description";
                document.head.appendChild(meta);
            }
            meta.content = description;
        }
    }, [title, description]);
}
