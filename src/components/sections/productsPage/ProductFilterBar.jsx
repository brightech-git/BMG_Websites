// ProductFilterBar.jsx (Main Component)
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ChevronDown, RotateCcw, Filter, ChevronUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { resetFilters } from "../../../redux/slices/filterSlice";
import debounce from "lodash/debounce";
import { useGetFilters } from "../../../hook/product/useFilterProducts";

// Import constants
import {
  SORT_OPTIONS,
  PRICE_BRACKETS,
  WEIGHT_BRACKETS,
  PRICE_RANGE,
  WEIGHT_RANGE,
  GENDER_OPTIONS,
  METAL_FINISH_OPTIONS,
} from "../../../component/filter/filterConstants";

// Import components
import { FilterDropdown } from "../../../component/filter/FilterDropdown";
import { FilterOptionsList } from "../../../component/filter/FilterOptionsList";
import { RangeFilterContent } from "../../../component/filter/RangeFilterContent";
import { FilterChipList } from "../../../component/filter/FilterChipList";
import { MobileCheckboxOption, MobileRadioOption } from "../../../component/filter/MobileFilterOptions";

export default function ProductFilterBar({
  onFiltersChange,
  totalResults = 0,
  itemCtrName
}) {


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
      if (filterData.sizes) {
        setSizeFilters(filterData.sizes);
      }
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
      metalType: params.get("metalType") || null,
    };
  };

  const [selectedFilters, setSelectedFilters] = useState(getURLParams());

  /* ---------- Individual Filter States ---------- */
  const getInitialSize = () => new URLSearchParams(location.search).get("sizeName") || null;
  const [selectedSize, setSelectedSize] = useState(getInitialSize);

  const getInitialSubCategory = () => new URLSearchParams(location.search).get("subItemName") || null;
  const [selectedSubCategory, setSelectedSubCategory] = useState(getInitialSubCategory);

  const getInitialMetalFinish = () => new URLSearchParams(location.search).get("metalType") || null;
  const [selectedMetalFinish, setSelectedMetalFinish] = useState(getInitialMetalFinish);

  const getInitialPriceRange = () => {
    const p = new URLSearchParams(location.search).get("priceRange");
    if (!p) return [PRICE_RANGE.min, PRICE_RANGE.max];
    const [min, max] = p.split("-").map(Number);
    return isNaN(min) || isNaN(max) ? [PRICE_RANGE.min, PRICE_RANGE.max] : [min, max];
  };
  const [priceRange, setPriceRange] = useState(getInitialPriceRange);

  const getInitialWeightRange = () => {
    const w = new URLSearchParams(location.search).get("weightRange");
    if (!w) return [WEIGHT_RANGE.min, WEIGHT_RANGE.max];
    const [min, max] = w.split("-").map(Number);
    return isNaN(min) || isNaN(max) ? [WEIGHT_RANGE.min, WEIGHT_RANGE.max] : [min, max];
  };
  const [weightRange, setWeightRange] = useState(getInitialWeightRange);

  const getInitialGender = () => new URLSearchParams(location.search).get("gender") || null;
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
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(e.target)) {
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

    const [priceMin, priceMax] = getInitialPriceRange();
    if (priceMin !== priceRange[0] || priceMax !== priceRange[1]) {
      setPriceRange([priceMin, priceMax]);
    }

    const [weightMin, weightMax] = getInitialWeightRange();
    if (weightMin !== weightRange[0] || weightMax !== weightRange[1]) {
      setWeightRange([weightMin, weightMax]);
    }

    const gender = getInitialGender();
    if (gender !== selectedGender) setSelectedGender(gender);

    const sizeName = getInitialSize();
    if (sizeName !== selectedSize) setSelectedSize(sizeName);

    const subItemName = getInitialSubCategory();
    if (subItemName !== selectedSubCategory) setSelectedSubCategory(subItemName);

    const metalType = getInitialMetalFinish();
    if (metalType !== selectedMetalFinish) setSelectedMetalFinish(metalType);
  }, [location.search]);

  /* ================= URL UPDATE ================= */
  const updateURL = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(location.search);
      const filterParams = ["priceRange", "weightRange", "gender", "sizeName", "subItemName", "metalType", "sortBy"];

      filterParams.forEach(param => {
        if (newFilters[param] !== undefined) {
          if (newFilters[param]) params.set(param, newFilters[param]);
          else params.delete(param);
        }
      });

      params.delete("page");
      navigate({ search: params.toString() });
      onFiltersChange?.(Object.fromEntries(params));
    },
    [navigate, onFiltersChange, location.search]
  );

  const applyPriceToURL = useCallback(
    debounce((min, max) => {
      const isDefault = min === PRICE_RANGE.min && max === PRICE_RANGE.max;
      updateURL({ ...selectedFilters, priceRange: isDefault ? null : `${min}-${max}` });
    }, 400),
    [selectedFilters, updateURL]
  );

  const applyWeightToURL = useCallback(
    debounce((min, max) => {
      const isDefault = min === WEIGHT_RANGE.min && max === WEIGHT_RANGE.max;
      updateURL({ ...selectedFilters, weightRange: isDefault ? null : `${min}-${max}` });
    }, 400),
    [selectedFilters, updateURL]
  );

  /* ================= HANDLERS ================= */
  const selectPriceBracket = (min, max, keepOpen = false) => {
    const isDefault = min === PRICE_RANGE.min && max === PRICE_RANGE.max;
    setPriceRange([min, max]);
    setSelectedFilters((prev) => ({ ...prev, priceRange: isDefault ? null : `${min}-${max}` }));
    applyPriceToURL(min, max);
    if (!keepOpen && isDesktop) setOpenDropdown(null);
  };

  const selectWeightBracket = (min, max, keepOpen = false) => {
    const isDefault = min === WEIGHT_RANGE.min && max === WEIGHT_RANGE.max;
    setWeightRange([min, max]);
    setSelectedFilters((prev) => ({ ...prev, weightRange: isDefault ? null : `${min}-${max}` }));
    applyWeightToURL(min, max);
    if (!keepOpen && isDesktop) setOpenDropdown(null);
  };

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    updateURL({ ...selectedFilters, gender: value });
    setOpenDropdown(null);
  };

  const handleSizeChange = (sizeNameValue) => {
    setSelectedSize(sizeNameValue);
    updateURL({ ...selectedFilters, sizeName: sizeNameValue });
    setOpenDropdown(null);
  };

  const handleSubCategoryChange = (subItemNameValue) => {
    setSelectedSubCategory(subItemNameValue);
    updateURL({ ...selectedFilters, subItemName: subItemNameValue });
    setOpenDropdown(null);
  };

  const handleMetalFinishChange = (metalTypeValue) => {
    setSelectedMetalFinish(metalTypeValue);
    updateURL({ ...selectedFilters, metalType: metalTypeValue });
    setOpenDropdown(null);
  };

  const handleSortChange = (value) => {
    updateURL({ ...selectedFilters, sortBy: value });
    setOpenDropdown(null);
    setIsSortPanelOpen(false);
  };

  const clearAll = () => {
    const params = new URLSearchParams(window.location.search);
    ["sortBy", "priceRange", "weightRange", "gender", "sizeName", "subItemName", "metalType"].forEach(p => params.delete(p));
    navigate({ search: params.toString() });

    setSelectedGender(null);
    setSelectedSize(null);
    setSelectedSubCategory(null);
    setSelectedMetalFinish(null);
    setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
    setWeightRange([WEIGHT_RANGE.min, WEIGHT_RANGE.max]);
    setOpenDropdown(null);
    setIsFilterPanelOpen(false);
    setIsSortPanelOpen(false);
    dispatch(resetFilters());
    onFiltersChange?.({});
  };

  /* ================= UTILITY FUNCTIONS ================= */
  const getActiveFilterCount = () => {
    let count = 0;
    if (priceRange[0] !== PRICE_RANGE.min || priceRange[1] !== PRICE_RANGE.max) count += 1;
    if (weightRange[0] !== WEIGHT_RANGE.min || weightRange[1] !== WEIGHT_RANGE.max) count += 1;
    if (selectedGender) count += 1;
    if (selectedSize) count += 1;
    if (selectedSubCategory) count += 1;
    if (selectedMetalFinish) count += 1;
    return count;
  };

  const getActivePriceBracket = () => PRICE_BRACKETS.find(b => priceRange[0] === b.min && priceRange[1] === b.max);
  const getActiveWeightBracket = () => WEIGHT_BRACKETS.find(b => weightRange[0] === b.min && weightRange[1] === b.max);

  const removePriceFilter = () => {
    setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
    updateURL({ ...selectedFilters, priceRange: null });
  };

  const removeWeightFilter = () => {
    setWeightRange([WEIGHT_RANGE.min, WEIGHT_RANGE.max]);
    updateURL({ ...selectedFilters, weightRange: null });
  };

  const removeGenderFilter = () => {
    setSelectedGender(null);
    updateURL({ ...selectedFilters, gender: null });
  };

  const removeSizeFilter = () => {
    setSelectedSize(null);
    updateURL({ ...selectedFilters, sizeName: null });
  };

  const removeSubCategoryFilter = () => {
    setSelectedSubCategory(null);
    updateURL({ ...selectedFilters, subItemName: null });
  };

  const removeMetalFinishFilter = () => {
    setSelectedMetalFinish(null);
    updateURL({ ...selectedFilters, metalType: null });
  };

  const removeSortFilter = () => {
    updateURL({ ...selectedFilters, sortBy: "" });
  };

  /* ================= SLIDER COMPONENTS ================= */
  const PriceSlider = () => {
    const sliderRef = useRef(null);
    const [local, setLocal] = useState(priceRange);
    const [drag, setDrag] = useState(null);

    useEffect(() => setLocal(priceRange), [priceRange]);

    const pct = (v) => ((v - PRICE_RANGE.min) / (PRICE_RANGE.max - PRICE_RANGE.min)) * 100;

    const move = (e) => {
      if (drag === null) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.touches?.[0]?.clientX ?? e.clientX;
      let v = PRICE_RANGE.min + ((x - rect.left) / rect.width) * (PRICE_RANGE.max - PRICE_RANGE.min);
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
            style={{ left: `${pct(local[0])}%`, width: `${pct(local[1]) - pct(local[0])}%` }}
          />
          {[0, 1].map((i) => (
            <div
              key={i}
              onMouseDown={() => { isDraggingRef.current = true; setDrag(i); }}
              onTouchStart={() => { isDraggingRef.current = true; setDrag(i); }}
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

  const WeightSlider = () => {
    const sliderRef = useRef(null);
    const [local, setLocal] = useState(weightRange);
    const [drag, setDrag] = useState(null);

    useEffect(() => setLocal(weightRange), [weightRange]);

    const pct = (v) => ((v - WEIGHT_RANGE.min) / (WEIGHT_RANGE.max - WEIGHT_RANGE.min)) * 100;

    const move = (e) => {
      if (drag === null) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.touches?.[0]?.clientX ?? e.clientX;
      let v = WEIGHT_RANGE.min + ((x - rect.left) / rect.width) * (WEIGHT_RANGE.max - WEIGHT_RANGE.min);
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
            style={{ left: `${pct(local[0])}%`, width: `${pct(local[1]) - pct(local[0])}%` }}
          />
          {[0, 1].map((i) => (
            <div
              key={i}
              onMouseDown={() => { isDraggingRef.current = true; setDrag(i); }}
              onTouchStart={() => { isDraggingRef.current = true; setDrag(i); }}
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

  /* ================= FILTER CONFIGURATION ================= */
  const createFilterConfig = (id, label, type, options = {}) => {
    const baseConfig = {
      id,
      label,
      type,
      width: options.width || (type === 'range' ? 'w-80' : 'w-56'),
      condition: options.condition ?? true,
    };

    if (type === 'range') {
      baseConfig.content = (
        <RangeFilterContent
          SliderComponent={options.SliderComponent}
          brackets={options.brackets}
          currentRange={options.currentRange}
          onSelectBracket={options.onSelectBracket}
        />
      );
      baseConfig.chip = options.showChip ? {
        label: options.chipLabel,
        onRemove: options.onRemove
      } : null;
    } else if (type === 'options') {
      baseConfig.content = (
        <FilterOptionsList
          options={options.optionsList}
          selectedValue={options.selectedValue}
          onSelect={options.onSelect}
          renderLabel={options.renderLabel}
        />
      );
      baseConfig.chip = options.selectedValue ? {
        label: `${label}: ${options.chipValue || options.selectedValue}`,
        onRemove: options.onRemove
      } : null;
    }

    return baseConfig;
  };

  const filterConfigs = [
    createFilterConfig('price', 'Price', 'range', {
      SliderComponent: PriceSlider,
      brackets: PRICE_BRACKETS,
      currentRange: priceRange,
      onSelectBracket: selectPriceBracket,
      showChip: priceRange[0] !== PRICE_RANGE.min || priceRange[1] !== PRICE_RANGE.max,
      chipLabel: `Price: ${getActivePriceBracket()?.label || `₹${priceRange[0].toLocaleString()} - ₹${priceRange[1].toLocaleString()}`}`,
      onRemove: removePriceFilter
    }),
    createFilterConfig('weight', 'Weight', 'range', {
      SliderComponent: WeightSlider,
      brackets: WEIGHT_BRACKETS,
      currentRange: weightRange,
      onSelectBracket: selectWeightBracket,
      showChip: weightRange[0] !== WEIGHT_RANGE.min || weightRange[1] !== WEIGHT_RANGE.max,
      chipLabel: `Weight: ${getActiveWeightBracket()?.label || `${weightRange[0]}g - ${weightRange[1]}g`}`,
      onRemove: removeWeightFilter
    }),
    createFilterConfig('gender', 'Gender', 'options', {
      optionsList: GENDER_OPTIONS,
      selectedValue: selectedGender,
      onSelect: (option) => handleGenderChange(option.value),
      renderLabel: (option) => option.label,
      chipValue: GENDER_OPTIONS.find(opt => opt.value === selectedGender)?.label,
      onRemove: removeGenderFilter
    }),
    createFilterConfig('metalType', 'Metal Finish', 'options', {
      optionsList: METAL_FINISH_OPTIONS,
      selectedValue: selectedMetalFinish,
      onSelect: (option) => handleMetalFinishChange(option.value),
      renderLabel: (option) => option.label,
      chipValue: selectedMetalFinish,
      onRemove: removeMetalFinishFilter
    }),
    createFilterConfig('sizeName', 'Size', 'options', {
      optionsList: sizeNameFilters,
      selectedValue: selectedSize,
      onSelect: (option) => handleSizeChange(option.sizeName),
      renderLabel: (option) => `Size ${option.sizeName}`,
      chipValue: selectedSize,
      onRemove: removeSizeFilter,
      condition: sizeNameFilters.length > 0
    }),
    createFilterConfig('subItemName', 'Category', 'options', {
      optionsList: subItemNameFilters,
      selectedValue: selectedSubCategory,
      onSelect: (option) => handleSubCategoryChange(option.value),
      renderLabel: (option) => option.name,
      chipValue: selectedSubCategory,
      onRemove: removeSubCategoryFilter,
      condition: subItemNameFilters.length > 0
    })
  ];

  // Get active chips for mobile/desktop
  const getActiveChips = () => {
    const chips = [];
    filterConfigs.forEach(filter => {
      if (filter.chip) chips.push(filter.chip);
    });
    if (selectedFilters.sortBy) {
      chips.push({
        label: `Sort: ${SORT_OPTIONS.find((opt) => opt.value === selectedFilters.sortBy)?.label}`,
        onRemove: removeSortFilter,
        bgColor: "bg-gray-100"
      });
    }
    return chips;
  };

  /* ================= DESKTOP UI ================= */
  const DesktopFilterBar = () => (
    <>
      <div ref={dropdownContainerRef} className="bg-[var(--primary-color)] border-b border-gray-200 px-4 py-1.5">
        <div className="flex items-center gap-4 flex-wrap">
          {filterConfigs.map((filter) =>
            filter.condition && (
              <FilterDropdown
                key={filter.id}
                label={filter.label}
                isOpen={openDropdown === filter.id}
                onToggle={() => setOpenDropdown(openDropdown === filter.id ? null : filter.id)}
                width={filter.width}
              >
                {filter.content}
              </FilterDropdown>
            )
          )}

          <div className="relative ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <FilterDropdown
              label={SORT_OPTIONS.find((opt) => opt.value === selectedFilters.sortBy)?.label || "Featured"}
              isOpen={openDropdown === "sort"}
              onToggle={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
              width="w-56"
              direction="left"
            >
              <FilterOptionsList
                options={SORT_OPTIONS}
                selectedValue={selectedFilters.sortBy}
                onSelect={(option) => handleSortChange(option.value)}
                renderLabel={(option) => option.label}
               

              />
            </FilterDropdown>
          </div>
        </div>
      </div>

      {(getActiveFilterCount() > 0 || selectedFilters.sortBy) && (
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
          <FilterChipList
            filters={getActiveChips()}
            onClearAll={clearAll}
            showClearAll={getActiveFilterCount() > 0}
          />
        </div>
      )}
    </>
  );

  /* ===== MOBILE FILTER BAR WITH SORT OVERLAY ===== */
  const MobileFilterBar = () => (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-[var(--primary-card-color)] border-t border-gray-200 z-20 flex justify-around items-center p-2">
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

        <button
          onClick={() => setIsSortPanelOpen(true)}
          className="flex items-center gap-2 border border-gray-300 bg-[var(--primary-hover-color)] px-4 py-2 rounded-full text-sm font-medium text-white transition-colors"
        >
          Sort: {SORT_OPTIONS.find((opt) => opt.value === selectedFilters.sortBy)?.label || "Featured"}
          <ChevronUp size={16} />
        </button>
      </div>

      {/* FILTER OVERLAY */}
      {isFilterPanelOpen && (
        <div className="fixed inset-0 bg-white z-[2000] flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-[var(--primary-card-color)] to-[var(--primary-color)] flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-900">Filter</h3>
            <button onClick={() => setIsFilterPanelOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-2/5 border-r border-gray-200 overflow-y-auto bg-[var(--primary-card-color)]">
              {filterConfigs.map(filter => filter.condition && (
                <button
                  key={filter.id}
                  onClick={() => setActiveMobileFilter(filter.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-200 text-sm ${activeMobileFilter === filter.id ? "bg-gray-50 text-amber-600 font-medium" : "text-gray-700"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeMobileFilter === "price" && (
                <>
                  <PriceSlider />
                  <div className="mt-4 space-y-2">
                    {PRICE_BRACKETS.map((bracket) => (
                      <MobileCheckboxOption
                        key={bracket.label}
                        label={bracket.label}
                        checked={priceRange[0] === bracket.min && priceRange[1] === bracket.max}
                        onChange={() => selectPriceBracket(bracket.min, bracket.max, true)}
                      />
                    ))}
                  </div>
                </>
              )}

              {activeMobileFilter === "weight" && (
                <>
                  <WeightSlider />
                  <div className="mt-4 space-y-2">
                    {WEIGHT_BRACKETS.map((bracket) => (
                      <MobileCheckboxOption
                        key={bracket.label}
                        label={bracket.label}
                        checked={weightRange[0] === bracket.min && weightRange[1] === bracket.max}
                        onChange={() => selectWeightBracket(bracket.min, bracket.max, true)}
                      />
                    ))}
                  </div>
                </>
              )}

              {activeMobileFilter === "gender" && (
                <div className="space-y-2">
                  {GENDER_OPTIONS.map((option) => (
                    <MobileRadioOption
                      key={option.value}
                      label={option.label}
                      name="gender"
                      value={option.value}
                      checked={selectedGender === option.value}
                      onChange={() => handleGenderChange(option.value)}
                    />
                  ))}
                </div>
              )}

              {activeMobileFilter === "metalType" && (
                <div className="space-y-2">
                  {METAL_FINISH_OPTIONS.map((finish) => (
                    <MobileRadioOption
                      key={finish.id}
                      label={finish.label}
                      name="metalType"
                      value={finish.value}
                      checked={selectedMetalFinish === finish.value}
                      onChange={() => handleMetalFinishChange(finish.value)}
                    />
                  ))}
                </div>
              )}

              {activeMobileFilter === "sizeName" && sizeNameFilters.length > 0 && (
                <div className="space-y-2">
                  {sizeNameFilters.map((sizeName) => (
                    <MobileRadioOption
                      key={sizeName.id}
                      label={`Size ${sizeName.sizeName}`}
                      name="sizeName"
                      value={sizeName.sizeName}
                      checked={selectedSize === sizeName.sizeName}
                      onChange={() => handleSizeChange(sizeName.sizeName)}
                    />
                  ))}
                </div>
              )}

              {activeMobileFilter === "subItemName" && subItemNameFilters.length > 0 && (
                <div className="space-y-2">
                  {subItemNameFilters.map((subCat) => (
                    <MobileRadioOption
                      key={subCat.id}
                      label={subCat.name}
                      name="subItemName"
                      value={subCat.value}
                      checked={selectedSubCategory === subCat.value}
                      onChange={() => handleSubCategoryChange(subCat.value)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 p-2 flex gap-2">
            {/* Reset Button */}
            <button
              onClick={clearAll}
              className="flex-1 bg-red-500 hover:bg-red-700 text-white text-sm py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              Reset Filters
            </button>
            {/* Total Results Button */}
            <button
              onClick={() => setIsFilterPanelOpen(false)}
              className="flex-1 border border-gray-300 text-white text-sm py-2 bg-[#d1721f] rounded-lg font-medium  transition-colors shadow-sm"
            >
              show {totalResults} {totalResults === 1 ? 'Item' : 'Items'}
            </button>

           
          </div>
        </div>
      )}

      {/* SORT OVERLAY */}
      {isSortPanelOpen && (
        <div className="fixed inset-0 bg-white z-[2000] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Sort By</h3>
            <button onClick={() => setIsSortPanelOpen(false)} className="p-1 hover:bg-gray-100 rounded">
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

      {(getActiveFilterCount() > 0 || selectedFilters.sortBy) && (
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-2 py-2">
     

          <FilterChipList
            filters={getActiveChips()}
            onClearAll={clearAll}
            showClearAll={getActiveFilterCount() > 0}
          />
        </div>
      )}
    </>
  );

  return isDesktop ? <DesktopFilterBar /> : <MobileFilterBar />;
}