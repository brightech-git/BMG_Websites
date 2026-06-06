import { useHeaderData } from "../../hook/header/useNavData";

const useHeaderNavByShopId = () => {
  const { data: NavData } = useHeaderData();

  const fallbackNavData = {
    shopId: 2,
    menuSections: [
      {
        label: "Shop by Category",
        items: [
          { name: "Rings", value: "rings", keyName: "ItemName", keyValue: "rings", image: "/images/categories/rings.jpg" },
          { name: "Necklaces", value: "necklaces", keyName: "ItemName", keyValue: "necklaces", image: "/images/categories/necklaces.jpg" },
          { name: "Bracelets", value: "bracelets", keyName: "ItemName", keyValue: "bracelets", image: "/images/categories/bracelets.jpg" },
          { name: "Earrings", value: "earrings", keyName: "ItemName", keyValue: "earrings", image: "/images/categories/earrings.jpg" },
        ],
      },
      {
        label: "Shop by Price",
        items: [
          { label: "Under ₹199", keyName: "maxGrandTotal", keyValue: 199, image: "/images/price/199.jpg" },
          { label: "Under ₹299", keyName: "maxGrandTotal", keyValue: 299, image: "/images/price/299.jpg" },
          { label: "Under ₹399", keyName: "maxGrandTotal", keyValue: 399, image: "/images/price/399.jpg" },
          { label: "Under ₹599", keyName: "maxGrandTotal", keyValue: 599, image: "/images/price/599.jpg" },
        ],
      },
      {
        label: "Shop by Gender",
        items: [
          { name: "Men", value: "men", keyName: "gender", keyValue: "men", image: "/images/gender/men.jpg" },
          { name: "Women", value: "women", keyName: "gender", keyValue: "women", image: "/images/gender/women.jpg" },
          { name: "Kids", value: "kids", keyName: "gender", keyValue: "kids", image: "/images/gender/kids.jpg" },
        ],
      },
      {
        label: "Featured Collections",
        items: [
          { name: "Trending", keyName: "top_trending", keyValue: "true", image: "/images/collections/trending.jpg" },
          { name: "New Arrivals", keyName: "new_arrivals", keyValue: "true", image: "/images/collections/new_arrivals.jpg" },
          { name: "Best Designs", keyName: "best_design", keyValue: "true", image: "/images/collections/best_design.jpg" },
          { name: "Featured", keyName: "featured", keyValue: "true", image: "/images/collections/featured.jpg" },
        ],
      },
      {
        label: "Special Editions",
        items: [
          { name: "Bridal", keyName: "ItemName", keyValue: "bridal", image: "/images/special/bridal.jpg" },
          { name: "Clearance", keyName: "ItemName", keyValue: "clearance", image: "/images/special/clearance.jpg" },
        ],
      },
      {
        label: "Current Offers",
        items: [
          { name: "50% Off", keyName: "subItemName", keyValue: "matching sets", image: "/images/offers/50percent.jpg" },
          { name: "Buy 1 Get 1", keyName: "subItemName", keyValue: "Buy 2 Get 1", image: "/images/offers/b1g1.jpg" },
        ],
      },
    ],
  };

  return NavData || fallbackNavData;
};

export default useHeaderNavByShopId;
