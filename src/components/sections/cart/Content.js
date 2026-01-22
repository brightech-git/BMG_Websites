'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../hook/cart/useCartQuery';
import { useSingleProductQuery } from '../../../hook/product/useSingleProductQuery';
import fallbackImage from '../../../assets/videos/silverIcon.png';
import SmartButton from '../../ui/SmartButton';
 import UpdateMobileModal from '../../layouts/UpdateMobileModal';
import { useSelector } from 'react-redux';

const CartItem = ({ item, onRemove, onSelect, isSelected, onProductData }) => {
    const [imageError, setImageError] = useState(false);
    const { data: product, isLoading: loading, error: productError } = useSingleProductQuery(item.itemTagSno || item.sno);
  

    const baseUrl = "https://app.bmgjewellers.com";

    // Always send data back — even if product fails
    useEffect(() => {
        const imagePath = product?.ImagePath
            ? `${baseUrl}${JSON.parse(product.ImagePath)[0] || ''}`
            : fallbackImage;

        const price = Number(product?.GrandTotal || product?.RATE || item.amount || 0);

        onProductData(item.sno, {
            productName: product?.ITEMCTRNAME || item.ITEMCTRNAME || item.itemTagSno || "Unknown Product",
            imagePath: imageError ? fallbackImage : imagePath,
            price,
            weight: product?.NETWT || item.netWt || null,
            purity: product?.PURITY || item.purity || null,
            itemId: product?.ITEMID || item.itemId || null,
            tagNo: product?.TAGNO || item.tagNo || null,
        });
    }, [product, productError, item, onProductData, imageError]);

    const displayImage = imageError ? fallbackImage :
        product?.ImagePath ? `${baseUrl}${JSON.parse(product.ImagePath)[0] || ''}` : fallbackImage;

    const displayPrice = Number(product?.GrandTotal || product?.RATE || item.amount || 0);

    return (
        <div onClick={() => onSelect(item.sno)} className={`flex items-center gap-1.5 sm:gap-3 p-2 sm:p-3  mb-3 border ${isSelected ? "border-[#f16137]" : "border-gray-200"}  ${isSelected ? "bg-[var(--primary-card-color)]" : "white"} rounded-t-2xl hover:shadow-lg transition-all duration-300`}>
            <input
                type="checkbox"
                checked={isSelected}
           
                className="w-3 h-3 sm:w-4 sm:h-4 text-[#f16137] "
            />

            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {loading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                ) : (
                    <img
                        src={displayImage}
                        alt={product?.ITEMCTRNAME || "Product"}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="flex-1">
                <h3 className="text-xs sm:text-sm font-semibold text-[#041f60]">
                    <Link to={`/products-page/${item.itemTagSno || item.sno}`} className="hover:text-[#f16137] transition">
                        {product?.ITEMCTRNAME || item.ITEMCTRNAME || item.itemTagSno || "Loading..."}
                    </Link>
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                    SKU: {(product?.ITEMID || item.itemId || 'N/A')} - {(product?.TAGNO || item.tagNo || 'N/A')}
                </p>
                <div className="flex gap-2 sm:gap-4 text-xs text-gray-600 mt-2">
                    {(product?.NETWT || item.netWt) && <span>Weight: {(product?.NETWT || item.netWt).toFixed(3)}g</span>}
                    {(product?.PURITY || item.purity) && <span>Purity: {product?.PURITY || item.purity}%</span>}
                </div>
            </div>

            <div className="text-right">
                <p className="text-base font-semibold text-[#f16137]">
                    ₹{displayPrice.toLocaleString('en-IN')}
                </p>
            </div>

            <button
                onClick={() => onRemove(item.sno)}
                className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                disabled={loading}
            >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
        </div>
    );
};

const SkeletonCartLoading = () =>{
    return (
        <div className="bg-[#eeece8] py-6 px-2">
            <div className="max-w-7xl mx-auto">

                {/* Header skeleton */}
                <div className='flex items-center justify-between mb-2 px-3 py-2 bg-[#fff] rounded-lg animate-pulse'>
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">

                    {/* Items skeleton */}
                    <div className="lg:col-span-2 space-y-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200 animate-pulse">

                                <div className="w-4 h-4 bg-gray-300 rounded"></div>

                                {/* Image */}
                                <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>

                                {/* Info */}
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-36 bg-gray-300 rounded"></div>
                                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                                    <div className="h-3 w-28 bg-gray-300 rounded"></div>
                                </div>

                                {/* Price */}
                                <div className="h-5 w-12 bg-gray-300 rounded"></div>

                                <div className="h-6 w-6 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>

                    {/* Summary skeleton */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-3 animate-pulse">
                            <div className="h-5 w-32 bg-gray-300 rounded mb-4"></div>

                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-4 w-full bg-gray-300 rounded mb-3"></div>
                            ))}

                            <div className="h-10 w-full bg-gray-300 rounded mt-3"></div>

                            <div className="h-3 w-24 bg-gray-300 rounded mt-4"></div>
                            <div className="h-3 w-20 bg-gray-300 rounded mt-2"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        )
}
const Cart = () => {
    const history = useHistory();
    const { cartItems, isLoading, deleteCart, clearCart } = useCart();
    const [selectedItems, setSelectedItems] = useState([]);
    const [productDataMap, setProductDataMap] = useState({});

    const [modalOpen, setModalOpen] = useState(false);
    const [mobileCheckDone, setMobileCheckDone] = useState(false);
    const mobileNumber = useSelector(state => state.user.user?.contactNumber);
    console.log(mobileNumber, 'ContactNumber');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteSno, setDeleteSno] = useState(null);
    const items = useMemo(() => {
        if (!cartItems?.data) return [];
        const data = cartItems.data;
        if (data?.message?.toLowerCase().includes("empty")) return [];
        return Array.isArray(data) ? data : Object.values(data);
    }, [cartItems]);

    // Auto-select all on load
    useEffect(() => {
        if (items.length > 0 && selectedItems.length === 0) {
            setSelectedItems(items.map(i => i.sno));
        }
    }, [items]);


    useEffect(() => {
        if (!mobileNumber && !mobileCheckDone) {
            setModalOpen(true);
            setMobileCheckDone(true);
        }
    }, [mobileNumber, mobileCheckDone]);
    
    // Listen for payment success → clear cart
    useEffect(() => {
        const handlePayment = () => clearCart();
        window.addEventListener("payment-success", handlePayment);
        return () => window.removeEventListener("payment-success", handlePayment);
    }, [clearCart]);


    const isMobileMissing = !mobileNumber;


    const totals = useMemo(() => {
        const selected = items.filter(i => selectedItems.includes(i.sno));
        const subtotal = selected.reduce((sum, item) => {
            const price = productDataMap[item.sno]?.price || item.amount || 0;
            return sum + Number(price);
        }, 0);

        return {
            subtotal,
            total: subtotal,
            count: selected.length,
            ready: selected.length > 0 && selected.every(i => productDataMap[i.sno])
        };
    }, [items, selectedItems, productDataMap]);

    const handleCheckout = () => {
        if (!totals.ready) return alert("Please wait for product details to load");
        if (selectedItems.length === 0) return alert("Please select items");

        const payload = {
            items: items
                .filter(i => selectedItems.includes(i.sno))
                .map(item => ({
                    sno: item.sno,
                    itemId: productDataMap[item.sno]?.itemId || item.itemId || null,
                    tagNo: productDataMap[item.sno]?.tagNo || item.tagNo || null,
                    productName: productDataMap[item.sno]?.productName || "Product",
                    price: productDataMap[item.sno]?.price || 0,
                    imagePath: productDataMap[item.sno]?.imagePath || fallbackImage,
                    weight: productDataMap[item.sno]?.weight || null,
                    purity: productDataMap[item.sno]?.purity || null,
                })),
            totalAmount: totals.total,
        };

        history.push("/checkout", payload);
    };

    if (!modalOpen && isLoading) {
        return (
            <SkeletonCartLoading />
        );
    }
    if (isMobileMissing) {
        return (
            <UpdateMobileModal
                open={true}
                onClose={() => {
                    setModalOpen(false);
                    history.replace('/');
                }}
            />
        );
    }

    if (!isLoading && items.length === 0) {
        return (
            <div className="bg-[#fff] flex items-center justify-center p-2 ">
                <div className="  text-center max-w-lg p-3 ">
                    <ShoppingBag className="w-10 h-10 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-2 animate-slide-in-right" />
                    <div className='mb-3'>
                        <h2 className="text-sm sm:text-xl font-bold text-[#041f60] mb-1 animate-slide-in-down ">Your Cart is Empty</h2>
                    <p className="text-gray-600 text-xs sm:text-sm ">Explore our stunning jewelry collection</p>
                    </div>
                
                    <SmartButton variant='primary' className='w-full animate-wobble' onClick={()=>history.push('/products-page')}>Continue Shopping </SmartButton>

                </div>
            </div>
        );
    }


