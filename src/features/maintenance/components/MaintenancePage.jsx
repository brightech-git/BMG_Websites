import { useState } from "react";
import { ArrowRight, Clock3, LockKeyhole, Wrench } from "lucide-react";
import logo from "../../../assets/icons/logo.png";

const previewPassword = "bmg@123";

export default function MaintenancePage({ message, onAccess }) {
    const [password, setPassword] = useState("");
    const [hasError, setHasError] = useState(false);
    const notice = typeof message === "string" ? message.trim() : "";

    function handleSubmit(event) {
        event.preventDefault();

        if (password === previewPassword) {
            onAccess();
            return;
        }

        setHasError(true);
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-4xl">
                <img
                    src={logo}
                    alt="BMG Jewellers"
                    className="mb-8 h-auto w-32 sm:w-40"
                />

                <section
                    aria-labelledby="maintenance-title"
                    className="overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-white shadow-sm"
                >
                    <div className="grid gap-6 border-b border-orange-100 bg-orange-50/60 px-5 py-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8 sm:px-10 sm:py-12">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-orange-200 bg-white text-[var(--brand-hover)] sm:h-16 sm:w-16">
                            <Wrench size={28} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <h1 id="maintenance-title" className="m-0 max-w-xl text-3xl font-bold leading-tight sm:text-5xl">
                                Our website is under maintenance
                            </h1>
                            {notice && !/^website is currently under maintenance\.?$/i.test(notice) && (
                                <p className="mt-4 whitespace-pre-wrap break-words text-base !text-stone-700">
                                    {notice}
                                </p>
                            )}
                            <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed !text-stone-700 sm:text-base">
                                <Clock3 size={19} className="mt-0.5 shrink-0 text-[var(--brand-hover)]" aria-hidden="true" />
                                Please check back in a little while. Thank you for your patience.
                            </p>
                        </div>
                    </div>

                    <div className="px-5 py-6 sm:px-10 sm:py-8">
                        <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
                            <LockKeyhole size={17} className="text-[var(--brand-hover)]" aria-hidden="true" />
                            Preview access
                        </h2>
                        <form onSubmit={handleSubmit} className="max-w-xl">
                            <label htmlFor="maintenance-password" className="mb-2 block text-sm font-bold">
                                Access password
                            </label>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    id="maintenance-password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    aria-invalid={hasError}
                                    aria-describedby={hasError ? "maintenance-password-error" : undefined}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        setHasError(false);
                                    }}
                                    className="h-12 min-w-0 flex-1 rounded-xl border border-orange-200 bg-white px-3 text-base"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-bold text-white hover:bg-[var(--brand-hover)]"
                                >
                                    Enter storefront
                                    <ArrowRight size={17} aria-hidden="true" />
                                </button>
                            </div>
                            {hasError && (
                                <p id="maintenance-password-error" role="alert" className="mt-2 text-sm !text-red-700">
                                    Incorrect password. Please try again.
                                </p>
                            )}
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
}
