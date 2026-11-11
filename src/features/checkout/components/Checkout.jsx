import { useEffect, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Content from "./checkout/Content";
import { useDocumentMeta } from "../../../utils/meta/useMeta";

export default function Checkout() {
    const { state } = useLocation();
    const payload = useMemo(() => {
        if (state) return state;

        try {
            return JSON.parse(localStorage.getItem("checkoutPayload") || "null");
        } catch {
            return null;
        }
    }, [state]);
    const hasItems = Array.isArray(payload?.items) && payload.items.length > 0;

    useDocumentMeta({
        title: "BMG | Checkout",
        description: "Review delivery details and choose how to pay for your order.",
    });

    useEffect(() => {
        if (hasItems) localStorage.setItem("checkoutPayload", JSON.stringify(payload));
    }, [hasItems, payload]);

    if (!hasItems) return <Navigate to="/cart" replace />;

    return <Content initialCartItems={payload.items} subtotal={Number(payload.subtotal) || 0} />;
}
