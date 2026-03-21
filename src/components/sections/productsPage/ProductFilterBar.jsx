// ProductFilterBar.jsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";


import { resetFilters } from "../../../redux/slices/filterSlice";
import debounce from "lodash/debounce";
import { useGetFilters, useGetProductsFilters } from "../../../hook/product/useFilterProducts";


import { MobileFilterBar } from "../../../component/filter/MobileFilterBar";
import { DesktopFilterBar } from "../../../component/filter/DesktopFilterBar";

// ─── Fallback slider bounds ───────────────────────────────────────────────────
const PRICE_RANGE = { min: 0, max: 100000, step: 100 };
const WEIGHT_RANGE = { min: 0, max: 1000, step: 1 };

const SORT_OPTIONS = [
  { label: "Price – Low to High", value: "priceLowToHigh" },
  { label: "Price – High to Low", value: "priceHighToLow" },
];

// ─── URL helpers ──────────────────────────────────────────────────────────────
const parseIds = (str) =>
  new Set((str || "").split(",").map(Number).filter(Boolean));

const stringifyIds = (ids) => {
  const arr = [...ids].filter(Boolean);
  return arr.length ? arr.join(",") : null;
};

// ─── Shared range-slider ──────────────────────────────────────────────────────
function RangeSlider({ range, setRange, applyRange, rangeConfig, isDraggingRef, isPrice }) {
  const sliderRef = useRef(null);
  const [local, setLocal] = useState(range);
  const [drag, setDrag] = useState(null);

  useEffect(() => setLocal(range), [range]);

  const pct = (v) =>
    ((v - rangeConfig.min) / (rangeConfig.max - rangeConfig.min)) * 100;

  const move = (e) => {
    if (drag === null || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.touches?.[0]?.clientX ?? e.clientX;
    let v = rangeConfig.min + ((x - rect.left) / rect.width) * (rangeConfig.max - rangeConfig.min);
    v = Math.round(v / rangeConfig.step) * rangeConfig.step;
    v = Math.max(rangeConfig.min, Math.min(v, rangeConfig.max));
    const next = [...local];
    if (drag === 0 && v < next[1]) next[0] = v;
    if (drag === 1 && v > next[0]) next[1] = v;
    setLocal(next);
  };

  const end = () => {
    if (drag !== null) {
      isDraggingRef.current = false;
      setRange(local);
      applyRange(local[0], local[1]);
    }
    setDrag(null);
  };

  useEffect(() => {
    if (drag === null) return; // only attach when actively dragging
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
  }, [drag]); // ← depend on drag

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
            className="absolute w-5 h-5 bg-white border-2 border-[var(--primary-hover-color)] rounded-full -top-1.5 cursor-grab active:cursor-grabbing"
            style={{ left: `${pct(local[i])}%`, marginLeft: "-10px" }}
          />
        ))}
      </div>
      <div className="flex justify-between text-sm mt-2 text-gray-600">
        <span>{isPrice ? `₹${local[0].toLocaleString()}` : `${local[0]}g`}</span>
        <span>{isPrice ? `₹${local[1].toLocaleString()}` : `${local[1]}g`}</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProductFilterBar({ onFiltersChange, totalResults = 0, itemCtrName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeMobileFilter, setActiveMobileFilter] = useState(null);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);

  // const dropdownContainerRef = useRef(null);
  const isDraggingRef = useRef(false);

  // ── Fetch filters ─────────────────────────────────────────────────────────
  // rawApiFilters → itemCtrName-specific: has { sizes, subItems }
  // productFilters → global grouped filters: { Price: [...], Gender: [...], ... }
  const { data: rawApiFilters, isLoading: filtersLoading } = useGetFilters(itemCtrName);
  const { data: productFilters, isLoading: productFiltersLoading } = useGetProductsFilters();

  // ── Grouped filters (from productFilters) ─────────────────────────────────
  // Shape: { Price: [{id, filterTitle, min, max, isRange, ...}], Gender: [...], ... }
  const [apiFilters, setApiFilters] = useState({});

  // ── Item-specific filters (from rawApiFilters) ────────────────────────────
  // sizes:    [{ id, sizeId, sizeName, itemName }]
  // subItems: ["CASTING LADIES RING DT", ...]
  const [sizeOptions, setSizeOptions] = useState([]);
  const [subItemOptions, setSubItemOptions] = useState([]);

  useEffect(() => {
    if (productFilters && typeof productFilters === "object") {
      const cleaned = {};
      Object.entries(productFilters).forEach(([key, items]) => {
        const active = (items || []).filter((i) => i.isActive !== false);
        if (active.length) cleaned[key] = active;
      });
      setApiFilters(cleaned);
      const firstKey = Object.keys(cleaned)[0];
      if (firstKey && !activeMobileFilter) setActiveMobileFilter(firstKey);
    }
  }, [productFilters]);

  useEffect(() => {
    if (!rawApiFilters) return;
    if (rawApiFilters.sizes) setSizeOptions(rawApiFilters.sizes);
    if (rawApiFilters.subItems) setSubItemOptions(rawApiFilters.subItems);
  }, [rawApiFilters]);

  // ── Range-filter detection ────────────────────────────────────────────────
  const isRangeFilter = useCallback(
    (key) => (apiFilters[key] || []).some((i) => i.isRange === true),
    [apiFilters]
  );

  const getSliderConfig = useCallback(
    (key) => {
      const items = apiFilters[key] || [];
      const allMin = items.map((i) => i.min).filter((v) => v !== 0);
      const allMax = items.map((i) => i.max).filter((v) => v !== 0);
      const step = items[0]?.step || 1;
      const fallback = key.toLowerCase() === "weight" ? WEIGHT_RANGE : PRICE_RANGE;
      return {
        min: allMin.length ? Math.min(...allMin) : fallback.min,
        max: allMax.length ? Math.max(...allMax) : fallback.max,
        step: step || fallback.step,
      };
    },
    [apiFilters]
  );

  // ══════════════════════════════════════════════════════════════════════════
  // URL STATE
  // ══════════════════════════════════════════════════════════════════════════

  // Parse URL → Set
  const parseURLSelectedIds = useCallback(() => {
    const raw = new URLSearchParams(location.search).get("filterIds");
    return parseIds(raw);
  }, [location.search]);

  const parseURLRanges = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const ranges = {};
    params.forEach((value, key) => {
      if (!key.endsWith("Range")) return;
      const rawKey = key.replace("Range", "");
      const filterKey = Object.keys(apiFilters).find(
        (k) => k.toLowerCase() === rawKey.toLowerCase()
      );
      if (!filterKey) return;
      const [min, max] = value.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) ranges[filterKey] = [min, max];
    });
    return ranges;
  }, [location.search, apiFilters]);
  
  const parseURLSizes = useCallback(() => {
    const raw = new URLSearchParams(location.search).get("sizeName");
    return new Set((raw || "").split(",").filter(Boolean));
  }, [location.search]);

  const parseURLSubItems = useCallback(() => {
    const raw = new URLSearchParams(location.search).get("subItemName");
    return new Set((raw || "").split(",").filter(Boolean));
  }, [location.search]);

  const [selectedSize, setSelectedSize] = useState(parseURLSizes);
  const [selectedSubItem, setSelectedSubItem] = useState(parseURLSubItems);

  const [selectedIds, setSelectedIds] = useState(parseURLSelectedIds);
  const [rangeMap, setRangeMap] = useState(parseURLRanges);
  const [sortBy, setSortBy] = useState(() => new URLSearchParams(location.search).get("sortBy") || "");

  // Sync on URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedIds(parseURLSelectedIds());
    setRangeMap(parseURLRanges());
    setSelectedSize(parseURLSizes());
    setSelectedSubItem(parseURLSubItems());
    setSortBy(params.get("sortBy") || "");
  }, [location.search, apiFilters]);

  // ── Core URL writer ───────────────────────────────────────────────────────
  const updateURL = useCallback(
    (newSelectedIds, newRangeMap, newSize, newSubItem, newSortBy) => {
      const params = new URLSearchParams(location.search);

      // Only delete KNOWN filter params — never touch itemCtrName or other page params
      const MANAGED_PARAMS = ["filterIds", "sizeName", "subItemName", "sortBy"];
      // Also delete any *Range params we manage
      [...params.keys()].forEach((k) => {
        if (
          MANAGED_PARAMS.includes(k) ||
          k.endsWith("Range")
        ) params.delete(k);
      });

      // Grouped filter IDs (non-range)
      const idsStr = stringifyIds(newSelectedIds);
      if (idsStr) params.set("filterIds", idsStr);

      // Range filters → named param e.g. priceRange, weightRange
      Object.entries(newRangeMap).forEach(([key, [min, max]]) => {
        const cfg = getSliderConfig(key);
        if (min !== cfg.min || max !== cfg.max)
          params.set(`${key.charAt(0).toLowerCase() + key.slice(1)}Range`, `${min}-${max}`);
      });

      // Size — comma-separated sizeName values
      if (newSize && newSize.size > 0) params.set("sizeName", [...newSize].join(","));

      // SubItem — comma-separated subItem strings
      if (newSubItem && newSubItem.size > 0) params.set("subItemName", [...newSubItem].join(","));

      if (newSortBy) params.set("sortBy", newSortBy);
      params.delete("page");

      navigate({ search: params.toString() });
      onFiltersChange?.(Object.fromEntries(params));
    },
    [navigate, onFiltersChange, location.search, getSliderConfig]
  );
  // ── Toggle grouped filter ID ──────────────────────────────────────────────
  const toggleId = useCallback(
    (id) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        updateURL(next, rangeMap, selectedSize, selectedSubItem, sortBy);
        return next;
      });
    },
    [rangeMap, selectedSize, selectedSubItem, sortBy, updateURL]
  );

  const handleSizeChange = (sizeName) => {
    setSelectedSize((prev) => {
      const next = new Set(prev);
      if (next.has(sizeName)) next.delete(sizeName);
      else next.add(sizeName);
      updateURL(selectedIds, rangeMap, next, selectedSubItem, sortBy);
      return next;
    });
  };

  const handleSubItemChange = (subItem) => {
    setSelectedSubItem((prev) => {
      const next = new Set(prev);
      if (next.has(subItem)) next.delete(subItem);
      else next.add(subItem);
      updateURL(selectedIds, rangeMap, selectedSize, next, sortBy);
      return next;
    });
  };

  // ── Slider handlers ───────────────────────────────────────────────────────
  const applyRangeDebounced = useCallback(
    debounce((filterKey, min, max) => {
      setRangeMap((prev) => {
        const next = { ...prev, [filterKey]: [min, max] };
        updateURL(selectedIds, next, selectedSize, selectedSubItem, sortBy);
        return next;
      });
    }, 400),
    [selectedIds, selectedSize, selectedSubItem, sortBy, updateURL]
  );

  const handleRangeChange = (filterKey, min, max) => {
    setRangeMap((prev) => ({ ...prev, [filterKey]: [min, max] }));
    applyRangeDebounced(filterKey, min, max);
  };

  // ── Sort ──────────────────────────────────────────────────────────────────
  const handleSortChange = (value) => {
    setSortBy(value);
    updateURL(selectedIds, rangeMap, selectedSize, selectedSubItem, value);
    setOpenDropdown(null);
    setIsSortPanelOpen(false);
  };

  // ── Clear all ─────────────────────────────────────────────────────────────
  const clearAll = () => {
    const empty = new Set();
    setSelectedIds(empty);
    setRangeMap({});
    setSelectedSize(new Set());
    setSelectedSubItem(new Set());
    updateURL(empty, {}, new Set(), new Set(), "");
    setSortBy("");
    setOpenDropdown(null);
    setIsFilterPanelOpen(false);
    setIsSortPanelOpen(false);
    dispatch(resetFilters());
    onFiltersChange?.({});
  };

  // ── Counts ────────────────────────────────────────────────────────────────
  const getActiveFilterCount = () => {
    let count = selectedIds.size;

    Object.entries(rangeMap).forEach(([key, [min, max]]) => {
      const cfg = getSliderConfig(key);
      if (min !== cfg.min || max !== cfg.max) count += 1;
    });
    if (selectedSize.size > 0) count += selectedSize.size;
    if (selectedSubItem.size > 0) count += selectedSubItem.size;
    return count;
  };

  const getKeySelectionCount = (key) => {
    if (isRangeFilter(key)) {
      const cfg = getSliderConfig(key);
      const r = rangeMap[key];
      return r && (r[0] !== cfg.min || r[1] !== cfg.max) ? 1 : 0;
    }
    // if (sectionKey === "__sizes__") return selectedSize.size;
    // if (sectionKey === "__subItems__") return selectedSubItem.size;
    return (apiFilters[key] || []).filter((i) => selectedIds.has(i.id)).length;
  };

  // ── Chips ─────────────────────────────────────────────────────────────────
  const getActiveChips = () => {
    const chips = [];

    // Grouped filter chips
    Object.entries(apiFilters).forEach(([key, items]) => {
      items.forEach((item) => {
        if (!selectedIds.has(item.id)) return;
        chips.push({ label: `${key}: ${item.filterTitle}`, onRemove: () => toggleId(item.id) });
      });
    });

    // Slider range chips
    Object.entries(rangeMap).forEach(([key, [min, max]]) => {
      const cfg = getSliderConfig(key);
      if (min === cfg.min && max === cfg.max) return;
      const isPrice = key.toLowerCase() === "price";
      chips.push({
        label: `${key}: ${isPrice ? `₹${min.toLocaleString()} – ₹${max.toLocaleString()}` : `${min}g – ${max}g`}`,
        onRemove: () => {
          setRangeMap((prev) => {
            const next = { ...prev };
            delete next[key];
            updateURL(selectedIds, next, selectedSize, selectedSubItem, sortBy);
            return next;
          });
        },
      });
    });

    [...selectedSize].forEach((s) => {
      chips.push({
        label: `Size: ${s}`,
        onRemove: () => handleSizeChange(s),
      });
    });

    // one chip per selected subItem
    [...selectedSubItem].forEach((s) => {
      chips.push({
        label: `Category: ${s}`,
        onRemove: () => handleSubItemChange(s),
      });
    });


    if (sortBy) {
      chips.push({
        label: `Sort: ${SORT_OPTIONS.find((o) => o.value === sortBy)?.label}`,
        onRemove: () => { setSortBy(""); updateURL(selectedIds, rangeMap, selectedSize, selectedSubItem, ""); },
        bgColor: "bg-gray-100",
      });
    }

    return chips;
  };

  // ── Responsive ────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);



  // ══════════════════════════════════════════════════════════════════════════
  // Sub-components
  // ══════════════════════════════════════════════════════════════════════════

  /** Standard checkbox list for grouped non-range filters */
  const CheckboxList = ({ filterKey, items }) => (
    <div className={`space-y-1 p-2 ${isDesktop ? 'max-h-[200px]' : 'min-h-full'}  overflow-y-auto`}>
      {items.map((item) => (
        <label key={item.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-amber-600 py-1 select-none">
          <input
            type="checkbox"
            checked={selectedIds.has(item.id)}
            onChange={() => toggleId(item.id)}
            className="accent-amber-600 w-4 h-4 rounded"
          />
          {item.filterTitle}
        </label>
      ))}
    </div>
  );

  /** Slider + bracket checkboxes for range filters (Price, Weight, …) */
  const RangeFilterPanel = ({ filterKey }) => {
    const items = apiFilters[filterKey] || [];
    const cfg = getSliderConfig(filterKey);
    const curRange = rangeMap[filterKey] || [cfg.min, cfg.max];

    const handleBracketToggle = (item) => {
      const isSelected = curRange[0] === item.min && curRange[1] === item.max;
      handleRangeChange(filterKey, isSelected ? cfg.min : item.min, isSelected ? cfg.max : item.max);
    };

    return (
      <div className="p-3 space-y-3">
        <RangeSlider
          range={curRange}
          setRange={(r) => setRangeMap((prev) => ({ ...prev, [filterKey]: r }))}
          applyRange={(min, max) => handleRangeChange(filterKey, min, max)}
          rangeConfig={cfg}
          isDraggingRef={isDraggingRef}
          isPrice={filterKey.toLowerCase() === "price"}
        />
        {items.length > 0 && (
          <div className="space-y-1 mt-2 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-amber-600 py-1 select-none">
                <input
                  type="checkbox"
                  checked={curRange[0] === item.min && curRange[1] === item.max}
                  onChange={() => handleBracketToggle(item)}
                  className="accent-amber-600 w-4 h-4 rounded"
                />
                {item.filterTitle}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  /** Size radio list — single select, value = sizeName */
  const SizeList = () => (
    <div className={`space-y-1 p-2 ${isDesktop ? 'max-h-[200px]': 'min-h-full'}  overflow-y-auto`}>
      {sizeOptions.map((size) => (
        <label key={size.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-amber-600 py-1 select-none">
          <input
            type="checkbox"
            checked={selectedSize.has(size.sizeName)}
            onChange={() => handleSizeChange(size.sizeName)}
            className="accent-amber-600 w-4 h-4 rounded"
          />
          Size {size.sizeName}
        </label>
      ))}
    </div>
  );

  const SubItemList = () => (
    <div className={`space-y-1 p-2 ${isDesktop ? 'max-h-[200px]': 'min-h-full'} overflow-y-auto`}>
      {subItemOptions.map((sub) => (
        <label key={sub} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-amber-600 py-1 select-none">
          <input
            type="checkbox"
            checked={selectedSubItem.has(sub)}
            onChange={() => handleSubItemChange(sub)}
            className="accent-amber-600 w-4 h-4 rounded"
          />
          {sub}
        </label>
      ))}
    </div>
  );

  // All filter sections to render (grouped + item-specific)
  // Item-specific sections only show when data is available
  const allFilterSections = [
    ...Object.keys(apiFilters),
    ...(sizeOptions.length > 0 ? ["__sizes__"] : []),
    ...(subItemOptions.length > 0 ? ["__subItems__"] : []),
  ];

  const renderFilterContent = (sectionKey) => {
    if (sectionKey === "__sizes__") return <SizeList />;
    if (sectionKey === "__subItems__") return <SubItemList />;
    if (isRangeFilter(sectionKey)) return <RangeFilterPanel filterKey={sectionKey} />;
    return <CheckboxList filterKey={sectionKey} items={apiFilters[sectionKey]} />;
  };

  const getSectionLabel = (sectionKey) => {
    if (sectionKey === "__sizes__") return "Size";
    if (sectionKey === "__subItems__") return "Category";
    return sectionKey;
  };

  const getSectionSelectionCount = (sectionKey) => {
    if (sectionKey === "__sizes__") return selectedSize.size;
    if (sectionKey === "__subItems__") return selectedSubItem.size;
    return getKeySelectionCount(sectionKey);
  };

  const getSectionHasSelection = (sectionKey) => {
    if (sectionKey === "__sizes__") return selectedSize.size > 0;
    if (sectionKey === "__subItems__") return selectedSubItem.size > 0;
    const isRange = isRangeFilter(sectionKey);
    const items = apiFilters[sectionKey] || [];
    return items.some((i) => selectedIds.has(i.id)) ||
      (isRange && rangeMap[sectionKey] &&
        (rangeMap[sectionKey][0] !== getSliderConfig(sectionKey).min ||
          rangeMap[sectionKey][1] !== getSliderConfig(sectionKey).max));
  };



  // ── Return ──────────────────────────────────────────────────────────────
  const sharedProps = {
    allFilterSections, isRangeFilter, getSectionLabel,
    getSectionHasSelection, getSectionSelectionCount,
    renderFilterContent, sortBy, SORT_OPTIONS,
    handleSortChange, getActiveFilterCount, getActiveChips, clearAll,
    openDropdown, setOpenDropdown,
  };

  return isDesktop
    ? <DesktopFilterBar {...sharedProps} filtersLoading={filtersLoading} productFiltersLoading={productFiltersLoading} />
    : <MobileFilterBar {...sharedProps}
      isFilterPanelOpen={isFilterPanelOpen} setIsFilterPanelOpen={setIsFilterPanelOpen}
      isSortPanelOpen={isSortPanelOpen} setIsSortPanelOpen={setIsSortPanelOpen}
      activeMobileFilter={activeMobileFilter} setActiveMobileFilter={setActiveMobileFilter}
      totalResults={totalResults}
    />;
}