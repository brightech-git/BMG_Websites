import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { resetFilters } from "../../../../redux/slices/filterSlice";
import { formatCurrency, formatWeight } from "../../../../utils/index.js";
import { useGetFilters, useGetProductsFilters } from "../../hooks/product/useFilterProducts";

import { MobileFilterBar } from "../../../../component/filter/MobileFilterBar";
import { DesktopFilterBar } from "../../../../component/filter/DesktopFilterBar";

const PRICE_RANGE = { min: 0, max: 1000, step: 100 };
const WEIGHT_RANGE = { min: 0, max: 1000, step: 1 };

const notSlider = ["discount"];

export const SORT_OPTIONS = [
  { label: "Price – Low to High", value: "priceLowToHigh" },
  { label: "Price – High to Low", value: "priceHighToLow" },
];

const parseIds = (str) =>
  new Set((str || "").split(",").map(Number).filter(Boolean));

const parseValues = (value) => new Set((value || "").split(",").filter(Boolean));

function setParam(query, key, value) {
  if (value) query.set(key, value);
  else query.delete(key);
}

function rangeParam(key) {
  return `${key.charAt(0).toLowerCase()}${key.slice(1)}Range`;
}

export function RangeSlider({ range, applyRange, rangeConfig, isPrice }) {
  const sliderRef = useRef(null);
  const [local, setLocal] = useState(range);
  const [drag, setDrag] = useState(null);

  const latestRange = useRef(range);

  useEffect(() => {
    latestRange.current = range;
    setLocal(range);
  }, [range]);

  const pct = (v) =>
    ((v - rangeConfig.min) / (rangeConfig.max - rangeConfig.min)) * 100;

  const move = useCallback((e) => {
    if (drag === null || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.touches?.[0]?.clientX ?? e.clientX;
    let v =
      rangeConfig.min +
      ((x - rect.left) / rect.width) * (rangeConfig.max - rangeConfig.min);
    v = Math.round(v / rangeConfig.step) * rangeConfig.step;
    v = Math.max(rangeConfig.min, Math.min(v, rangeConfig.max));
    const next = [...latestRange.current];
    if (drag === 0 && v < next[1]) next[0] = v;
    if (drag === 1 && v > next[0]) next[1] = v;
    latestRange.current = next;
    setLocal(next);
  }, [drag, rangeConfig]);

  const end = useCallback(() => {
    setDrag(null);
    applyRange(...latestRange.current);
  }, [applyRange]);

  useEffect(() => {
    if (drag === null) return;
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", end);
    document.addEventListener("touchcancel", end);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
      document.removeEventListener("touchcancel", end);
    };
  }, [drag, move, end]);

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
            onMouseDown={() => setDrag(i)}
            onTouchStart={() => setDrag(i)}
            className="absolute w-5 h-5 bg-white border-2 border-[var(--primary-hover-color)] rounded-full -top-1.5 touch-none cursor-grab active:cursor-grabbing"
            style={{ left: `${pct(local[i])}%`, marginLeft: "-10px" }}
          />
        ))}
      </div>
      <div className="flex justify-between text-sm mt-2 text-gray-600">
        <span>{isPrice ? formatCurrency(local[0]) : formatWeight(local[0])}</span>
        <span>{isPrice ? formatCurrency(local[1]) : formatWeight(local[1])}</span>
      </div>
    </div>
  );
}

export const CheckboxList = ({ items, selectedIds, toggleId, isDesktop }) => (
  <div className={`space-y-1 p-2 ${isDesktop ? "max-h-[200px]" : "min-h-full"} overflow-y-auto`}>
    {items.map((item) => (
      <label
        key={item.id}
        className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-amber-600 py-1 select-none"
      >
        <input
          type="checkbox"
          checked={selectedIds.has(Number(item.id))}
          onChange={() => toggleId(Number(item.id))}
          className="accent-amber-600 w-4 h-4 rounded"
        />
        {item.filterTitle}
      </label>
    ))}
  </div>
);

