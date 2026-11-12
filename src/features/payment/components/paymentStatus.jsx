import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, CheckCircle2, Clock3, Package, RefreshCw, ShoppingBag, XCircle } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "../api/paymentServiceicici";
import { getOrderById } from "../../orders/api/orderService";
import { useCreateReOrder } from "../../orders/hooks/order/useReorder";
import { useCart } from "../../cart/hooks/cart/useCartQuery";
import { formatCurrency } from "../../../utils/index.js";

const primary = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-bold !text-white hover:bg-[var(--brand-hover)] disabled:opacity-50";
const secondary = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 text-sm font-bold text-[var(--brand-hover)] hover:bg-orange-50";

const messages = {
    loading: {
        title: "Checking your order",
        description: "We’re confirming the latest status.",
        icon: Clock3,
    },
    cod: {
        title: "Your order is confirmed",
        description: "Thank you for shopping with BMG Jewellers. You can pay when your order arrives.",
        icon: CheckCircle2,
    },
    paid: {
        title: "Payment successful",
        description: "Thank you for shopping with BMG Jewellers. Your payment was received and your order is confirmed.",
        icon: CheckCircle2,
    },
    failed: {
        title: "Payment didn’t go through",
        description: "You can try again from this page or check your order details.",
        icon: XCircle,
    },
    pending: {
        title: "Payment is pending",
        description: "Your payment hasn’t been confirmed yet. Check the status again in a moment.",
        icon: Clock3,
    },
    unavailable: {
        title: "We couldn’t confirm your order",
        description: "Check the status again or open your orders to see the latest update.",
        icon: Clock3,
    },
    missing: {
        title: "Order reference missing",
        description: "Open My Orders to find your purchase.",
        icon: Package,
    },
};

const ribbons = [
    { x: -86, y: -35, rotation: -38, color: "bg-orange-500" },
    { x: -99, y: 11, rotation: 28, color: "bg-emerald-500" },
    { x: -69, y: 51, rotation: 50, color: "bg-amber-400" },
    { x: 80, y: -41, rotation: 43, color: "bg-amber-400" },
    { x: 101, y: 7, rotation: -24, color: "bg-orange-500" },
    { x: 74, y: 50, rotation: -48, color: "bg-emerald-500" },
];

function SuccessCelebration() {
    const reduceMotion = useReducedMotion();

    return (
        <div aria-hidden="true" className="relative mx-auto mb-5 grid h-40 w-60 place-items-center">
            <span className="absolute h-32 w-32 rounded-full border border-emerald-200" />
            {/* {ribbons.map(({ x, y, rotation, color }) => (
                <motion.span
                    key={x}
                    initial={reduceMotion ? false : { x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{ x, y, rotate: rotation, opacity: 1, scale: 1 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay: 0.18 }}
                    className={`absolute h-1.5 w-4 rounded-full ${color}`}
                />
            ))} */}
            <motion.div
                initial={reduceMotion ? false : { scale: 0.65, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 19 }}
                className="relative grid h-24 w-24 place-items-center rounded-full bg-emerald-700 text-white shadow-md ring-8 ring-emerald-50"
            >
                <Check size={48} strokeWidth={3} />
            </motion.div>
        </div>
    );
}

