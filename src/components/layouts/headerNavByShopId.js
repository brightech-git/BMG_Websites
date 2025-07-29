const headerNavByShopId = {
  shopId: 2,
  menuSections: [
    {
      label: "Shop by Category",
      items: [
        { name: "Rings", value: "rings", keyName: "itemName", keyValue: "rings", image: "/images/categories/rings.jpg" },
        { name: "Necklaces", value: "necklaces", keyName: "itemName", keyValue: "necklaces", image: "/images/categories/necklaces.jpg" },
        { name: "Bracelets", value: "bracelets", keyName: "itemName", keyValue: "bracelets", image: "/images/categories/bracelets.jpg" },
        { name: "Earrings", value: "earrings", keyName: "itemName", keyValue: "earrings", image: "/images/categories/earrings.jpg" }
      ]
    },
    {
      label: "Shop by Price",
      items: [
        { label: "Under ₹199", keyName: "maxGrandTotal", keyValue: 199, image: "/images/price/199.jpg" },
        { label: "Under ₹299", keyName: "maxGrandTotal", keyValue: 299, image: "/images/price/299.jpg" },
        { label: "Under ₹399", keyName: "maxGrandTotal", keyValue: 399, image: "/images/price/399.jpg" },
        { label: "Under ₹599", keyName: "maxGrandTotal", keyValue: 599, image: "/images/price/599.jpg" }
      ]
    },
    {
      label: "Shop by Gender",
      items: [
        { name: "Men", value: "men", keyName: "gender", keyValue: "men", image: "/images/gender/men.jpg" },
        { name: "Women", value: "women", keyName: "gender", keyValue: "women", image: "/images/gender/women.jpg" },
        { name: "Kids", value: "kids", keyName: "gender", keyValue: "kids", image: "/images/gender/kids.jpg" }
      ]
    },
    {
      label: "Featured Collections",
      items: [
        { name: "Trending", keyName: "top_trending", keyValue: "true", image: "/images/collections/trending.jpg" },
        { name: "New Arrivals", keyName: "new_arrivals", keyValue: "true", image: "/images/collections/new_arrivals.jpg" },
        { name: "Best Designs", keyName: "best_design", keyValue: "true", image: "/images/collections/best_design.jpg" },
        { name: "Featured", keyName: "featured", keyValue: "true", image: "/images/collections/featured.jpg" }
      ]
    },
    {
      label: "Special Editions",
      items: [
        { name: "Bridal", keyName: "itemName", keyValue: "bridal", image: "/images/special/bridal.jpg" },
        { name: "Clearance", keyName: "itemName", keyValue: "clearance", image: "/images/special/clearance.jpg" }
      ]
    },
    {
      label: "Current Offers",
      items: [
        { name: "50% Off", keyName: "subItemName", keyValue: "matching sets", image: "/images/offers/50percent.jpg" },
        { name: "Buy 1 Get 1", keyName: "subItemName", keyValue: "Buy 2 Get 1", image: "/images/offers/b1g1.jpg" }
      ]
    },
    {
      label: "Gift Ideas",
      items: [
        { name: "For Him", keyName: "giftIdeas", keyValue: "for_him", image: "/images/giftIdeas/for_him.jpg" },
        { name: "For Her", keyName: "giftIdeas", keyValue: "for_her", image: "/images/giftIdeas/for_her.jpg" }
      ]
    }
  ]
};

export default headerNavByShopId;