const handleDeleteCartItem = (sno) => {
    setDeleteSno(sno); 
    setShowDeleteModal(true);
};

const confirmDelete = () => {
    deleteCart(deleteSno);
    setShowDeleteModal(false);
    setDeleteSno(null);
};

const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteSno(null);
};


    return (
        <div className="bg-[#eeece8] py-6 px-2">
            <div className="max-w-7xl mx-auto">
                <div className='flex items-center justify-between mb-2 px-3 py-2 bg-[#fff] rounded-lg'>
                    <h1 className="text-sm sm:text-lg font-semibold text-center text-[#041f60] ">Your Shopping Cart</h1>
                    <p className='text-xs'> Showing {items.length} items in your cart </p>
                </div>
               
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-2">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 p-3">
                            <p className="text-sm text-gray-600 mb-2">
                                {selectedItems.length} of {items.length} items selected
                            </p>
           
                            {items.map(item => (
                           
                                <CartItem
                                    key={item.sno}
                                    item={item}
                                    onRemove={handleDeleteCartItem}
                                    onSelect={sno => setSelectedItems(prev =>
                                        prev.includes(sno) ? prev.filter(x => x !== sno) : [...prev, sno]
                                    )}
                                    isSelected={selectedItems.includes(item.sno)}
                                    onProductData={(sno, data) => setProductDataMap(prev => ({ ...prev, [sno]: data }))}
                                />
                
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md sm:shadow-lg border border-gray-200 p-3 sticky top-20">
                            <h3 className="text-sm sm:text-lg font-bold text-[#041f60] mb-2">Order Summary</h3>

                            <div className="space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between">
                                    <span>Items ({totals.count})</span>
                                    <span className="font-semibold">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm text-green-600 font-bold">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t-2 border-dashed border-gray-300 pt-3 text-xs sm:text-sm ">
                                    <div className="flex justify-between text-sm font-bold text-[#f16137]">
                                        <span>Total</span>
                                        <span>₹{totals.total.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full justify-center mt-2'>
                                <SmartButton
                                    onClick={handleCheckout}
                                    disabled={!totals.ready || selectedItems.length === 0 || !mobileNumber}
                                    className='w-full'
                                >
                                    {!mobileNumber
                                        ? "Add Mobile Number"
                                        : totals.ready
                                            ? "Checkout"
                                            : "Loading..."}
                                </SmartButton>

                            </div>
                            <div className="mt-2 text-center text-xs text-gray-600">
                                <p className="font-small text-xs">100% Secure Payment</p>
                                <p className="mt-2 text-xs">Credit Card • UPI • Net Banking</p>
                            </div>
                        </div>
                   {showDeleteModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
    <div className="bg-white rounded-2xl p-4 w-[90%] max-w-sm shadow-xl animate-scale-in">

      <h3 className="text-sm font-semibold text-[#041f60] mb-2">
        Remove Item
      </h3>

      <p className="text-xs text-gray-600 mb-4">
        Are you sure you want to remove this item from your cart?
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={cancelDelete}
          className="px-4 py-1.5 text-xs rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="px-4 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>

    </div>
  </div>
)}
 </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;