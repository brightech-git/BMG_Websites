import { useEffect, useRef, useState } from "react";
import { CreditCard, Landmark, QrCode, X } from "lucide-react";

const methods = [
    { value: "CARD", label: "Credit or debit card", icon: CreditCard },
    { value: "UPI", label: "UPI", icon: QrCode },
    { value: "NETBANKING", label: "Net banking", icon: Landmark },
];

function PaymentDialog({ onClose, onConfirm }) {
    const dialogRef = useRef(null);
    const [selected, setSelected] = useState("CARD");

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();
        return () => dialog.close();
    }, []);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="checkout-payment-title"
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            className="fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-orange-200 bg-white p-4 shadow-xl backdrop:bg-stone-950/40 sm:p-6"
        >
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 id="checkout-payment-title" className="m-0 text-xl font-bold">Choose how to pay</h2>
                <button
                    type="button"
                    aria-label="Close payment options"
                    onClick={onClose}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-[var(--brand-hover)]"
                >
                    <X size={20} aria-hidden="true" />
                </button>
            </div>

            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    onConfirm(selected);
                }}
            >
                <fieldset className="space-y-2">
                    <legend className="sr-only">Online payment options</legend>
                    {methods.map(({ value, label, icon: Icon }) => (
                        <label
                            key={value}
                            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-bold ${
                                selected === value ? "border-orange-300 bg-orange-50" : "border-stone-200"
                            }`}
                        >
                            <input
                                type="radio"
                                name="onlinePaymentMethod"
                                value={value}
                                checked={selected === value}
                                onChange={() => setSelected(value)}
                                className="h-4 w-4 shrink-0 accent-[var(--brand-primary)]"
                            />
                            <Icon size={20} className="text-[var(--brand-hover)]" aria-hidden="true" />
                            {label}
                        </label>
                    ))}
                </fieldset>
                <button
                    type="submit"
                    className="min-h-11 w-full rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-bold text-white hover:bg-[var(--brand-hover)]"
                >
                    Continue to payment
                </button>
            </form>
        </dialog>
    );
}

export default function PaymentOptionsDialog({ isOpen, onClose, onConfirm }) {
    return isOpen ? <PaymentDialog onClose={onClose} onConfirm={onConfirm} /> : null;
}