export const RangeFilterPanel = ({
  filterKey,
  apiFilters,
  rangeMap,
  getSliderConfig,
  handleRangeChange,
}) => {
  const items = apiFilters[filterKey] || [];
  const cfg = getSliderConfig(filterKey);
  const curRange = useMemo(
    () => rangeMap[filterKey] || [cfg.min, cfg.max],
    [rangeMap, filterKey, cfg.min, cfg.max]
  );

  const handleBracketToggle = (item) => {
    const isSelected = curRange[0] === item.min && curRange[1] === item.max;
    handleRangeChange(
      filterKey,
      isSelected ? cfg.min : item.min,
      isSelected ? cfg.max : item.max
    );
  };

  const showSlider = notSlider.includes(filterKey.toLowerCase());

  return (
    <div className="p-3 space-y-3">
      {!showSlider &&
        <RangeSlider
          range={curRange}

          applyRange={(min, max) => handleRangeChange(filterKey, min, max)}
          rangeConfig={cfg}

          isPrice={filterKey.toLowerCase() === "price"}
        />
      }

      {items.length > 0 && (
        <div className="space-y-1 mt-2 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-amber-600 py-1 select-none"
            >
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

export const SizeList = ({ sizeOptions, selectedSize, handleSizeChange, isDesktop }) => (
  <div className={`space-y-1 p-2 ${isDesktop ? "max-h-[200px]" : "min-h-full"} overflow-y-auto`}>
    {sizeOptions.map((size) => (
      <label
        key={size.id}
        className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-amber-600 py-1 select-none"
      >
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

export const SubItemList = ({ subItemOptions, selectedSubItem, handleSubItemChange, isDesktop }) => (
  <div className={`space-y-1 p-2 ${isDesktop ? "max-h-[200px]" : "min-h-full"} overflow-y-auto`}>
    {subItemOptions.map((sub) => (
      <label
        key={sub}
        className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-amber-600 py-1 select-none"
      >
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

export default function ProductFilterBar({ totalResults = 0, resultsLoading, ItemName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 1024px)").matches);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeMobileFilter, setActiveMobileFilter] = useState(null);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);

  const filterContentParam = { isActive: true };

  const { data: rawApiFilters, isLoading: filtersLoading } = useGetFilters(ItemName);
  const { data: productFilters, isLoading: productFiltersLoading } = useGetProductsFilters(filterContentParam);

  const apiFilters = useMemo(() => {
    const cleaned = {};
    for (const [key, items] of Object.entries(productFilters ?? {})) {
      if (!Array.isArray(items)) continue;
      const active = items.filter((item) => item.isActive !== false);
      if (active.length) cleaned[key] = active;
    }
    return cleaned;
  }, [productFilters]);

  const sizeOptions = rawApiFilters?.sizes ?? [];
  const subItemOptions = rawApiFilters?.subItems ?? [];

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

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const selectedIds = useMemo(() => parseIds(params.get("filterIds")), [params]);
  const selectedSize = useMemo(() => parseValues(params.get("sizeName")), [params]);
  const selectedSubItem = useMemo(() => parseValues(params.get("subItemName")), [params]);
  const sortBy = params.get("sortBy") || "";

  const rangeMap = useMemo(() => {
    const ranges = {};
    for (const [key, value] of params) {
      if (!key.endsWith("Range")) continue;
      const name = Object.keys(apiFilters).find(
        (filterKey) => filterKey.toLowerCase() === key.slice(0, -5).toLowerCase()
      );
      const [min, max] = value.split("-").map(Number);
      if (name && Number.isFinite(min) && Number.isFinite(max)) {
        ranges[name] = [min, max];
      }
    }
    return ranges;
  }, [params, apiFilters]);

  function updateURL(editParams) {
    const next = new URLSearchParams(params);
    editParams(next);
    next.delete("page");
    if (next.toString() === params.toString()) return;

    navigate(
      { search: next.toString() },
      { preventScrollReset: true }
    );
  }

  function toggleParam(key, values, value) {
    const next = new Set(values);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    updateURL((query) => setParam(query, key, [...next].join(",")));
  }

  function toggleId(id) {
    toggleParam("filterIds", selectedIds, id);
  }

  function handleSizeChange(size) {
    toggleParam("sizeName", selectedSize, size);
  }

  function handleSubItemChange(category) {
    toggleParam("subItemName", selectedSubItem, category);
  }

  function handleRangeChange(key, min, max) {
    const config = getSliderConfig(key);
    const value = min === config.min && max === config.max ? "" : `${min}-${max}`;
    updateURL((query) => setParam(query, rangeParam(key), value));
  }

  function handleSortChange(value) {
    updateURL((query) => setParam(query, "sortBy", value));
    setOpenDropdown(null);
    setIsSortPanelOpen(false);
  }

  function clearAll() {
    updateURL((query) => {
      for (const key of [...query.keys()]) {
        if (["filterIds", "sizeName", "subItemName", "sortBy"].includes(key) || key.endsWith("Range")) {
          query.delete(key);
        }
      }
    });
    dispatch(resetFilters());
  }

  const getActiveFilterCount = useCallback(() => {
    let count = selectedIds.size;
    Object.entries(rangeMap).forEach(([key, [min, max]]) => {
      const cfg = getSliderConfig(key);
      if (min !== cfg.min || max !== cfg.max) count += 1;
    });
    if (selectedSize.size > 0) count += selectedSize.size;
    if (selectedSubItem.size > 0) count += selectedSubItem.size;
    return count;
  }, [selectedIds, rangeMap, selectedSize, selectedSubItem, getSliderConfig]);

  const getKeySelectionCount = useCallback(
    (key) => {
      if (isRangeFilter(key)) {
        const cfg = getSliderConfig(key);
        const r = rangeMap[key];
        return r && (r[0] !== cfg.min || r[1] !== cfg.max) ? 1 : 0;
      }
      return (apiFilters[key] || []).filter((i) => selectedIds.has(Number(i.id))).length;
    },
    [isRangeFilter, getSliderConfig, rangeMap, apiFilters, selectedIds]
  );

  function getActiveChips() {
    const chips = [];

    Object.entries(apiFilters).forEach(([key, items]) => {
      items.forEach((item) => {
        if (!selectedIds.has(Number(item.id))) return;
        chips.push({
          label: `${key}: ${item.filterTitle}`,
          onRemove: () => toggleId(Number(item.id)),
        });
      });
    });

    Object.entries(rangeMap).forEach(([key, [min, max]]) => {
      const cfg = getSliderConfig(key);
      if (min === cfg.min && max === cfg.max) return;
      const isPrice = key.toLowerCase() === "price";
      chips.push({
        label: `${key}: ${isPrice
          ? `${formatCurrency(min)} – ${formatCurrency(max)}`
          : `${formatWeight(min)} – ${formatWeight(max)}`
        }`,
        onRemove: () => updateURL((query) => query.delete(rangeParam(key))),
      });
    });

    [...selectedSize].forEach((s) => {
      chips.push({ label: `Size: ${s}`, onRemove: () => handleSizeChange(s) });
    });

    [...selectedSubItem].forEach((s) => {
      chips.push({ label: `Category: ${s}`, onRemove: () => handleSubItemChange(s) });
    });

    if (sortBy) {
      chips.push({
        label: `Sort: ${SORT_OPTIONS.find((o) => o.value === sortBy)?.label}`,
        onRemove: () => handleSortChange(""),
        bgColor: "bg-gray-100",
      });
    }

    return chips;
  }

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    function handleBreakpoint(event) {
      setIsDesktop(event.matches);
      setIsFilterPanelOpen(false);
      setIsSortPanelOpen(false);
      setOpenDropdown(null);
    }

    desktop.addEventListener("change", handleBreakpoint);
    return () => desktop.removeEventListener("change", handleBreakpoint);
  }, []);

  const allFilterSections = [
    ...Object.keys(apiFilters),
    ...(sizeOptions.length > 0 ? ["__sizes__"] : []),
    ...(subItemOptions.length > 0 ? ["__subItems__"] : []),
  ];

  function renderFilterContent(sectionKey) {
    if (sectionKey === "__sizes__") {
      return (
        <SizeList
          sizeOptions={sizeOptions}
          selectedSize={selectedSize}
          handleSizeChange={handleSizeChange}
          isDesktop={isDesktop}
        />
      );
    }

    if (sectionKey === "__subItems__") {
      return (
        <SubItemList
          subItemOptions={subItemOptions}
          selectedSubItem={selectedSubItem}
          handleSubItemChange={handleSubItemChange}
          isDesktop={isDesktop}
        />
      );
    }

    if (isRangeFilter(sectionKey)) {
      return (
        <RangeFilterPanel
          filterKey={sectionKey}
          apiFilters={apiFilters}
          rangeMap={rangeMap}
          getSliderConfig={getSliderConfig}
          handleRangeChange={handleRangeChange}
        />
      );
    }

    return (
      <CheckboxList
        items={apiFilters[sectionKey]}
        selectedIds={selectedIds}
        toggleId={toggleId}
        isDesktop={isDesktop}
      />
    );
  }

  const getSectionLabel = (sectionKey) => {
    if (sectionKey === "__sizes__") return "Size";
    if (sectionKey === "__subItems__") return "Category";
    return sectionKey;
  };

  const getSectionSelectionCount = useCallback(
    (sectionKey) => {
      if (sectionKey === "__sizes__") return selectedSize.size;
      if (sectionKey === "__subItems__") return selectedSubItem.size;
      return getKeySelectionCount(sectionKey);
    },
    [selectedSize, selectedSubItem, getKeySelectionCount]
  );

  const getSectionHasSelection = useCallback(
    (sectionKey) => {
      if (sectionKey === "__sizes__") return selectedSize.size > 0;
      if (sectionKey === "__subItems__") return selectedSubItem.size > 0;
      const isRange = isRangeFilter(sectionKey);
      const items = apiFilters[sectionKey] || [];
      return (
        items.some((i) => selectedIds.has(Number(i.id))) ||
        (isRange &&
          rangeMap[sectionKey] &&
          (rangeMap[sectionKey][0] !== getSliderConfig(sectionKey).min ||
            rangeMap[sectionKey][1] !== getSliderConfig(sectionKey).max))
      );
    },
    [selectedSize, selectedSubItem, isRangeFilter, apiFilters, selectedIds, rangeMap, getSliderConfig]
  );

  const sharedProps = {
    allFilterSections,
    isRangeFilter,
    getSectionLabel,
    getSectionHasSelection,
    getSectionSelectionCount,
    renderFilterContent,
    sortBy,
    SORT_OPTIONS,
    handleSortChange,
    getActiveFilterCount,
    getActiveChips,
    clearAll,
    openDropdown,
    setOpenDropdown,
  };

  return isDesktop ? (
    <DesktopFilterBar
      {...sharedProps}
      filtersLoading={filtersLoading}
      productFiltersLoading={productFiltersLoading}
    />
  ) : (
    <MobileFilterBar
      {...sharedProps}
      isFilterPanelOpen={isFilterPanelOpen}
      setIsFilterPanelOpen={setIsFilterPanelOpen}
      isSortPanelOpen={isSortPanelOpen}
      setIsSortPanelOpen={setIsSortPanelOpen}
      activeMobileFilter={allFilterSections.includes(activeMobileFilter)
        ? activeMobileFilter
        : allFilterSections[0]}
      setActiveMobileFilter={setActiveMobileFilter}
      totalResults={totalResults}
      resultsLoading={resultsLoading}
    />
  );
}