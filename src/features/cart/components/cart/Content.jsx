import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock3, ShoppingBag, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useCart } from '../../hooks/cart/useCartQuery';
import fallbackImage from '../../../../assets/icons/silverIcon.png';
import UpdateMobileModal from '../../../../components/layouts/UpdateMobileModal';
import { getProductImages } from '../../../../utils/getProductImages';
import { formatCurrency, formatNumber, formatWeight } from '../../../../utils/index.js';

const actionClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 font-bold !text-white hover:bg-[var(--brand-hover)] disabled:opacity-50';

function SectionCard({ children, className = '' }) {
    return <section className={`rounded-2xl border border-[var(--brand-border)] bg-white shadow-sm ${className}`}>{children}</section>;
}

function CartHeader({ itemCount, selectedCount, onSelectAll }) {
    const allSelected = itemCount > 0 && itemCount === selectedCount;
    return (
        <SectionCard className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
            <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-[var(--brand-hover)]">
                    <ShoppingBag size={22} aria-hidden="true" />
                </span>
                <div>
                    <h1 className="m-0 text-2xl font-bold sm:text-3xl">Shopping cart</h1>
                    <p className="text-sm !text-stone-600">{formatNumber(itemCount, 0)} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
                </div>
            </div>
            {itemCount > 1 && (
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-orange-50 px-3 text-sm font-bold">
                    <input type="checkbox" checked={allSelected} onChange={onSelectAll}
                        className="h-4 w-4 shrink-0 accent-[var(--brand-primary)]" />
                    Select all
                </label>
            )}
        </SectionCard>
    );
}

