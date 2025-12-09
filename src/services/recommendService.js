import { Product } from "../models/Product.js";
import { UserEvent } from "../models/UserEvent.js";

export const getRecommendationsForUser = async (userId) => {
  // 1. Get all events for this user
  const events = await UserEvent.find({ userId }).populate("product");

  if (events.length === 0) {
    // If no history, just return top rated products
    const products = await Product.find().sort({ rating: -1 }).limit(5);
    return { products, userStats: null };
  }

  const categoryCounts = {};
  const eventCounts = { view: 0, cart: 0, purchase: 0 };

  for (const e of events) {
    const cat = e.product.category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    eventCounts[e.type] = (eventCounts[e.type] || 0) + 1;
  }

  // 2. Find favorite category
  const favCategory = Object.keys(categoryCounts).sort(
    (a, b) => categoryCounts[b] - categoryCounts[a]
  )[0];

  // 3. Get products from favorite category (exclude already purchased if you want)
  const recommendedProducts = await Product.find({ category: favCategory })
    .sort({ rating: -1 })
    .limit(5);

  return {
    products: recommendedProducts,
    userStats: {
      categoryCounts,
      eventCounts,
      favCategory
    }
  };
};
