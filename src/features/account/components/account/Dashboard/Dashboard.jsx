import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Heart, LayoutGrid, Package, ShoppingBag, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { getOrderHistory } from "../../../../orders/api/orderService";
import { useCart } from "../../../../cart/hooks/cart/useCartQuery";
import { useFavorites } from "../../../../wishlist/hooks/favorites/useFavoritesQuery";
import { formatCurrency, formatDate, formatNumber } from "../../../../../utils/index.js";
import { getProductImages } from "../../../../../utils/getProductImages.js";
import AccountSectionHeader from "../AccountSectionHeader";

function AccountShortcut({ icon: Icon, label, value, to }) {
    return (
        <Link
            to={to}
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-orange-100 bg-white p-3 text-[var(--primary-text-color)] shadow-sm hover:border-orange-300 hover:bg-orange-50 sm:p-4"
        >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-100 text-[var(--brand-hover)]">
                <Icon size={19} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{label}</span>
                {value != null && <span className="text-sm text-stone-600">{formatNumber(value, 0)}</span>}
            </span>
            <ChevronRight size={17} className="shrink-0 text-[var(--brand-hover)]" aria-hidden="true" />
        </Link>
    );
}

function RecentOrder({ order }) {
    const status = String(order.status ?? "").trim().replaceAll("_", " ");

    const firstItem =order.orderItems[0];

    return (
        <li>
            <Link
                to={`/account/orderdetails/${order.orderId}`}
                state={{ order }}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-4 text-[var(--primary-text-color)] hover:bg-orange-50 sm:px-5"
            >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-[var(--brand-hover)]">
                    <img src={getProductImages(firstItem.imagePath)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-[var(--brand-hover)]" />
                </span>
                <span className="min-w-0">
                    <span className="block break-words text-sm font-bold">{order.orderId}</span>
                    <span className="block text-xs text-stone-600">
                        {formatDate(order.orderTime || order.createdAt)}
                    </span>
                    {status && (
                        <span className="mt-1 inline-block max-w-full break-words rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold capitalize text-[var(--brand-hover)]">
                            {status.toLowerCase()}
                        </span>
                    )}
                </span>
                <span className="flex flex-wrap items-center justify-end gap-1 text-right text-sm font-bold tabular-nums text-[var(--brand-hover)]">
                    {formatCurrency(order.totalAmount)}
                    <ChevronRight size={16} aria-hidden="true" />
                </span>
            </Link>
        </li>
    );
}

export default function Dashboard() {
    const orders = useQuery({
        queryKey: ["orderHistory", "account-overview"],
        queryFn: () => getOrderHistory(),
    });
    const { cartCount, isLoading: cartLoading, error: cartError } = useCart();
    const { favoritesCount, isLoading: favoritesLoading, error: favoritesError } = useFavorites();
    const orderList = Array.isArray(orders.data?.content)
        ? orders.data.content
        : Array.isArray(orders.data?.data) ? orders.data.data : [];

    return (
        <div className="space-y-4 sm:space-y-6">
            <AccountSectionHeader
                icon={LayoutGrid}
                title="Overview"
                description="Find recent purchases, saved jewellery, and your shopping cart."
            />
            <section aria-labelledby="account-shortcuts">
                <h2 id="account-shortcuts" className="mb-3 text-lg font-bold">Quick links</h2>
                <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
                    <AccountShortcut
                        icon={ShoppingBag}
                        label="Orders"
                        value={orders.data?.totalOrders ?? orders.data?.totalElements}
                        to="/account/orders"
                    />
                    <AccountShortcut
                        icon={Heart}
                        label="Wishlist"
                        value={favoritesLoading || favoritesError ? null : favoritesCount}
                        to="/wishlist"
                    />
                    <AccountShortcut
                        icon={ShoppingCart}
                        label="Cart"
                        value={cartLoading || cartError ? null : cartCount}
                        to="/cart"
                    />
                </div>
            </section>

            <section aria-labelledby="recent-orders" className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 bg-orange-50/60 px-3 py-3 sm:px-5">
                    <h2 id="recent-orders" className="m-0 text-lg font-bold">Recent orders</h2>
                    <Link to="/account/orders" className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[var(--brand-hover)] hover:underline">
                        View all orders
                        <ChevronRight size={16} aria-hidden="true" />
                    </Link>
                </div>

                {orders.isPending ? (
                    <p role="status" className="p-5 text-sm">Loading orders…</p>
                ) : orders.isError && orderList.length === 0 ? (
                    <div className="p-5">
                        <p role="status" className="text-sm">We couldn’t load your orders.</p>
                        <button
                            type="button"
                            onClick={() => orders.refetch()}
                            className="mt-2 min-h-11 rounded-xl bg-orange-100 px-3 text-sm font-bold text-[var(--brand-hover)]"
                        >
                            Try again
                        </button>
                    </div>
                ) : orderList.length > 0 ? (
                    <ul className="m-0 list-none divide-y divide-orange-100 p-0">
                        {orderList.slice(0, 5).map((order) => <RecentOrder key={order.orderId} order={order} />)}
                    </ul>
                ) : (
                    <div className="px-4 py-8 text-center">
                        <Package size={27} className="mx-auto mb-2 text-[var(--brand-hover)]" aria-hidden="true" />
                        <p className="font-bold">No orders yet</p>
                        <Link to="/products-page" className="mt-2 inline-flex min-h-11 items-center rounded-xl bg-orange-100 px-4 text-sm font-bold text-[var(--brand-hover)]">
                            Browse jewellery
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