function CartItem({ item, onRemove, onSelect, isSelected, itemLength }) {
    const name = item.ItemName || item.SUBITEMNAME || item.ITEMNAME || 'Jewellery';
    const [image] = getProductImages(item.ImagePath, fallbackImage);
    const productUrl = `/products-page/${item.TAGKEY}`;
    const price = Number(item.FinalAmount) || Number(item.GrandTotal) || 0;
    const weight = Number(item.NETWT);
    return (
        <article className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 rounded-xl border p-3 sm:gap-x-4 sm:p-4 ${isSelected ? 'border-orange-200 bg-orange-50/60' : 'border-stone-200 bg-white'}`}>
            <Link to={productUrl} className="row-span-2 block overflow-hidden rounded-lg bg-white">
                <img src={image} alt={name} loading="lazy" className="aspect-square w-16 object-cover sm:w-24" />
            </Link>
            <div className="min-w-0">
                <h3 className="m-0 text-sm font-bold sm:text-base">
                    <Link to={productUrl} className="break-words hover:text-[var(--brand-primary)]">{name}</Link>
                </h3>
                {item.ComboId != null && (
                    <p className="mt-1 text-xs !text-[var(--brand-hover)]">
                        Set · {item.ComboName || item.COMBONAME || item.ComboId}
                    </p>
                )}
                {item.TAGNO && <p className="mt-1 break-words text-xs !text-stone-600">Tag {item.TAGNO}</p>}
                {weight > 0 && <p className="text-xs !text-stone-600">{formatWeight(weight)}</p>}
            </div>
            <button type="button" aria-label={`Remove ${name} from cart`} onClick={() => onRemove(item.TAGKEY)}
                className="grid h-11 w-11 place-items-center rounded-xl border border-orange-100 bg-white text-[var(--brand-hover)] hover:bg-orange-100">
                <Trash2 size={17} aria-hidden="true" />
            </button>
            <div className="col-span-2 flex flex-wrap items-center justify-between gap-2 self-end">
                <p className="font-bold tabular-nums !text-[var(--brand-hover)]">{formatCurrency(price)}</p>
                {itemLength > 1 && (
                    <label className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 text-xs font-bold">
                        <input type="checkbox" checked={isSelected} onChange={() => onSelect(item.TAGKEY)}
                            aria-label={`Select ${name} for checkout`} className="h-4 w-4 shrink-0 accent-[var(--brand-primary)]" />
                        Select
                    </label>
                )}
            </div>
        </article>
    );
}

function CartItemsHeader({ selectedCount, totalCount }) {
    return (
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="m-0 text-lg font-bold">Cart items</h2>
            <p className="text-sm !text-stone-600">{formatNumber(selectedCount, 0)} of {formatNumber(totalCount, 0)} selected</p>
        </div>
    );
}

function OrderSummary({ selectedCount, subtotal, shippingFee, hasShipping, totalAmount, onCheckout }) {
    return (
        <SectionCard className="p-4 sm:p-5">
            <h2 className="mb-4 text-lg font-bold">Order summary</h2>
            <dl className="m-0 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                    <dt>Subtotal</dt>
                    <dd className="m-0 font-bold tabular-nums">{formatCurrency(subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                    <dt>Delivery</dt>
                    <dd className="m-0 text-right font-bold">
                        {hasShipping ? (shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)) : 'Set your delivery PIN code'}
                    </dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2 rounded-xl bg-[var(--orange-50)] p-3">
                    <dt className="font-bold">{hasShipping ? 'Total' : 'Subtotal before delivery'}</dt>
                    <dd className="m-0 text-base font-bold tabular-nums text-[var(--brand-hover)]">
                        {formatCurrency(hasShipping ? totalAmount : subtotal)}
                    </dd>
                </div>
            </dl>
            <button type="button" className={`${actionClass} mt-4 w-full`} disabled={selectedCount === 0} onClick={onCheckout}>
                Proceed to checkout <ArrowRight size={18} aria-hidden="true" />
            </button>
            <Link to="/products-page" className="mt-2 flex min-h-11 items-center justify-center font-bold text-[var(--brand-hover)] hover:underline">
                Continue shopping
            </Link>
        </SectionCard>
    );
}

function SkeletonCartLoading() {
    return (
        <div aria-busy="true" className="bg-[var(--orange-50)] px-3 py-5 sm:px-6 sm:py-8">
            <span className="sr-only">Loading cart</span>
            <div aria-hidden="true" className="mx-auto grid max-w-7xl gap-4 motion-safe:animate-pulse lg:grid-cols-3">
                <div className="h-24 rounded-2xl bg-orange-100 lg:col-span-3" />
                <div className="h-56 rounded-2xl bg-orange-100 lg:col-span-2" />
                <div className="h-48 rounded-2xl bg-orange-100" />
            </div>
        </div>
    );
}

function EmptyCart({ onContinueShopping, error }) {
    return (
        <div className="bg-[var(--orange-50)] px-3 py-6 sm:px-6 sm:py-10">
            <SectionCard className="mx-auto max-w-2xl px-4 py-12 text-center">
                <ShoppingBag size={30} className="mx-auto mb-3 text-[var(--brand-primary)]" aria-hidden="true" />
                <h1 className="mb-2 text-2xl font-bold">{error ? 'Cart unavailable' : 'Your cart is empty'}</h1>
                <p className="text-sm !text-stone-600">{error ? 'Please try again later.' : 'Explore the collection and add jewellery you love.'}</p>
                <button type="button" className={`${actionClass} mt-5`} onClick={onContinueShopping}>Browse jewellery</button>
            </SectionCard>
        </div>
    );
}

const DeleteConfirmationModal = ({
    open,
    onCancel,
    onConfirm,
}) => {
    if (!open) return null;

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/40
                backdrop-blur-[3px]
                p-4
            "
            onClick={onCancel}
        >
            <div
                className="
                    w-full
                    max-w-sm
                    bg-white
                    rounded-3xl
                    border
                    border-[var(--brand-border)]
                    shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                    overflow-hidden
                    animate-scale-in
                "
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {/* Header */}
                <div
                    className="
                        relative
                        overflow-hidden
                        px-5
                        py-5
                        bg-gradient-to-br
                        from-[var(--orange-50)]
                        to-white
                        border-b
                        border-[var(--brand-border)]
                    "
                >
                    <div
                        className="
                            absolute
                            -right-8
                            -top-8
                            w-24
                            h-24
                            rounded-full
                            bg-red-500/5
                            blur-2xl
                        "
                    />

                    <div className="relative flex items-start gap-3">
                        <div
                            className="
                                w-11
                                h-11
                                rounded-2xl
                                bg-red-50
                                border
                                border-red-100
                                text-red-600
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                        >
                            <Trash2 className="w-5 h-5" />
                        </div>

                        <div>
                            <h3
                                className="
                                    text-[16px]
                                    font-bold
                                    text-[var(--primary-text-color)]
                                "
                            >
                                Remove Item
                            </h3>

                            <p
                                className="
                                    text-[11px]
                                    text-stone-600
                                    mt-0.5
                                "
                            >
                                This action cannot be undone
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5">
                    <p
                        className="
                            text-[13px]
                            leading-6
                            text-stone-700
                        "
                    >
                        Are you sure you want to remove this
                        item from your cart?
                    </p>

                    <div className="flex gap-2.5 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="
                                flex-1
                                h-11
                                rounded-xl
                                bg-[var(--orange-50)]
                                border
                                border-stone-200
                                text-stone-700
                                text-[13px]
                                font-semibold
                                hover:bg-stone-100
                                transition-all
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            className="
                                flex-1
                                h-11
                                rounded-xl
                                bg-gradient-to-r
                                from-red-500
                                to-red-600
                                text-white
                                text-[13px]
                                font-semibold
                                shadow-lg
                                shadow-red-100
                                hover:shadow-red-200
                                transition-all
                            "
                        >
                            Remove Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


/* =========================================================
   CART PAGE
========================================================= */

const Cart = () => {
    const navigate = useNavigate();

    const {
        cartItems,
        isLoading,
        error,
        deleteCart,
    } = useCart();

    const [
        selectedItems,
        setSelectedItems,
    ] = useState([]);

    const [
        showDeleteModal,
        setShowDeleteModal,
    ] = useState(false);

    const [
        deleteSno,
        setDeleteSno,
    ] = useState(null);

    const mobileNumber = useSelector(
        (state) =>
            state.user.user?.contactNumber
    );

    /* =====================================================
       CART DATA
    ===================================================== */

    const cartDetails =
        cartItems?.data;

    const productsInCart =
        cartDetails?.products || [];

    /* =====================================================
       SELECTED ITEMS
    ===================================================== */

    const selectedItemsData =
        useMemo(() => {
            return productsInCart.filter(
                (item) =>
                    selectedItems.includes(
                        item.TAGKEY
                    )
            );
        }, [
            productsInCart,
            selectedItems,
        ]);

    /* =====================================================
       SELECT ITEM
    ===================================================== */

    const handleSelectItem = (tagKey) => {
        const clickedItem =
            productsInCart.find(
                (item) =>
                    String(item.TAGKEY) ===
                    String(tagKey)
            );

        if (!clickedItem) return;

        /* Normal product */
        if (clickedItem.ComboId == null) {
            setSelectedItems((prev) =>
                prev.includes(tagKey)
                    ? prev.filter(
                        (key) =>
                            key !== tagKey
                    )
                    : [
                        ...prev,
                        tagKey,
                    ]
            );

            return;
        }

        /* Combo */
        const comboId =
            clickedItem.ComboId;

        const comboItems =
            productsInCart.filter(
                (item) =>
                    item.ComboId != null &&
                    String(item.ComboId) ===
                    String(comboId)
            );

        const comboTagKeys =
            comboItems.map(
                (item) =>
                    item.TAGKEY
            );

        const isComboSelected =
            comboTagKeys.every(
                (key) =>
                    selectedItems.includes(
                        key
                    )
            );

        setSelectedItems((prev) => {
            if (isComboSelected) {
                return prev.filter(
                    (key) =>
                        !comboTagKeys.includes(
                            key
                        )
                );
            }

            return [
                ...prev.filter(
                    (key) =>
                        !comboTagKeys.includes(
                            key
                        )
                ),
                ...comboTagKeys,
            ];
        });
    };

    /* =====================================================
       SELECT ALL
    ===================================================== */

    const handleSelectAll = () => {
        if (
            selectedItemsData.length ===
            productsInCart.length
        ) {
            setSelectedItems([]);
            return;
        }

        const allTagKeys =
            productsInCart
                .map(
                    (item) =>
                        item.TAGKEY
                )
                .filter(Boolean);

        setSelectedItems(
            allTagKeys
        );
    };

    /* =====================================================
       TOTALS
    ===================================================== */

    const subtotal =
        useMemo(() => {
            return selectedItemsData.reduce(
                (sum, item) => {
                    const price =
                        Number(
                            item.FinalAmount
                        ) ||
                        Number(
                            item.GrandTotal
                        ) ||
                        0;

                    return sum + price;
                },
                0
            );
        }, [
            selectedItemsData,
        ]);

    const shippingFee = Number(cartDetails?.shipping?.totalAmount) || 0;

    const hasShipping =
        cartDetails?.shipping
            ?.totalAmount != null;

    const totalAmount =
        subtotal + shippingFee;

    /* =====================================================
       AUTO SELECT
    ===================================================== */

    useEffect(() => {
        if (
            productsInCart.length > 0 &&
            selectedItems.length === 0
        ) {
            const allTagKeys =
                productsInCart
                    .map(
                        (item) =>
                            item.TAGKEY
                    )
                    .filter(Boolean);

            setSelectedItems(
                allTagKeys
            );
        }
    }, [
        productsInCart.length,
    ]);

    /* =====================================================
       CHECKOUT
    ===================================================== */

    const handleCheckout = () => {
        if (
            selectedItemsData.length === 0
        ) {
            return;
        }

        const payload = {
            items:
                selectedItemsData.map(
                    (item) => ({
                        productId:
                            item.TAGKEY,

                        itemId:
                            item.ITEMID,

                        tagNo:
                            item.TAGNO,

                        sno:
                            item.SNO,

                        productName:
                            item.ItemName ||
                            item.SUBITEMNAME ||
                            item.ITEMNAME,

                        grossAmount:
                            parseFloat(
                                item.GrossAmount
                            ) || 0,

                        price:
                            parseFloat(
                                item.GrandTotal
                            ) || 0,

                        netWt:
                            parseFloat(
                                item.NETWT
                            ) || 0,

                        grsWt:
                            parseFloat(
                                item.GRSWT
                            ) || 0,

                        imagePath:
                            item.ImagePath
                                ? (() => {
                                    try {
                                        return (
                                            JSON.parse(
                                                item.ImagePath
                                            )[0] ||
                                            ''
                                        );
                                    } catch {
                                        return '';
                                    }
                                })()
                                : '',

                        quantity: 1,

                        gstType:
                            item.GSTType,

                        gstPer:
                            item.GSTPER,

                        gstAmount:
                            item.GSTAmount,

                        ...(item.ComboId && {
                            ComboId:
                                item.ComboId,
                        }),
                    })
                ),

            subtotal,
        };

        navigate(
            '/checkout',
            {
                state: payload,
            }
        );
    };

    /* =====================================================
       DELETE
    ===================================================== */

    const handleDeleteClick = (
        tagKey
    ) => {
        setDeleteSno(tagKey);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteSno) {
            deleteCart.mutate(
                deleteSno
            );
        }

        setShowDeleteModal(false);
        setDeleteSno(null);

        /* Remove from selection immediately */
        setSelectedItems((prev) =>
            prev.filter(
                (key) =>
                    key !== deleteSno
            )
        );
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteSno(null);
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {
        return (
            <SkeletonCartLoading />
        );
    }

    /* =====================================================
       MOBILE VALIDATION
    ===================================================== */

    if (!mobileNumber) {
        return (
            <UpdateMobileModal
                open={true}
                onClose={() =>
                    navigate('/')
                }
            />
        );
    }

    /* =====================================================
       EMPTY CART
    ===================================================== */

    if (
        productsInCart.length === 0
    ) {
        return (
            <EmptyCart
                error={error}
                onContinueShopping={() =>
                    navigate(
                        '/products-page'
                    )
                }
            />
        );
    }

    /* =====================================================
       MAIN PAGE
    ===================================================== */

    return (
        <div
            className="
                min-h-screen
                bg-[var(--orange-50)]
                px-3
                sm:px-6
                py-5
                sm:py-8
            "
        >
            <div
                className="
                    max-w-7xl
                    mx-auto
                    space-y-4
                    sm:space-y-5
                "
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <CartHeader
                    itemCount={
                        productsInCart.length
                    }
                    selectedCount={
                        selectedItemsData.length
                    }
                    onSelectAll={
                        handleSelectAll
                    }
                />

                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div
                    className="
                        grid
                        lg:grid-cols-3
                        gap-4
                        sm:gap-5
                        items-start
                    "
                >
                    {/* =================================================
                        CART ITEMS
                    ================================================= */}

                    <div className="lg:col-span-2">
                        <SectionCard className="p-3 sm:p-4">
                            <CartItemsHeader
                                selectedCount={
                                    selectedItemsData.length
                                }
                                totalCount={
                                    productsInCart.length
                                }
                            />

                            <div className="space-y-2.5">
                                {productsInCart.map(
                                    (item) => (
                                        <CartItem
                                            key={
                                                item.TAGKEY
                                            }
                                            item={
                                                item
                                            }
                                            onRemove={
                                                handleDeleteClick
                                            }
                                            onSelect={
                                                handleSelectItem
                                            }
                                            isSelected={selectedItems.includes(
                                                item.TAGKEY
                                            )}
                                            itemLength={
                                                cartDetails?.totalItems ??
                                                productsInCart.length
                                            }
                                        />
                                    )
                                )}
                            </div>

                            {/* Bottom hint */}
                            <div
                                className="
                                    mt-4
                                    pt-3
                                    border-t
                                    border-[var(--brand-border)]
                                    flex
                                    items-center
                                    gap-2
                                    text-[10px]
                                    sm:text-[11px]
                                    text-stone-600
                                "
                            >
                                <Clock3 className="w-3.5 h-3.5 text-[var(--brand-primary)]" />

                                Selected items will be included
                                in your checkout.
                            </div>
                        </SectionCard>
                    </div>

                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div className="lg:col-span-1">
                        <OrderSummary
                            selectedCount={
                                selectedItemsData.length
                            }
                            subtotal={
                                subtotal
                            }
                            shippingFee={
                                shippingFee
                            }
                            hasShipping={
                                hasShipping
                            }
                            totalAmount={
                                totalAmount
                            }
                            onCheckout={
                                handleCheckout
                            }
                        />
                    </div>
                </div>
            </div>

            {/* =================================================
                DELETE MODAL
            ================================================= */}

            <DeleteConfirmationModal
                open={
                    showDeleteModal
                }
                onCancel={
                    cancelDelete
                }
                onConfirm={
                    confirmDelete
                }
            />
        </div>
    );
};

export default Cart;
