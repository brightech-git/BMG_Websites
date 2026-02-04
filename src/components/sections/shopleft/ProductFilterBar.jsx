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
import "animate.css";

/* ================= CONSTANTS ================= */

const SORT_OPTIONS = [
  // { label: "Featured", value: "featured" },
  { label: "Price – Low to High", value: "priceLowToHigh" },
  { label: "Price – High to Low", value: "priceHighToLow" },
];

const PRICE_BRACKETS = [
  { min: 1, max: 3999, label: "Below - ₹3999" },
  { min: 4000, max: 4999, label: "₹4000 - ₹4999" },
  { min: 5000, max: 5999, label: "₹5000 - ₹5999" },
  { min: 6000, max: 100000, label: "₹6000 - Above" },
];

const PRICE_RANGE = { min: 0, max: 100000, step: 100 };

/* ================= COMPONENT ================= */

export default function UnifiedFilterBar({
  onFiltersChange,
  totalResults = 0,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeMobileFilter, setActiveMobileFilter] = useState("price");
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);

  // const handleSortChange = (value) => {
  //   setSelectedFilters((prev) => ({ ...prev, sortBy: value }));
  //   setIsSortPanelOpen(false);
  // };

  const dropdownContainerRef = useRef(null);
  const isDraggingRef = useRef(false);

  /* ---------- Get URL Params ---------- */
  const getURLParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      sortBy: params.get("sortBy"),
      priceRange: params.get("priceRange") || null,
    };
  };
  const [selectedFilters, setSelectedFilters] = useState(getURLParams());
 

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
    setSelectedFilters(getURLParams());
    setPriceRange(getInitialPriceRange());
  }, [location.search]);

  /* ================= URL UPDATE ================= */

  const updateURL = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();

      if (newFilters.priceRange) {
        params.set("priceRange", newFilters.priceRange);
      }

      if (newFilters.sortBy) {
        params.set("sortBy", newFilters.sortBy);
      }

      params.delete("page");
      navigate({ search: params.toString() });
      onFiltersChange?.(Object.fromEntries(params));
    },
    [navigate, onFiltersChange]
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

  /* ================= HANDLERS ================= */

  const selectPriceBracket = (min, max, keepOpen = false) => {
    setPriceRange([min, max]);
    applyPriceToURL(min, max);
    if (!keepOpen && isDesktop) setOpenDropdown(null);
  };

  const handleSortChange = (value) => {
    const newFilters = { ...selectedFilters, sortBy: value };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
    setOpenDropdown(null);
  };

  const clearAll = () => {
    navigate({ search: "" });
    setSelectedFilters({
      sortBy: "",
      priceRange: null,
    });
    setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
    dispatch(resetFilters());
    onFiltersChange?.({});
    setOpenDropdown(null);
    setIsFilterPanelOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (
      priceRange[0] !== PRICE_RANGE.min ||
      priceRange[1] !== PRICE_RANGE.max
    ) {
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

  const removePriceFilter = () => {
    setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
    const newFilters = { ...selectedFilters, priceRange: null };
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

  /* ================= DESKTOP UI ================= */

  const DesktopFilterBar = () => (
    <>
      <div
        ref={dropdownContainerRef}
        className="bg-pink-50 border-b border-gray-200 px-4 py-1.5"
      >
        <div className="flex items-center gap-4">
          {/* Price */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "price" ? null : "price")
              }
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--primary-text-color)] hover:text-[var(--primary-hover-color)]  transition-colors"
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

          {/* Sort By */}
          <div className="relative ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "sort" ? null : "sort")
              }
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-amber-700  rounded-lg transition-colors"
            >
              {SORT_OPTIONS.find((opt) => opt.value === selectedFilters.sortBy)
                ?.label}
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
            {getActiveFilterCount() > 0 && (
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
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around items-center p-2">
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
          className="flex items-center gap-2 border border-gray-300 bg-[var(--primary-hover-color)] px-4 py-2 rounded-full text-sm font-medium text-white  transition-colors"
        >
          Sort:{" "}
          {SORT_OPTIONS.find((opt) => opt.value === selectedFilters.sortBy)?.label }
          <ChevronUp size={16} />
        </button>
      </div>

      {/* FILTER OVERLAY */}
      {isFilterPanelOpen && (
        <div className="fixed inset-0 bg-white z-[2000] flex flex-col">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-900">Filter</h3>
            <button
              onClick={() => setIsFilterPanelOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-2/5 border-r border-gray-200 overflow-y-auto">
              <button
                onClick={() => setActiveMobileFilter("price")}
                className={`w-full text-left px-4 py-3 border-b border-gray-200 text-sm ${activeMobileFilter === "price" ? "bg-gray-50 text-amber-600 font-medium" : "text-gray-700"
                  }`}
              >
                Price
              </button>
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
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 flex gap-3">
            <button
              onClick={clearAll}
              className="flex-1 border bg-red-400 border-red-300 text-white  text-xs py-3 rounded-md font-medium hover:bg-red-500 transition-colors"
            >
              Reset 
            </button>
            {/* <button
              onClick={() => setIsFilterPanelOpen(false)}
              className="flex-1 bg-amber-500 text-white py-3 rounded-md font-medium hover:bg-amber-600 transition-colors"
            >
              Apply ({totalResults})
            </button> */}
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
    </>
  );


  /* ================= RENDER ================= */

  return isDesktop ? <DesktopFilterBar /> : <MobileFilterBar />;
}