export default function PaymentStatus() {
    const [params] = useSearchParams();
    const orderId = params.get("orderId")?.trim();
    const cod = params.get("mode")?.toLowerCase() === "cod";
    const navigate = useNavigate();
    const { state: routeState } = useLocation();
    const { clearCart } = useCart();
    const { mutateAsync: createReOrder, isPending: retrying } = useCreateReOrder();
    const [retryError, setRetryError] = useState("");
    const clearedOrders = useRef(new Set());
    const verification = useQuery({
        queryKey: ["checkout-result", orderId, cod],
        queryFn: () => cod ? getOrderById(orderId) : getPaymentStatus(orderId),
        enabled: Boolean(orderId),
        retry: false,
        refetchOnWindowFocus: false,
    });

    const payment = String(verification.data?.paymentStatus ?? "").toLowerCase();
    let result = "pending";
    if (!orderId) result = "missing";
    else if (verification.isPending) result = "loading";
    else if (verification.isError) result = "unavailable";
    else if (cod) result = String(verification.data?.paymentMode).toUpperCase() === "COD" ? "cod" : "unavailable";
    else if (payment === "paid") result = "paid";
    else if (["failure", "failed"].includes(payment)) result = "failed";

    const confirmed = result === "paid" || result === "cod";
    const { title, description, icon: StatusIcon } = messages[result];
    const total = verification.data?.totalAmount ?? (cod ? routeState?.orderPayload?.totalAmount : null);
    const orderLink = orderId ? `/account/orderdetails/${encodeURIComponent(orderId)}` : "/account/orders";

    useEffect(() => {
        if (!confirmed || clearedOrders.current.has(orderId)) return;

        const key = `payment_processed_${orderId}`;
        clearedOrders.current.add(orderId);
        try {
            if (sessionStorage.getItem(key)) return;
            sessionStorage.setItem(key, "true");
        } catch {
            // The ref still prevents another clear while this page is mounted.
        }
        clearCart();
    }, [clearCart, confirmed, orderId]);

    async function retryPayment() {
        if (retrying || !window.confirm("Try payment for this order again?")) return;
        setRetryError("");
        try {
            const response = await createReOrder(orderId);
            if (!response?.newOrderId) {
                setRetryError("We couldn’t start another payment. Please check your order details.");
                return;
            }
            navigate(`/payment/${encodeURIComponent(response.newOrderId)}`);
        } catch {
            setRetryError("We couldn’t start another payment. Please try again.");
        }
    }

    if (confirmed) {
        return (
            <section aria-labelledby="checkout-result-title" className="bg-gradient-to-b from-orange-50 to-white px-3 py-7 sm:px-6 sm:py-14">
                <div className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
                    <div className="bg-gradient-to-b from-emerald-50/70 to-white px-5 pb-5 pt-4 text-center sm:px-8 sm:pt-6">
                        <SuccessCelebration />
                        <h1 id="checkout-result-title" className="m-0 text-3xl font-bold tracking-tight sm:text-4xl">
                            {title}
                        </h1>
                        <p role="status" className="mx-auto mt-3 max-w-sm text-sm leading-relaxed !text-stone-700">
                            {description}
                        </p>
                    </div>

                    <div className="min-w-0 px-5 pb-6 sm:px-8 sm:pb-8">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                            <Package size={20} className="text-[var(--brand-hover)]" aria-hidden="true" />
                            Order summary
                        </h2>
                        <dl className="m-0 divide-y divide-orange-100 rounded-2xl border border-orange-100 px-4">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                                <dt className="text-sm text-stone-600">Order reference</dt>
                                <dd className="m-0 min-w-0 break-words font-bold">#{orderId}</dd>
                            </div>
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                                <dt className="text-sm text-stone-600">Payment</dt>
                                <dd className="m-0 font-bold">{cod ? "Cash on delivery" : "Paid online"}</dd>
                            </div>
                            {total != null && (
                                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                                    <dt className="text-sm font-bold">{cod ? "Due on delivery" : "Amount paid"}</dt>
                                    <dd className="m-0 text-xl font-bold tabular-nums text-[var(--brand-hover)]">
                                        {formatCurrency(total)}
                                    </dd>
                                </div>
                            )}
                        </dl>
                        <Link to={orderLink} className={`${primary} mt-5 w-full`}>
                            Track your order
                            <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                        <Link to="/products-page" className={`${secondary} mt-2 w-full`}>
                            <ShoppingBag size={17} aria-hidden="true" />
                            Continue shopping
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section aria-labelledby="checkout-result-title" className="bg-gradient-to-b from-orange-50 to-white px-3 py-6 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm">
                <div className="border-b border-orange-100 bg-orange-50/70 px-5 py-7 sm:px-8 sm:py-10">
                    <div className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl ${
                        result === "failed" ? "bg-rose-100 text-rose-800" : "bg-orange-100 text-[var(--brand-hover)]"
                    }`}>
                        <StatusIcon size={29} aria-hidden="true" />
                    </div>
                    <h1 id="checkout-result-title" className="m-0 text-3xl font-bold tracking-tight sm:text-4xl">
                        {title}
                    </h1>
                    <p role="status" className="mt-3 max-w-lg text-base !text-stone-700">{description}</p>
                </div>

                <div className="space-y-5 p-5 sm:p-8">
                    {orderId && (
                        <dl className="m-0 grid gap-3 rounded-2xl border border-orange-100 p-4 sm:grid-cols-2">
                            <div className="min-w-0">
                                <dt className="text-sm text-stone-600">Order reference</dt>
                                <dd className="m-0 break-words font-bold">#{orderId}</dd>
                            </div>
                        </dl>
                    )}

                    {retryError && <p role="alert" className="rounded-xl bg-rose-50 p-3 !text-rose-800">{retryError}</p>}

                    <div className="grid gap-2 sm:grid-cols-2">
                        {result === "failed" ? (
                            <button type="button" onClick={retryPayment} disabled={retrying} className={primary}>
                                <RefreshCw size={17} aria-hidden="true" /> {retrying ? "Starting payment…" : "Retry payment"}
                            </button>
                        ) : orderId && result !== "loading" ? (
                            <button type="button" onClick={() => verification.refetch()} disabled={verification.isFetching} className={primary}>
                                <RefreshCw size={17} aria-hidden="true" /> {verification.isFetching ? "Checking…" : "Check status"}
                            </button>
                        ) : null}

                        <Link to="/account/orders" className={secondary}>
                            <ShoppingBag size={18} aria-hidden="true" /> My orders
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
