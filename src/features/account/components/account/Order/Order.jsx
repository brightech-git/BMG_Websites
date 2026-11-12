import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Package, Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { getOrderHistory } from "../../../../orders/api/orderService";
import { formatCurrency, formatDate, formatNumber } from "../../../../../utils/index.js";
import AccountSectionHeader, { accountField } from "../AccountSectionHeader";
import { getImage, getProductImages } from "../../../../../utils/getProductImages.js";

const statuses = [
    ["pending", "Pending"], ["placed", "Placed"], ["in_processing", "Processing"],
    ["packed", "Packed"], ["shipped", "Shipped"], ["delivered", "Delivered"], ["cancelled", "Cancelled"],
];
const dates = [
    ["7", "Last 7 days"], ["30", "Last 30 days"], ["90", "Last 3 months"],
    ["180", "Last 6 months"], ["365", "Last year"],
];
const pageButton = "inline-flex min-h-11 items-center gap-1 rounded-xl border border-orange-200 bg-white px-3 text-sm font-bold text-[var(--brand-hover)] disabled:opacity-40";

function OrderCard({ order }) {

    const firstItem = order.orderItems[0];
    const status = String(order.status || "Unknown").toLowerCase();
    const tone = status === "delivered"
        ? "bg-emerald-50 text-emerald-800"
        : status === "cancelled" ? "bg-rose-50 text-rose-800" : "bg-orange-100 text-[var(--brand-hover)]";

    return (
        <li>
            <Link
                to={`/account/orderdetails/${order.orderId}`}
                state={{ order }}
                className="block rounded-2xl border border-orange-100 bg-white p-4 text-[var(--primary-text-color)] shadow-sm hover:border-orange-300 sm:p-5"
            >
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                        <img src={getProductImages(firstItem.imagePath)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-[var(--brand-hover)]" />


                        <div className="min-w-0">
                            <p className="break-words font-bold">{order.orderId}</p>
                            <p className="text-sm !text-stone-600">{formatDate(order.orderTime || order.createdAt)}</p>
                        </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${tone}`}>
                        {status.replaceAll("_", " ")}
                    </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-orange-100 pt-3">
                    <span className="font-bold tabular-nums">{formatCurrency(order.totalAmount)}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--brand-hover)]">
                        View order <ChevronRight size={16} aria-hidden="true" />
                    </span>
                </div>
            </Link>
        </li>
    );
}

export default function Orders() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [days, setDays] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const orders = useQuery({
        queryKey: ["orderHistory", { page, size, status }],
        queryFn: () => getOrderHistory({ page, size, status }),
    });
    const data = orders.data;
    const rows = data?.data ?? data?.content;
    const items = Array.isArray(rows) ? rows : [];
    const query = search.trim().toLowerCase();
    const filtered = items.filter((order) => {
        const matchesSearch = !query ||
            String(order.orderId).toLowerCase().includes(query) ||
            (order.items || []).some((item) => String(item.name || item.productName || "").toLowerCase().includes(query));
        const matchesDate = !days || Date.now() - new Date(order.orderTime || order.createdAt).getTime() <= Number(days) * 86400000;
        return matchesSearch && matchesDate;
    });
    const pageCount = Number(data?.totalPages ?? Math.ceil((data?.totalOrders ?? data?.totalElements ?? 0) / size));
    const canAdvance = pageCount > 0 ? page + 1 < pageCount : items.length === size;
    const hasFilters = Boolean(search || status || days);

    function clearFilters() {
        setSearch("");
        setStatus("");
        setDays("");
        setPage(0);
    }

    return (
        <div className="space-y-4">
            <AccountSectionHeader
                icon={ShoppingBag}
                title="Orders"
                description="Check your order status and open past purchases."
            />
            <div className="grid gap-3 rounded-2xl border border-orange-100 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
                <label className="block text-sm font-bold">
                    Search this page
                    <span className="relative mt-1 block">
                        <Search size={17} aria-hidden="true" className="absolute left-3 top-4 text-[var(--brand-hover)]" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Order ID or item"
                            className={`${accountField} pl-9`}
                        />
                    </span>
                </label>
                <label className="block text-sm font-bold">
                    Status
                    <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }} className={`${accountField} mt-1`}>
                        <option value="">All statuses</option>
                        {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </label>
                <label className="block text-sm font-bold">
                    Date on this page
                    <select value={days} onChange={(event) => setDays(event.target.value)} className={`${accountField} mt-1`}>
                        <option value="">Any time</option>
                        {dates.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </label>
                <label className="block text-sm font-bold">
                    Per page
                    <select value={size} onChange={(event) => { setSize(Number(event.target.value)); setPage(0); }} className={`${accountField} mt-1`}>
                        {[5, 10, 20, 50].map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>
                </label>
            </div>

            {hasFilters && <button type="button" onClick={clearFilters} className={pageButton}>Clear filters</button>}

            {orders.isPending ? (
                <p role="status" className="rounded-2xl bg-white p-5">Loading orders…</p>
            ) : orders.isError ? (
                <div className="rounded-2xl bg-white p-5">
                    <p role="alert" className="mb-3">We couldn’t load your orders.</p>
                    <button type="button" onClick={() => orders.refetch()} className={pageButton}>Try again</button>
                </div>
            ) : filtered.length > 0 ? (
                <ul className="m-0 grid list-none gap-3 p-0 xl:grid-cols-2">
                    {filtered.map((order) => <OrderCard key={order.orderId} order={order} />)}
                </ul>
            ) : (
                <div className="rounded-2xl border border-orange-100 bg-white p-6 text-center">
                    <Package size={28} className="mx-auto mb-3 text-[var(--brand-hover)]" aria-hidden="true" />
                    <p className="font-bold">{hasFilters ? "No orders match on this page" : "No orders to show"}</p>
                </div>
            )}

            {(page > 0 || canAdvance) && (
                <nav aria-label="Order pages" className="flex flex-wrap items-center justify-between gap-2">
                    <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)} className={pageButton}>
                        <ChevronLeft size={16} aria-hidden="true" /> Previous
                    </button>
                    <span className="text-sm">Page {formatNumber(page + 1, 0)}{pageCount > 0 && ` of ${formatNumber(pageCount, 0)}`}</span>
                    <button type="button" disabled={!canAdvance || orders.isFetching} onClick={() => setPage(page + 1)} className={pageButton}>
                        Next <ChevronRight size={16} aria-hidden="true" />
                    </button>
                </nav>
            )}
        </div>
    );
}
