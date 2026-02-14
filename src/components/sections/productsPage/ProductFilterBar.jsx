import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ChevronDown, RotateCcw, Filter, ChevronUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { resetFilters } from "../../../redux/slices/filterSlice";
import debounce from "lodash/debounce";
import { useGetFilters } from "../../../hook/product/useFilterProducts";

/* ================= CONSTANTS ================= */

const SORT_OPTIONS = [
  { label: "Price – Low to High", value: "priceLowToHigh" },
  { label: "Price – High to Low", value: "priceHighToLow" },
];

const PRICE_BRACKETS = [
  { min: 1, max: 3999, label: "Below - ₹3999" },
  { min: 4000, max: 4999, label: "₹4000 - ₹4999" },
  { min: 5000, max: 5999, label: "₹5000 - ₹5999" },
  { min: 6000, max: 100000, label: "₹6000 - Above" },
];

const WEIGHT_BRACKETS = [
  { min: 0, max: 10, label: "Below - 10 grams" },
  { min: 10, max: 20, label: "10 - 20 grams" },
  { min: 20, max: 30, label: "20 - 30 grams" },
  { min: 30, max: 50, label: "30 - 50 grams" },
  { min: 50, max: 1000, label: "50 - Above" },
];

const PRICE_RANGE = { min: 0, max: 100000, step: 100 };
const WEIGHT_RANGE = { min: 0, max: 1000, step: 1 };

const GENDER_OPTIONS = [
  { label: "Men", value: "Mens" },
  { label: "Women", value: "Ladies" },
];

// Hardcoded Metal Finish options (from your data)
const METAL_FINISH_OPTIONS = [
  { id: 63, sizeId: "GP", sizeName: "GOLD POLISH", itemName: "METAL" },
  { id: 64, sizeId: "RG", sizeName: "ROSE GOLD", itemName: "METAL" },
  { id: 65, sizeId: "DT", sizeName: "DUAL TONE", itemName: "METAL" },
  { id: 66, sizeId: "AQ", sizeName: "ANTIQUE", itemName: "METAL" },
  { id: 67, sizeId: "GL", sizeName: "GLOSSY", itemName: "METAL" },
  { id: 68, sizeId: "OX", sizeName: "OXIDISED", itemName: "METAL" },
];

/* ================= COMPONENT ================= */

