'use client';

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, Star } from "lucide-react";
import { useFavorites, useRemoveFavorite } from "../../../hook/favorites/useFavoritesQuery";
import { useSingleProductQuery } from "../../../hook/product/useSingleProductQuery";
import { useCart } from "../../../hook/cart/useCartQuery";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SmartButton from "../../ui/SmartButton";

const WishlistItem = ({ sno, onRemove, cartItems, addToCartHandler, mobileNumber, setModalOpen }) => {
  const { data: item, isLoading } = useSingleProductQuery(sno);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const history = useNavigate();
  console.log(cartItems?.data, 'cartItems');
  console.log(item, 'cartItems');

  const isInCart = Array.isArray(cartItems?.data) && cartItems?.data?.some(i => i.itemTagSno === item?.SNO);

  const baseUrl = "https://app.bmgjewellers.com";
  const imagePath = item?.ImagePath ? JSON.parse(item.ImagePath)[0] : null;
  const imageUrl = imagePath ? `${baseUrl}${imagePath}` : "/images/placeholder.png";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // ❌ NOT logged in
    if (!isAuthenticated) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    // ❌ Logged in but no mobile (Google login case)
    if (!mobileNumber) {
      setModalOpen(true);
      return;
    }

    // ❌ Already in cart
    if (isInCart) {
      toast.info("Already in cart");
      return;
    }

    const cartItem = {
      itemSno: item.SNO,
      itemTagSno: item.SNO,
      itemId: item.ITEMID,
      tagNo: item.TAGNO,
      grsWt: item.GRSWT,
      netWt: item.NETWT,
      stnWt: item?.STNWT || 0,
      amount: item.GrandTotal || item.RATE,
      stnAmount: item?.STNAMT || 0,
      itemCtrName: item.ITEMCTRNAME || item.SUBITEMNAME,
      price: item.GrandTotal,
      image: item.ImagePath ? item.ImagePath[0] : "",
    };
    addToCartHandler(cartItem);

    toast.success("Added to cart!");

  };


  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-2xl p-6 animate-pulse">
        <div className="bg-gray-300 rounded-xl w-full h-64 mb-4" />
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-6 bg-gray-300 rounded w-1/2" />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg  transition-all duration-300">
      {/* Image */}
      <Link to={`/products-page/${sno}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={item.SUBITEMNAME}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(sno)}
        className="absolute top-1 right-1 p-2 bg-white/90  text-red-400 backdrop-blur-sm rounded-full shadow-lg  transition-all hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="w-3 h-3 " />
      </button>

      {/* Content */}
      <div className="p-2 sm:p-3">
        <div className="flex justify-between items-center text-center">
          <h3 className="text-xs sm:text-sm font-medium text-[#041f60] line-clamp-2 mb-2">
            <Link to={`/products-page/${sno}`} className="hover:text-[#f16137] transition text-xs">
              {item.SUBITEMNAME || item.ITEMCTRNAME}
            </Link>

          </h3>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs sm:text-sm font-bold text-[#f16137]">
              ₹{Number(item.GrandTotal || item.RATE || 0).toLocaleString('en-IN')}
            </p>
          </div>

        </div>

        {/* Add to Cart */}
        <div className="flex justify-center">
          <SmartButton
            onClick={handleAddToCart}
            variant="primary"
            isDisabled={isInCart}
            className="flex gap-1 items-center justify-center"
          >
            {isInCart ? "Already In Cart" : "Add to Cart"}
          </SmartButton>
        </div>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const { data: favorites, isLoading, isError } = useFavorites();
  const { cartItems, addToCartHandler } = useCart();
  const removeFavorite = useRemoveFavorite();


  const [modalOpen, setModalOpen] = useState(false);
  const [mobileCheckDone, setMobileCheckDone] = useState(false);
  const mobileNumber = useSelector(state => state.user.user?.contactNumber);
  console.log(mobileNumber, 'ContactNumber');

  const history = useNavigate();
  const items = favorites?.data || [];

  const handleRemove = (sno) => {
    if (window.confirm("Remove from wishlist?")) {
      removeFavorite.mutate(sno);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#eeece8] py-4 px-4 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header Skeleton */}
          <div className="bg-white rounded-xl px-4 py-2 mb-3 flex justify-between items-center">
            <div className="h-5 w-32 bg-gray-300 animate-pulse rounded-lg"></div>
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md"
              >
                {/* Image Skeleton */}
                <div className="aspect-square bg-gray-200 animate-pulse"></div>

                {/* Remove Btn */}
                <div className="absolute top-3 right-3 w-9 h-9 bg-white/70 backdrop-blur-sm rounded-full animate-pulse"></div>

                {/* Content */}
                <div className="p-3">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md mb-3"></div>
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded-md mb-3"></div>

                  {/* Button Skeleton */}
                  <div className="flex justify-center">
                    <div className="h-9 w-28 bg-gray-300 animate-pulse rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }


  if (isError || items.length === 0) {
    return (
      <div className="bg-[#fff] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="animate-heartbeat ">
            <Heart className="w-14 h-14 text-[#F7374F] mx-auto mb-2 " />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-[#041f60] mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-2">
            Save your favorite jewelry for later
          </p>

          <div className="flex justify-center animate-shake-infinite">
            <SmartButton
              onClick={() => navigate('products-page')}
              variant="primary"
            >
              Explore Collection
            </SmartButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#eeece8] py-4 px-4 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className=" bg-[#fff] flex justify-between items-center text-center rounded-xl px-4 py-2 mb-3">
          <h1 className="text-sm sm:text-lg font-bold text-[#041f60]">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            {items.length} {items.length === 1 ? "Item" : "Items"} Saved
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          {items.map((sno) => (
            <WishlistItem
              key={sno}
              sno={sno}
              onRemove={handleRemove}
              cartItems={cartItems}
              addToCartHandler={addToCartHandler}
              mobileNumber={mobileNumber}
              setModalOpen={setModalOpen}
              modalOpen={modalOpen}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;