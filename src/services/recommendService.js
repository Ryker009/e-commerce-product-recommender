import { Product } from "../models/Product.js";
import { UserEvent } from "../models/UserEvent.js";

export const getRecommendationsForUser = async (userId) => {
  const events = await UserEvent.find({ userId }).populate("product");

  if (events.length === 0) {
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

  const favCategory = Object.keys(categoryCounts).sort(
    (a, b) => categoryCounts[b] - categoryCounts[a]
  )[0];

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