export default function ProductFilterBar({
  onFiltersChange,
  totalResults = 0,
  itemCtrName // Pass this from parent component (product category)
}) {
  console.log(itemCtrName, 'itemCtrName from filter');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeMobileFilter, setActiveMobileFilter] = useState("price");
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);

  const dropdownContainerRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Fetch dynamic filters based on itemCtrName
  const { data: filterData, isLoading: filtersLoading } = useGetFilters(itemCtrName);

  /* ---------- Parse dynamic filters from API ---------- */
  const [sizeNameFilters, setSizeFilters] = useState([]);
  const [subItemNameFilters, setSubCategoryFilters] = useState([]);

  useEffect(() => {
    if (filterData) {
      // Extract sizeNames from the response
      if (filterData.sizes) {
        setSizeFilters(filterData.sizes);
      }

      // Extract subItems as subcategories
      if (filterData.subItems) {
        setSubCategoryFilters(filterData.subItems.map((item, index) => ({
          id: index,
          name: item,
          value: item
        })));
      }
    }
  }, [filterData]);

  /* ---------- Get URL Params ---------- */
  const getURLParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      sortBy: params.get("sortBy"),
      priceRange: params.get("priceRange") || null,
      weightRange: params.get("weightRange") || null,
      gender: params.get("gender") || null,
      sizeName: params.get("sizeName") || null,
      subItemName: params.get("subItemName") || null,
      metalType: params.get("metalType") || null, // Add metal finish
    };
  };

  const [selectedFilters, setSelectedFilters] = useState(getURLParams());

  /* ---------- Size Filter ---------- */
  const getInitialSize = () => {
    return new URLSearchParams(location.search).get("sizeName") || null;
  };

  const [selectedSize, setSelectedSize] = useState(getInitialSize);

  /* ---------- Sub Category Filter ---------- */
  const getInitialSubCategory = () => {
    return new URLSearchParams(location.search).get("subItemName") || null;
  };

  const [selectedSubCategory, setSelectedSubCategory] = useState(getInitialSubCategory);

  /* ---------- Metal Finish Filter ---------- */
  const getInitialMetalFinish = () => {
    return new URLSearchParams(location.search).get("metalType") || null;
  };

  const [selectedMetalFinish, setSelectedMetalFinish] = useState(getInitialMetalFinish);

  /* ---------- Price Range ---------- */
  const getInitialPriceRange = () => {
    const p = new URLSearchParams(location.search).get("priceRange");
    if (!p) return [PRICE_RANGE.min, PRICE_RANGE.max];
    const [min, max] = p.split("-").map(Number);
    return isNaN(min) || isNaN(max)
      ? [PRICE_RANGE.min, PRICE_RANGE.max]
      : [min, max];
  };

  const [priceRange, setPriceRange] = useState(getInitialPriceRange);

  /* ---------- Weight Range ---------- */
  const getInitialWeightRange = () => {
    const w = new URLSearchParams(location.search).get("weightRange");
    if (!w) return [WEIGHT_RANGE.min, WEIGHT_RANGE.max];
    const [min, max] = w.split("-").map(Number);
    return isNaN(min) || isNaN(max)
      ? [WEIGHT_RANGE.min, WEIGHT_RANGE.max]
      : [min, max];
  };

  const [weightRange, setWeightRange] = useState(getInitialWeightRange);

  /* ---------- Gender ---------- */
  const getInitialGender = () => {
    return new URLSearchParams(location.search).get("gender") || null;
  };

  const [selectedGender, setSelectedGender] = useState(getInitialGender);

  /* ---------- Responsive ---------- */
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- Outside click ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (isDraggingRef.current) return;
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- Sync with URL ---------- */
  useEffect(() => {
    const urlFilters = getURLParams();
    setSelectedFilters((prev) => ({ ...prev, ...urlFilters }));

    // Update priceRange if URL has something different
    const [priceMin, priceMax] = getInitialPriceRange();
    if (priceMin !== priceRange[0] || priceMax !== priceRange[1]) {
      setPriceRange([priceMin, priceMax]);
    }

    // Update weightRange if URL has something different
    const [weightMin, weightMax] = getInitialWeightRange();
    if (weightMin !== weightRange[0] || weightMax !== weightRange[1]) {
      setWeightRange([weightMin, weightMax]);
    }

    // Update gender
    const gender = getInitialGender();
    if (gender !== selectedGender) {
      setSelectedGender(gender);
    }

    // Update sizeName
    const sizeName = getInitialSize();
    if (sizeName !== selectedSize) {
      setSelectedSize(sizeName);
    }

    // Update subItemName
    const subItemName = getInitialSubCategory();
    if (subItemName !== selectedSubCategory) {
      setSelectedSubCategory(subItemName);
    }

    // Update metalType
    const metalType = getInitialMetalFinish();
    if (metalType !== selectedMetalFinish) {
      setSelectedMetalFinish(metalType);
    }
  }, [location.search]);

  /* ================= URL UPDATE ================= */

  const updateURL = useCallback(
    (newFilters) => {
      // Start from current URL params
      const params = new URLSearchParams(location.search);

      // Update/overwrite the changed filters
      if (newFilters.priceRange !== undefined) {
        if (newFilters.priceRange) params.set("priceRange", newFilters.priceRange);
        else params.delete("priceRange");
      }

      if (newFilters.weightRange !== undefined) {
        if (newFilters.weightRange) params.set("weightRange", newFilters.weightRange);
        else params.delete("weightRange");
      }

      if (newFilters.gender !== undefined) {
        if (newFilters.gender) params.set("gender", newFilters.gender);
        else params.delete("gender");
      }

      if (newFilters.sizeName !== undefined) {
        if (newFilters.sizeName) params.set("sizeName", newFilters.sizeName);
        else params.delete("sizeName");
      }

      if (newFilters.subItemName !== undefined) {
        if (newFilters.subItemName) params.set("subItemName", newFilters.subItemName);
        else params.delete("subItemName");
      }

      if (newFilters.metalType !== undefined) {
        if (newFilters.metalType) params.set("metalType", newFilters.metalType);
        else params.delete("metalType");
      }

      if (newFilters.sortBy !== undefined) {
        if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);
        else params.delete("sortBy");
      }

      // Always remove pagination
      params.delete("page");

      navigate({ search: params.toString() });
      onFiltersChange?.(Object.fromEntries(params));
    },
    [navigate, onFiltersChange, location.search]
  );

  const applyPriceToURL = useCallback(
    debounce((min, max) => {
      const isDefault = min === PRICE_RANGE.min && max === PRICE_RANGE.max;
      const newFilters = {
        ...selectedFilters,
        priceRange: isDefault ? null : `${min}-${max}`,
      };
      updateURL(newFilters);
    }, 400),
    [selectedFilters, updateURL]
  );

  const applyWeightToURL = useCallback(
    debounce((min, max) => {
      const isDefault = min === WEIGHT_RANGE.min && max === WEIGHT_RANGE.max;
      const newFilters = {
        ...selectedFilters,
        weightRange: isDefault ? null : `${min}-${max}`,
      };
      updateURL(newFilters);
    }, 400),
    [selectedFilters, updateURL]
  );

  /* ================= HANDLERS ================= */

  const selectPriceBracket = (min, max, keepOpen = false) => {
    const isDefault = min === PRICE_RANGE.min && max === PRICE_RANGE.max;

    // Update local price range
    setPriceRange([min, max]);

    // Update selectedFilters immediately
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: isDefault ? null : `${min}-${max}`,
    }));

    // Update URL (debounced)
    applyPriceToURL(min, max);

    if (!keepOpen && isDesktop) setOpenDropdown(null);
  };

  const selectWeightBracket = (min, max, keepOpen = false) => {
    const isDefault = min === WEIGHT_RANGE.min && max === WEIGHT_RANGE.max;

    // Update local weight range
    setWeightRange([min, max]);

    // Update selectedFilters immediately
    setSelectedFilters((prev) => ({
      ...prev,
      weightRange: isDefault ? null : `${min}-${max}`,
    }));

    // Update URL (debounced)
    applyWeightToURL(min, max);

    if (!keepOpen && isDesktop) setOpenDropdown(null);
  };

  const handleGenderChange = (value) => {
    const newFilters = { ...selectedFilters, gender: value };
    setSelectedGender(value);
    setSelectedFilters(newFilters);
    updateURL(newFilters);
    setOpenDropdown(null);
  };

  const handleSizeChange = (sizeNameValue) => {
    const newFilters = { ...selectedFilters, sizeName: sizeNameValue };
    setSelectedSize(sizeNameValue);
    setSelectedFilters(newFilters);
    updateURL(newFilters);
    setOpenDropdown(null);
  };

  const handleSubCategoryChange = (subItemNameValue) => {
    const newFilters = { ...selectedFilters, subItemName: subItemNameValue };
    setSelectedSubCategory(subItemNameValue);
    setSelectedFilters(newFilters);
    updateURL(newFilters);
    setOpenDropdown(null);
  };

  const handleMetalFinishChange = (metalTypeValue) => {
    const newFilters = { ...selectedFilters, metalType: metalTypeValue };
    setSelectedMetalFinish(metalTypeValue);
    setSelectedFilters(newFilters);
    updateURL(newFilters);
    setOpenDropdown(null);
  };

  const handleSortChange = (value) => {
    const newFilters = { ...selectedFilters, sortBy: value };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
    setOpenDropdown(null);
  };

  const clearAll = () => {
    // First, clear URL parameters
    const params = new URLSearchParams(window.location.search);
    // Remove all filter parameters
    ["sortBy", "priceRange", "weightRange", "gender", "sizeName", "subItemName", "metalType"].forEach(p => params.delete(p));

    // Update URL first (this will trigger re-render and useEffect sync)
    navigate({ search: params.toString() });

    // Then reset all local states
    setSelectedGender(null);
    setSelectedSize(null);
    setSelectedSubCategory(null);
    setSelectedMetalFinish(null);

    // Reset range states
    setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
    setWeightRange([WEIGHT_RANGE.min, WEIGHT_RANGE.max]);

    // Close panels
    setOpenDropdown(null);
    setIsFilterPanelOpen(false);
    setIsSortPanelOpen(false);

    // Dispatch Redux reset
    dispatch(resetFilters());

    // Call parent callback
    onFiltersChange?.({});

    // Note: Don't set setSelectedFilters here as it will be synced from URL in useEffect
  };
  const getActiveFilterCount = () => {
    let count = 0;
    if (
      priceRange[0] !== PRICE_RANGE.min ||
      priceRange[1] !== PRICE_RANGE.max
    ) {
      count += 1;
    }
    if (
      weightRange[0] !== WEIGHT_RANGE.min ||
      weightRange[1] !== WEIGHT_RANGE.max
    ) {
      count += 1;
    }
    if (selectedGender) {
      count += 1;
    }
    if (selectedSize) {
      count += 1;
    }
    if (selectedSubCategory) {
      count += 1;
    }
    if (selectedMetalFinish) {
      count += 1;
    }
    return count;
  };

  const getActivePriceBracket = () => {
    const active = PRICE_BRACKETS.find(
      (bracket) =>
        priceRange[0] === bracket.min && priceRange[1] === bracket.max
    );
    return active;
  };

  const getActiveWeightBracket = () => {
    const active = WEIGHT_BRACKETS.find(
      (bracket) =>
        weightRange[0] === bracket.min && weightRange[1] === bracket.max
    );
    return active;
  };

  const removePriceFilter = () => {
    setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
    const newFilters = { ...selectedFilters, priceRange: null };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
  };

  const removeWeightFilter = () => {
    setWeightRange([WEIGHT_RANGE.min, WEIGHT_RANGE.max]);
    const newFilters = { ...selectedFilters, weightRange: null };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
  };

  const removeGenderFilter = () => {
    setSelectedGender(null);
    const newFilters = { ...selectedFilters, gender: null };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
  };

  const removeSizeFilter = () => {
    setSelectedSize(null);
    const newFilters = { ...selectedFilters, sizeName: null };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
  };

  const removeSubCategoryFilter = () => {
    setSelectedSubCategory(null);
    const newFilters = { ...selectedFilters, subItemName: null };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
  };

  const removeMetalFinishFilter = () => {
    setSelectedMetalFinish(null);
    const newFilters = { ...selectedFilters, metalType: null };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
  };

  const removeSortFilter = () => {
    const newFilters = { ...selectedFilters, sortBy: "" };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
  };

  /* ================= PRICE SLIDER ================= */

  const PriceSlider = () => {
    const sliderRef = useRef(null);
    const [local, setLocal] = useState(priceRange);
    const [drag, setDrag] = useState(null);

    useEffect(() => setLocal(priceRange), [priceRange]);

    const pct = (v) =>
      ((v - PRICE_RANGE.min) / (PRICE_RANGE.max - PRICE_RANGE.min)) * 100;

    const move = (e) => {
      if (drag === null) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.touches?.[0]?.clientX ?? e.clientX;
      let v =
        PRICE_RANGE.min +
        ((x - rect.left) / rect.width) * (PRICE_RANGE.max - PRICE_RANGE.min);

      v = Math.round(v / PRICE_RANGE.step) * PRICE_RANGE.step;
      v = Math.max(PRICE_RANGE.min, Math.min(v, PRICE_RANGE.max));

      const next = [...local];
      if (drag === 0 && v < next[1]) next[0] = v;
      if (drag === 1 && v > next[0]) next[1] = v;
      setLocal(next);
    };

    const end = () => {
      if (drag !== null) {
        isDraggingRef.current = false;
        setPriceRange(local);
        applyPriceToURL(local[0], local[1]);
      }
      setDrag(null);
    };

    useEffect(() => {
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", end);
      document.addEventListener("touchmove", move, { passive: false });
      document.addEventListener("touchend", end);
      return () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", end);
        document.removeEventListener("touchmove", move);
        document.removeEventListener("touchend", end);
      };
    });

    return (
      <div className="w-full px-2">
        <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded">
          <div
            className="absolute h-full bg-[var(--primary-hover-color)] rounded"
            style={{
              left: `${pct(local[0])}%`,
              width: `${pct(local[1]) - pct(local[0])}%`,
            }}
          />
          {[0, 1].map((i) => (
            <div
              key={i}
              onMouseDown={() => {
                isDraggingRef.current = true;
                setDrag(i);
              }}
              onTouchStart={() => {
                isDraggingRef.current = true;
                setDrag(i);
              }}
              className="absolute w-5 h-5 bg-white border-2 border-bg-[var(--primary-hover-color)] rounded-full -top-1.5 cursor-grab active:cursor-grabbing"
              style={{ left: `${pct(local[i])}%`, marginLeft: "-10px" }}
            />
          ))}
        </div>

        <div className="flex justify-between text-sm mt-2 text-gray-600">
          <span>₹{local[0].toLocaleString()}</span>
          <span>₹{local[1].toLocaleString()}</span>
        </div>
      </div>
    );
  };

  /* ================= WEIGHT SLIDER ================= */

  const WeightSlider = () => {
    const sliderRef = useRef(null);
    const [local, setLocal] = useState(weightRange);
    const [drag, setDrag] = useState(null);

    useEffect(() => setLocal(weightRange), [weightRange]);

    const pct = (v) =>
      ((v - WEIGHT_RANGE.min) / (WEIGHT_RANGE.max - WEIGHT_RANGE.min)) * 100;

    const move = (e) => {
      if (drag === null) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.touches?.[0]?.clientX ?? e.clientX;
      let v =
        WEIGHT_RANGE.min +
        ((x - rect.left) / rect.width) * (WEIGHT_RANGE.max - WEIGHT_RANGE.min);

      v = Math.round(v / WEIGHT_RANGE.step) * WEIGHT_RANGE.step;
      v = Math.max(WEIGHT_RANGE.min, Math.min(v, WEIGHT_RANGE.max));

      const next = [...local];
      if (drag === 0 && v < next[1]) next[0] = v;
      if (drag === 1 && v > next[0]) next[1] = v;
      setLocal(next);
    };

    const end = () => {
      if (drag !== null) {
        isDraggingRef.current = false;
        setWeightRange(local);
        applyWeightToURL(local[0], local[1]);
      }
      setDrag(null);
    };

    useEffect(() => {
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", end);
      document.addEventListener("touchmove", move, { passive: false });
      document.addEventListener("touchend", end);
      return () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", end);
        document.removeEventListener("touchmove", move);
        document.removeEventListener("touchend", end);
      };
    });

    return (
      <div className="w-full px-2">
        <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded">
          <div
            className="absolute h-full bg-[var(--primary-hover-color)] rounded"
            style={{
              left: `${pct(local[0])}%`,
              width: `${pct(local[1]) - pct(local[0])}%`,
            }}
          />
          {[0, 1].map((i) => (
            <div
              key={i}
              onMouseDown={() => {
                isDraggingRef.current = true;
                setDrag(i);
              }}
              onTouchStart={() => {
                isDraggingRef.current = true;
                setDrag(i);
              }}
              className="absolute w-5 h-5 bg-white border-2 border-bg-[var(--primary-hover-color)] rounded-full -top-1.5 cursor-grab active:cursor-grabbing"
              style={{ left: `${pct(local[i])}%`, marginLeft: "-10px" }}
            />
          ))}
        </div>

        <div className="flex justify-between text-sm mt-2 text-gray-600">
          <span>{local[0]}g</span>
          <span>{local[1]}g</span>
        </div>
      </div>
    );
  };

  /* ================= DESKTOP UI ================= */

  const DesktopFilterBar = () => (
    <>
      <div
        ref={dropdownContainerRef}
        className="bg-[var(--primary-card-color)] border-b border-gray-200 px-4 py-1.5"
      >
        <div className="flex items-center gap-4 flex-wrap">
          {/* Price */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "price" ? null : "price")
              }
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--primary-text-color)] hover:text-[var(--primary-hover-color)] transition-colors"
            >
              Price
              <ChevronDown
                size={16}
                className={`transition-transform ${openDropdown === "price" ? "rotate-180" : ""
                  }`}
              />
            </button>

            {openDropdown === "price" && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-white shadow-lg border border-gray-200 rounded-md w-80 p-4 animate__animated animate__fadeIn">
                <PriceSlider />

                <div className="mt-4 space-y-1">
                  {PRICE_BRACKETS.map((bracket) => (
                    <button
                      key={bracket.label}
                      onClick={() => selectPriceBracket(bracket.min, bracket.max)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${priceRange[0] === bracket.min &&
                        priceRange[1] === bracket.max
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      {bracket.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Weight */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "weight" ? null : "weight")
              }
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--primary-text-color)] hover:text-[var(--primary-hover-color)] transition-colors"
            >
              Weight
              <ChevronDown
                size={16}
                className={`transition-transform ${openDropdown === "weight" ? "rotate-180" : ""
                  }`}
              />
            </button>

            {openDropdown === "weight" && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-white shadow-lg border border-gray-200 rounded-md w-80 p-4 animate__animated animate__fadeIn">
                <WeightSlider />

                <div className="mt-4 space-y-1">
                  {WEIGHT_BRACKETS.map((bracket) => (
                    <button
                      key={bracket.label}
                      onClick={() => selectWeightBracket(bracket.min, bracket.max)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${weightRange[0] === bracket.min &&
                        weightRange[1] === bracket.max
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      {bracket.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "gender" ? null : "gender")
              }
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--primary-text-color)] hover:text-[var(--primary-hover-color)] transition-colors"
            >
              Gender
              <ChevronDown
                size={16}
                className={`transition-transform ${openDropdown === "gender" ? "rotate-180" : ""
                  }`}
              />
            </button>

            {openDropdown === "gender" && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-white shadow-lg border border-gray-200 rounded-md w-56 animate__animated animate__fadeIn">
                <div className="p-1">
                  {GENDER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleGenderChange(option.value)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedGender === option.value
                        ? "bg-amber-50 text-amber-700"
                        : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metal Finish - Hardcoded */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "metalType" ? null : "metalType")
              }
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--primary-text-color)] hover:text-[var(--primary-hover-color)] transition-colors"
            >
              Metal Finish
              <ChevronDown
                size={16}
                className={`transition-transform ${openDropdown === "metalType" ? "rotate-180" : ""
                  }`}
              />
            </button>

            {openDropdown === "metalType" && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-white shadow-lg border border-gray-200 rounded-md w-56 max-h-80 overflow-y-auto animate__animated animate__fadeIn">
                <div className="p-1">
                  {METAL_FINISH_OPTIONS.map((finish) => (
                    <button
                      key={finish.id}
                      onClick={() => handleMetalFinishChange(finish.sizeName)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedMetalFinish === finish.sizeName
                        ? "bg-amber-50 text-amber-700"
                        : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      {finish.sizeName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Size Filter - Dynamic from API */}
          {sizeNameFilters.length > 0 && (
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "sizeName" ? null : "sizeName")
                }
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--primary-text-color)] hover:text-[var(--primary-hover-color)] transition-colors"
              >
                Size
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openDropdown === "sizeName" ? "rotate-180" : ""
                    }`}
                />
              </button>

              {openDropdown === "sizeName" && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white shadow-lg border border-gray-200 rounded-md w-56 max-h-80 overflow-y-auto animate__animated animate__fadeIn">
                  <div className="p-1">
                    {sizeNameFilters.map((sizeName) => (
                      <button
                        key={sizeName.id}
                        onClick={() => handleSizeChange(sizeName.sizeName)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedSize === sizeName.sizeName
                          ? "bg-amber-50 text-amber-700"
                          : "hover:bg-gray-50 text-gray-700"
                          }`}
                      >
                        Size {sizeName.sizeName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub Category Filter - Dynamic from API */}
          {subItemNameFilters.length > 0 && (
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "subItemName" ? null : "subItemName")
                }
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--primary-text-color)] hover:text-[var(--primary-hover-color)] transition-colors"
              >
                Category
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openDropdown === "subItemName" ? "rotate-180" : ""
                    }`}
                />
              </button>

              {openDropdown === "subItemName" && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white shadow-lg border border-gray-200 rounded-md w-64 max-h-80 overflow-y-auto animate__animated animate__fadeIn">
                  <div className="p-1">
                    {subItemNameFilters.map((subCat) => (
                      <button
                        key={subCat.id}
                        onClick={() => handleSubCategoryChange(subCat.value)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedSubCategory === subCat.value
                          ? "bg-amber-50 text-amber-700"
                          : "hover:bg-gray-50 text-gray-700"
                          }`}
                      >
                        {subCat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sort By */}
          <div className="relative ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "sort" ? null : "sort")
              }
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-amber-700 rounded-lg transition-colors"
            >
              {SORT_OPTIONS.find((opt) => opt.value === selectedFilters.sortBy)
                ?.label || "Featured"}
              <ChevronDown
                size={16}
                className={`transition-transform ${openDropdown === "sort" ? "rotate-180" : ""
                  }`}
              />
            </button>

            {openDropdown === "sort" && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-white shadow-lg border border-gray-200 rounded-md w-56 animate__animated animate__fadeIn">
                <div className="p-1">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedFilters.sortBy === option.value
                        ? "bg-amber-50 text-amber-700"
                        : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Row - Below main filters */}
      {(getActiveFilterCount() > 0 || selectedFilters.sortBy) && (
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Price Filter Chip */}
            {priceRange[0] !== PRICE_RANGE.min || priceRange[1] !== PRICE_RANGE.max ? (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm">
                <span>
                  Price: {getActivePriceBracket()?.label || `₹${priceRange[0].toLocaleString()} - ₹${priceRange[1].toLocaleString()}`}
                </span>
                <button
                  onClick={removePriceFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : null}

            {/* Weight Filter Chip */}
            {weightRange[0] !== WEIGHT_RANGE.min || weightRange[1] !== WEIGHT_RANGE.max ? (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm">
                <span>
                  Weight: {getActiveWeightBracket()?.label || `${weightRange[0]}g - ${weightRange[1]}g`}
                </span>
                <button
                  onClick={removeWeightFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : null}

            {/* Gender Filter Chip */}
            {selectedGender && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm">
                <span>
                  Gender: {GENDER_OPTIONS.find(opt => opt.value === selectedGender)?.label}
                </span>
                <button
                  onClick={removeGenderFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Metal Finish Filter Chip */}
            {selectedMetalFinish && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm">
                <span>
                  Finish: {selectedMetalFinish}
                </span>
                <button
                  onClick={removeMetalFinishFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Size Filter Chip */}
            {selectedSize && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm">
                <span>
                  Size: {selectedSize}
                </span>
                <button
                  onClick={removeSizeFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Sub Category Filter Chip */}
            {selectedSubCategory && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm">
                <span>
                  Category: {selectedSubCategory}
                </span>
                <button
                  onClick={removeSubCategoryFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Sort Filter Chip */}
            {selectedFilters.sortBy && (
              <div className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm">
                <span>
                  Sort: {SORT_OPTIONS.find((opt) => opt.value === selectedFilters.sortBy)?.label}
                </span>
                <button
                  onClick={removeSortFilter}
                  className="text-gray-600 hover:text-gray-800 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Clear All */}
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm"
            >
              <RotateCcw size={14} />
              Clear All
            </button>
          )}
        </div>
      )}
    </>
  );

  /* ===== MOBILE FILTER BAR WITH SORT OVERLAY ===== */

  const MobileFilterBar = () => (
    <>
      {/* Bottom Fixed Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[var(--primary-card-color)] border-t border-gray-200 z-20 flex justify-around items-center p-2">
        {/* Filter Button */}
        <button
          onClick={() => setIsFilterPanelOpen(true)}
          className="flex items-center gap-2 border border-[var(--primary-hover-color)] bg-[var(--primary-hover-color)] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <Filter size={16} />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {getActiveFilterCount()}
            </span>
          )}
        </button>

        {/* Sort Button */}
        <button
          onClick={() => setIsSortPanelOpen(true)}
          className="flex items-center gap-2 border border-gray-300 bg-[var(--primary-hover-color)] px-4 py-2 rounded-full text-sm font-medium text-white transition-colors"
        >
          Sort:{" "}
          {SORT_OPTIONS.find((opt) => opt.value === selectedFilters.sortBy)?.label || "Featured"}
          <ChevronUp size={16} />
        </button>
      </div>

      {/* FILTER OVERLAY */}
      {isFilterPanelOpen && (
        <div className="fixed inset-0 bg-white z-[2000] flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-[var(--primary-card-color)] to-[var(--primary-color)] flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-900">Filter</h3>
            <button
              onClick={() => setIsFilterPanelOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-2/5 border-r border-gray-200 overflow-y-auto bg-[var(--primary-card-color)]">
              <button
                onClick={() => setActiveMobileFilter("price")}
                className={`w-full text-left px-4 py-3 border-b border-gray-200 text-sm ${activeMobileFilter === "price" ? "bg-gray-50 text-amber-600 font-medium" : "text-gray-700"
                  }`}
              >
                Price
              </button>
              <button
                onClick={() => setActiveMobileFilter("weight")}
                className={`w-full text-left px-4 py-3 border-b border-gray-200 text-sm ${activeMobileFilter === "weight" ? "bg-gray-50 text-amber-600 font-medium" : "text-gray-700"
                  }`}
              >
                Weight
              </button>
              <button
                onClick={() => setActiveMobileFilter("gender")}
                className={`w-full text-left px-4 py-3 border-b border-gray-200 text-sm ${activeMobileFilter === "gender" ? "bg-gray-50 text-amber-600 font-medium" : "text-gray-700"
                  }`}
              >
                Gender
              </button>
              <button
                onClick={() => setActiveMobileFilter("metalType")}
                className={`w-full text-left px-4 py-3 border-b border-gray-200 text-sm ${activeMobileFilter === "metalType" ? "bg-gray-50 text-amber-600 font-medium" : "text-gray-700"
                  }`}
              >
                Metal Finish
              </button>
              {sizeNameFilters.length > 0 && (
                <button
                  onClick={() => setActiveMobileFilter("sizeName")}
                  className={`w-full text-left px-4 py-3 border-b border-gray-200 text-sm ${activeMobileFilter === "sizeName" ? "bg-gray-50 text-amber-600 font-medium" : "text-gray-700"
                    }`}
                >
                  Size
                </button>
              )}
              {subItemNameFilters.length > 0 && (
                <button
                  onClick={() => setActiveMobileFilter("subItemName")}
                  className={`w-full text-left px-4 py-3 border-b border-gray-200 text-sm ${activeMobileFilter === "subItemName" ? "bg-gray-50 text-amber-600 font-medium" : "text-gray-700"
                    }`}
                >
                  Category
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeMobileFilter === "price" && (
                <>
                  <PriceSlider />
                  <div className="mt-4 space-y-2">
                    {PRICE_BRACKETS.map((bracket) => (
                      <label key={bracket.label} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={priceRange[0] === bracket.min && priceRange[1] === bracket.max}
                          onChange={() => selectPriceBracket(bracket.min, bracket.max, true)}
                          className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">{bracket.label}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {activeMobileFilter === "weight" && (
                <>
                  <WeightSlider />
                  <div className="mt-4 space-y-2">
                    {WEIGHT_BRACKETS.map((bracket) => (
                      <label key={bracket.label} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={weightRange[0] === bracket.min && weightRange[1] === bracket.max}
                          onChange={() => selectWeightBracket(bracket.min, bracket.max, true)}
                          className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">{bracket.label}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {activeMobileFilter === "gender" && (
                <div className="space-y-2">
                  {GENDER_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={selectedGender === option.value}
                        onChange={() => handleGenderChange(option.value)}
                        className="w-4 h-4 text-amber-500 border-gray-300 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {activeMobileFilter === "metalType" && (
                <div className="space-y-2">
                  {METAL_FINISH_OPTIONS.map((finish) => (
                    <label key={finish.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="metalType"
                        value={finish.sizeName}
                        checked={selectedMetalFinish === finish.sizeName}
                        onChange={() => handleMetalFinishChange(finish.sizeName)}
                        className="w-4 h-4 text-amber-500 border-gray-300 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">{finish.sizeName}</span>
                    </label>
                  ))}
                </div>
              )}

              {activeMobileFilter === "sizeName" && sizeNameFilters.length > 0 && (
                <div className="space-y-2">
                  {sizeNameFilters.map((sizeName) => (
                    <label key={sizeName.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sizeName"
                        value={sizeName.sizeName}
                        checked={selectedSize === sizeName.sizeName}
                        onChange={() => handleSizeChange(sizeName.sizeName)}
                        className="w-4 h-4 text-amber-500 border-gray-300 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">Size {sizeName.sizeName}</span>
                    </label>
                  ))}
                </div>
              )}

              {activeMobileFilter === "subItemName" && subItemNameFilters.length > 0 && (
                <div className="space-y-2">
                  {subItemNameFilters.map((subCat) => (
                    <label key={subCat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subItemName"
                        value={subCat.value}
                        checked={selectedSubCategory === subCat.value}
                        onChange={() => handleSubCategoryChange(subCat.value)}
                        className="w-4 h-4 text-amber-500 border-gray-300 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">{subCat.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 flex gap-3">
            <button
              onClick={clearAll}
              className="flex-1 border bg-red-400 border-red-300 text-white text-xs py-3 rounded-md font-medium hover:bg-red-500 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* SORT OVERLAY */}
      {isSortPanelOpen && (
        <div className="fixed inset-0 bg-white z-[2000] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Sort By</h3>
            <button
              onClick={() => setIsSortPanelOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-4 py-3 rounded-md text-sm transition-colors ${selectedFilters.sortBy === option.value
                  ? "bg-amber-50 text-amber-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Row - Below main filters */}
      {(getActiveFilterCount() > 0 || selectedFilters.sortBy) && (
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-2 py-2">
          <div className="flex flex-wrap items-center gap-1">
            {/* Price Filter Chip */}
            {priceRange[0] !== PRICE_RANGE.min || priceRange[1] !== PRICE_RANGE.max ? (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded-full">
                <span className="text-[10px]">
                  {getActivePriceBracket()?.label || `₹${priceRange[0].toLocaleString()} - ₹${priceRange[1].toLocaleString()}`}
                </span>
                <button
                  onClick={removePriceFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={10} />
                </button>
              </div>
            ) : null}

            {/* Weight Filter Chip */}
            {weightRange[0] !== WEIGHT_RANGE.min || weightRange[1] !== WEIGHT_RANGE.max ? (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded-full">
                <span className="text-[10px]">
                  {getActiveWeightBracket()?.label || `${weightRange[0]}g - ${weightRange[1]}g`}
                </span>
                <button
                  onClick={removeWeightFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={10} />
                </button>
              </div>
            ) : null}

            {/* Gender Filter Chip */}
            {selectedGender && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded-full">
                <span className="text-[10px]">
                  {GENDER_OPTIONS.find(opt => opt.value === selectedGender)?.label}
                </span>
                <button
                  onClick={removeGenderFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={10} />
                </button>
              </div>
            )}

            {/* Metal Finish Filter Chip */}
            {selectedMetalFinish && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded-full">
                <span className="text-[10px]">
                  {selectedMetalFinish}
                </span>
                <button
                  onClick={removeMetalFinishFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={10} />
                </button>
              </div>
            )}

            {/* Size Filter Chip */}
            {selectedSize && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded-full">
                <span className="text-[10px]">
                  Size: {selectedSize}
                </span>
                <button
                  onClick={removeSizeFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={10} />
                </button>
              </div>
            )}

            {/* Sub Category Filter Chip */}
            {selectedSubCategory && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded-full">
                <span className="text-[10px]">
                  {selectedSubCategory}
                </span>
                <button
                  onClick={removeSubCategoryFilter}
                  className="text-amber-600 hover:text-amber-800 ml-1"
                >
                  <X size={10} />
                </button>
              </div>
            )}

            {/* Sort Filter Chip */}
            {selectedFilters.sortBy && (
              <div className="flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                <span className="text-[10px]">
                  {SORT_OPTIONS.find((opt) => opt.value === selectedFilters.sortBy)?.label}
                </span>
                <button
                  onClick={removeSortFilter}
                  className="text-gray-600 hover:text-gray-800 ml-1"
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>

          {/* Clear All */}
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors text-xs whitespace-nowrap"
            >
              <RotateCcw size={12} />
              Clear
            </button>
          )}
        </div>
      )}
    </>
  );

  /* ================= RENDER ================= */

  return isDesktop ? <DesktopFilterBar /> : <MobileFilterBar />;
}