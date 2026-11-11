import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useFavorites } from "../../hooks/favorites/useFavoritesQuery";
import { useCart } from "../../../cart/hooks/cart/useCartQuery";
import UpdateMobileModal from "../../../../components/layouts/UpdateMobileModal";
import { getProductImages } from "../../../../utils/getProductImages";
import { formatCurrency, formatNumber, formatWeight } from "../../../../utils/index.js";
import fallbackImage from "../../../../assets/icons/silverIcon.png";

const grid = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5";

function WishlistItem({ item, inCart, onRemove, onMove }) {
  const [moving, setMoving] = useState(false);
  const name = item.SUBITEMNAME || item.ItemName || item.ITEMNAME || "Jewellery";
  const productUrl = `/products-page/${item.TAGKEY}`;
  const [image] = getProductImages(item.ImagePath, fallbackImage);
  const weight = Number(item.NETWT);

  async function moveItem() {
    setMoving(true);
    try {
      await onMove(item);
    } finally {
      setMoving(false);
    }
  }

  return (
    <li className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-white shadow-sm">
      <Link to={productUrl} className="group block overflow-hidden bg-orange-50">
        <img src={image} alt={name} loading="lazy"
          className="aspect-square w-full object-cover motion-safe:transition-transform motion-safe:group-hover:scale-105" />
      </Link>
      <button type="button" aria-label={`Remove ${name} from wishlist`} disabled={moving}
        onClick={() => onRemove(item.TAGKEY)}
        className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full border border-orange-100 bg-white text-[var(--brand-hover)] shadow-sm hover:bg-orange-50 disabled:opacity-50">
        <Trash2 size={17} aria-hidden="true" />
      </button>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <h2 className="m-0 text-sm font-bold sm:text-base">
          <Link to={productUrl} className="line-clamp-2 hover:text-[var(--brand-primary)]">{name}</Link>
        </h2>
        {weight > 0 && <p className="text-xs !text-stone-600">{formatWeight(weight)}</p>}
        <p className="mb-2 mt-auto pt-1 text-base font-bold tabular-nums !text-[var(--brand-hover)]">
          {formatCurrency(Number(item.FinalAmount) || Number(item.GrandTotal) || Number(item.RATE) || 0)}
        </p>
        {inCart ? (
          <Link to="/cart" className="flex min-h-11 items-center justify-center rounded-xl bg-orange-50 px-2 text-center text-sm font-bold text-[var(--brand-hover)] hover:bg-orange-100">View cart</Link>
        ) : (
          <button type="button" disabled={moving} onClick={moveItem}
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[var(--brand-primary)] px-2 text-sm font-bold text-white hover:bg-[var(--brand-hover)] disabled:opacity-60">
            <ShoppingBag size={16} className="hidden shrink-0 sm:block" aria-hidden="true" />
            {moving ? "Adding…" : "Add to cart"}
          </button>
        )}
      </div>
    </li>
  );
}

export default function Wishlist() {
  const { favorites, isLoading, error, removeFavorite } = useFavorites();
  const { cartItems, addToCartHandler } = useCart();
  const mobileNumber = useSelector((state) => state.user.user?.contactNumber);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const cartKeys = new Set((cartItems?.data?.products ?? []).map((item) => String(item.TAGKEY)));

  function remove(tagKey) {
    if (window.confirm("Remove this item from your wishlist?")) removeFavorite(tagKey);
  }

  async function move(item) {
    if (!mobileNumber) {
      setShowMobileModal(true);
      return;
    }
    await addToCartHandler(item, () => removeFavorite(item.TAGKEY));
  }

  return (
    <section aria-labelledby="wishlist-title" aria-busy={isLoading} className="bg-[var(--orange-50)] px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--brand-border)] bg-white p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-100 text-[var(--brand-hover)]"><Heart size={22} aria-hidden="true" /></span>
            <div>
              <h1 id="wishlist-title" className="m-0 text-2xl font-bold sm:text-3xl">Wishlist</h1>
              {!isLoading && !error && <p className="text-sm !text-stone-600">{formatNumber(favorites.length, 0)} {favorites.length === 1 ? "item" : "items"} saved</p>}
            </div>
          </div>
          <Link to="/products-page" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-[var(--brand-hover)] hover:underline">
            Continue shopping <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {isLoading ? (
          <div className={grid} aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-orange-100 bg-white motion-safe:animate-pulse">
                <div className="aspect-square bg-orange-100" />
                <div className="space-y-3 p-4"><div className="h-3 w-3/4 rounded bg-orange-100" /><div className="h-9 rounded-lg bg-orange-50" /></div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <ul className={`${grid} m-0 list-none p-0`}>
            {favorites.map((item) => (
              <WishlistItem key={item.TAGKEY} item={item} inCart={cartKeys.has(String(item.TAGKEY))}
                onRemove={remove} onMove={move} />
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-12 text-center">
            <Heart size={30} className="mx-auto mb-3 text-[var(--brand-primary)]" aria-hidden="true" />
            <h2 className="mb-2 text-xl font-bold">{error ? "Wishlist unavailable" : "Your wishlist is empty"}</h2>
            <p className="text-sm !text-stone-600">{error ? "Please try again later." : "Save jewellery you love to find it here later."}</p>
            <Link to="/products-page" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-primary)] px-4 font-bold !text-white hover:bg-[var(--brand-hover)]">Browse jewellery</Link>
          </div>
        )}
      </div>
      {showMobileModal && <UpdateMobileModal open onClose={() => setShowMobileModal(false)} />}
    </section>
  );
}
