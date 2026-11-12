import { useState } from "react";
import { ArrowRight, Clock3, LockKeyhole, Settings, Wrench } from "lucide-react";
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
                        <div
                            aria-hidden="true"
                            className="relative grid h-32 w-36 place-items-center rounded-3xl border border-orange-200 bg-gradient-to-br from-white to-orange-100 sm:h-40 sm:w-44"
                        >
                            <div className="absolute inset-3 rounded-2xl border border-dashed border-orange-300" />
                            <Settings
                                size={68}
                                strokeWidth={1.4}
                                className="absolute bottom-5 left-5 text-[var(--brand-primary)] motion-safe:animate-[spin_18s_linear_infinite]"
                            />
                            <Settings
                                size={46}
                                strokeWidth={1.5}
                                className="absolute right-4 top-4 text-orange-400 motion-safe:animate-[spin_12s_linear_infinite_reverse]"
                            />
                            <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-xl bg-white text-[var(--brand-hover)] shadow-sm">
                                <Wrench size={17} />
                            </span>
                        </div>
                        <div className="min-w-0">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-bold text-[var(--brand-hover)]">
                                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-orange-500 motion-safe:animate-pulse" />
                                Upgrade in progress
                            </div>
                            <h1 id="maintenance-title" className="m-0 max-w-xl text-3xl font-bold leading-tight sm:text-5xl">
                                Our website is under maintenance
                            </h1>
                            <p className="mt-4 max-w-xl text-base leading-relaxed !text-stone-700">
                                We’re making major updates to the BMG Jewellers online store.
                            </p>
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
                                    className="min-h-10 h-10 min-w-0 flex-1 rounded-lg border border-orange-200 bg-white px-3 text-base"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-bold text-white hover:bg-[var(--brand-hover)]"
                                >
                                    Enter into Bmg World
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
