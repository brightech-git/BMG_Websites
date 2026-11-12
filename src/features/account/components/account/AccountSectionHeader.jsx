export const accountButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-bold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50";
export const accountField = "h-10 min-h-10 w-full min-w-0 rounded-xl border border-orange-200 bg-white px-3 text-base";

export default function AccountSectionHeader({ icon: Icon, title, description, children }) {
    return (
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-orange-100/70 p-4 sm:p-6">
            <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-primary)] text-white">
                    <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                    <h2 className="m-0 text-xl font-bold sm:text-2xl">{title}</h2>
                    <p className="mt-1 text-sm !text-stone-700">{description}</p>
                </div>
            </div>
            {children}
        </header>
    );
}
