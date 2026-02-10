'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../hook/cart/useCartQuery';
import fallbackImage from '../../../assets/videos/silverIcon.png';
import SmartButton from '../../ui/SmartButton';
import UpdateMobileModal from '../../layouts/UpdateMobileModal';
import { useSelector } from 'react-redux';

const CartItem = ({ item, onRemove, onSelect, isSelected, loading }) => {
    const [imageError, setImageError] = useState(false);
    const baseUrl = "https://app.bmgjewellers.com";

    const displayImage = imageError ? fallbackImage :
        item?.ImagePath ? `${baseUrl}${JSON.parse(item.ImagePath)[0] || ''}` : fallbackImage;

    const displayPrice = Number(item?.TotalAmount || 0);
    const displayWeight = item?.NetWt;
    const displayPurity = item?.Purity;
    const displayTagNo = item?.TagNo;
    const displayItemId = item?.ItemId;
    const displayItemTagSno = item?.ItemTagSno;
    const ItemTagSno = item?.ItemTagSno;

    return (
        <div
            onClick={() => onSelect(ItemTagSno)}
            className={`flex items-center gap-1.5 sm:gap-3 p-2 sm:p-3 mb-2 border ${isSelected ? "border-[#f16137]" : "border-gray-200"} ${isSelected ? "bg-[var(--primary-card-color)]" : "white"} rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer`}
        >
            <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="w-3 h-3 sm:w-4 sm:h-4 text-[#f16137]"
            />

            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {loading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                ) : (
                    <img
                        src={displayImage}
                        alt="Product"
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-[#041f60] truncate">
                    <Link
                        to={`/product-detail/${displayItemTagSno}`}
                        className="hover:text-[#f16137] transition block truncate"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {item.ItemName}
                    </Link>
                </h3>
                <p className="text-xs text-gray-600 mt-1 truncate">
                    SKU: {displayItemId || 'N/A'} - Tag: {displayTagNo || 'N/A'}
                </p>
                <div className="flex gap-2 sm:gap-4 text-xs text-gray-600 mt-2 flex-wrap">
                    {displayWeight && (
                        <span className="bg-gray-50 px-2 py-0.5 rounded">Weight: {displayWeight.toFixed(3)}g</span>
                    )}
                    {displayPurity && (
                        <span className="bg-gray-50 px-2 py-0.5 rounded">Purity: {displayPurity}%</span>
                    )}
                </div>
            </div>

            <div className="text-right flex-shrink-0">
                <p className="text-base font-semibold text-[#f16137] whitespace-nowrap">
                    ₹{displayPrice.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">per item</p>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(ItemTagSno);
                }}
                className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                disabled={loading}
                title="Remove item"
            >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
        </div>
    );
};

const SkeletonCartLoading = () => {
    return (
        <div className="bg-[#eeece8] py-6 px-2">
            <div className="max-w-7xl mx-auto">
                <div className='flex items-center justify-between mb-2 px-3 py-2 bg-[#fff] rounded-lg animate-pulse'>
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200 animate-pulse">
                                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-36 bg-gray-300 rounded"></div>
                                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                                    <div className="h-3 w-28 bg-gray-300 rounded"></div>
                                </div>
                                <div className="h-5 w-12 bg-gray-300 rounded"></div>
                                <div className="h-6 w-6 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>

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
    );
};

const Cart = () => {
    const navigate = useNavigate();

    const { cartItems, isLoading, deleteCart } = useCart();
    const [selectedItems, setSelectedItems] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteSno, setDeleteSno] = useState(null);
    const mobileNumber = useSelector(state => state.user.user?.contactNumber);

    // Get items from API response
    console.log(cartItems ,'cartItems');

    const cartDetails = cartItems?.data;

    const productsInCart = cartDetails?.products || []; 

    // Calculate totals directly from selected items
    const selectedItemsData = productsInCart.filter(item => selectedItems.includes(item.Sno));
    const subtotal = selectedItemsData.reduce((sum, item) => sum + (item.TotalAmount || 0), 0);
    const shippingFee = cartDetails?.shipping?.totalAmount ;
    const totalAmount = subtotal + shippingFee;

    // Auto-select all items on load
    useEffect(() => {
        if (productsInCart.length > 0 && selectedItems.length === 0) {
            const allSno = productsInCart.map(item => item.Sno).filter(Boolean);
            setSelectedItems(allSno);
        }
    }, [productsInCart.length]);

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert("Please select items");
            return;
        }

        const payload = {
            items: selectedItemsData.map(item => ({
                sno: item.Sno,
                itemId: item.ItemId,
                tagNo: item.TagNo,
                itemTagSno: item.ItemTagSno,
                amount: item.Amount,
                weight: item.NetWt,
                purity: item.Purity,
                shipping_fee: item.shipping_fee
            })),
            subtotal,
            shippingFee,
            totalAmount
        };

        navigate("/checkout", { state: payload });
    };

    const handleDeleteClick = (tagKey) => {
        setDeleteSno(tagKey);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteSno) {
            deleteCart.mutate(deleteSno);
        }
        setShowDeleteModal(false);
        setDeleteSno(null);
    };

    const cancelDelete = () => setShowDeleteModal(false);
    const handleSelectAll = () => {
        if (selectedItems.length === productsInCart.length) {
            setSelectedItems([]);
        } else {
            const allSno = productsInCart.map(item => item.Sno).filter(Boolean);
            setSelectedItems(allSno);
        }
    };

    if (isLoading) {
        return <SkeletonCartLoading />;
    }

    if (!mobileNumber) {
        return (
            <UpdateMobileModal
                open={true}
                onClose={() => navigate('/')}
            />
        );
    }

    if (productsInCart.length === 0) {
        return (
            <div className="bg-[#fff] flex items-center justify-center p-2 min-h-[60vh]">
                <div className="text-center max-w-lg p-6 animate__animated animate__fadeIn">
                    {/* Icon with heartbeat animation */}
                    <div className="animate__animated animate__heartBeat animate__infinite">
                        <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4" />
                    </div>

                    {/* Title & description */}
                    <div className="mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-[#041f60] mb-2 animate__animated animate__fadeInDown">
                            Your Cart is Empty
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base animate__animated animate__fadeIn">
                            Explore our stunning jewelry collection and add some sparkle to your cart!
                        </p>
                    </div>

                    {/* Button with bounce animation */}
                    <div className="animate__animated animate__bounce animate__infinite">
                        <SmartButton
                            variant="primary"
                            className="w-full max-w-xs mx-auto"
                            onClick={() => navigate("/products-page")}
                        >
                            Continue Shopping
                        </SmartButton>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#eeece8] min-h-screen py-6 px-2 sm:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between mb-2 px-2 py-2 bg-white rounded-xl shadow-sm'>
                    <h1 className="text-base sm:text-lg font-bold mb-2 sm:mb-0">
                        Your Shopping Cart
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">
                            {productsInCart.length} item{productsInCart.length !== 1 ? 's' : ''} in cart
                        </p>
                        <button
                            onClick={handleSelectAll}
                            className="text-sm text-[#f16137] font-medium hover:underline"
                        >
                            {selectedItems.length === productsInCart.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-2 lg:gap-4">
                    {/* Items Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">{selectedItems.length}</span> of{' '}
                                    <span className="font-semibold">{productsInCart.length}</span> items selected
                                </p>
                                {selectedItems.length > 0 && (
                                    <span className="text-xs bg-[var(--primary-hover-color)] text-white px-2 py-1 rounded-full">
                                        ₹{subtotal.toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                {productsInCart.map((item) => (
                                    <CartItem
                                        key={item.Sno}
                                        item={item}
                                        onRemove={() => handleDeleteClick(item.ItemTagSno)}
                                        onSelect={(sno) => {
                                            setSelectedItems(prev =>
                                                prev.includes(sno)
                                                    ? prev.filter(x => x !== sno)
                                                    : [...prev, sno]
                                            );
                                        }}
                                        isSelected={selectedItems.includes(item.Sno)}
                                        loading={isLoading}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 sticky top-24">
                            <h3 className="text-base font-bold text-[var(--primary-text-color)] mb-2 border-b">
                                Order Summary
                            </h3>

                            <div className="space-y-2 mb-2">
                                <div className="flex justify-between items-center">
                                    <span >Subtotal ({selectedItems.length} items)</span>
                                    <span className="font-semibold text-base">
                                        ₹{subtotal.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span >Shipping Fee</span>
                                    <span className={`font-semibold ${shippingFee === 0 ? 'text-green-600' : ''}`}>
                                        {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}
                                    </span>
                                </div>

                                <div className="border-t-2 border-dashed border-gray-300 pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold ">Total Amount</span>
                                        <span className="text-lg font-bold text-[var(--primary-hover-color)]">
                                            ₹{totalAmount.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                                </div>
                            </div>
                            <div className='flex items-center justify-center'>
                                <SmartButton
                                    onClick={handleCheckout}
                                    disabled={selectedItems.length === 0}
                                    className="  text-base font-semibold"
                                    variant="primary"
                                    children={`Proceed to Checkout (${selectedItems.length} items)`}
                                    
                                />
                                   
                           
                            </div>        
                          

                            <div className="pt-2 ">
                                <p className="text-center text-xs text-gray-600 mb-2">
                                    <span className="font-semibold text-green-600">✓ 100% Secure Payment</span>
                                </p>
                                <div className="flex justify-center items-center gap-3 text-xs text-gray-500">
                                    <span>Credit Card</span>
                                    <span>•</span>
                                    <span>UPI</span>
                                    <span>•</span>
                                    <span>Net Banking</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Remove Item</h3>
                                <p className="text-sm text-gray-600">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-6">
                            Are you sure you want to remove this item from your cart?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Delete Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;