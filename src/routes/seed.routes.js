import express from "express";
import { Product } from "../models/Product.js";
import { UserEvent } from "../models/UserEvent.js";

const router = express.Router();

router.post("/", async (_req, res) => {
  try {
    await Product.deleteMany({});
    await UserEvent.deleteMany({});

    const products = await Product.insertMany([
      { name: "Running Shoes", category: "Sports", price: 2000, tags: ["shoes", "fitness"], rating: 4.5 },
      { name: "Football", category: "Sports", price: 600, tags: ["football", "outdoor"], rating: 4.2 },
      { name: "Cricket Bat", category: "Sports", price: 1500, tags: ["cricket"], rating: 4.7 },
      { name: "Gaming Mouse", category: "Electronics", price: 1200, tags: ["gaming"], rating: 4.3 },
      { name: "Laptop Bag", category: "Accessories", price: 1000, tags: ["bag"], rating: 4.0 },
      { name: "Wireless Headphones", category: "Electronics", price: 2500, tags: ["audio"], rating: 4.6 }
    ]);

    const userId = "user123";

    // Simulate user123 behaviour: mostly Sports
    await UserEvent.insertMany([
      { userId, product: products[0]._id, type: "view" },
      { userId, product: products[1]._id, type: "view" },
      { userId, product: products[1]._id, type: "purchase" },
      { userId, product: products[2]._id, type: "view" },
      { userId, product: products[3]._id, type: "view" }
    ]);

    res.json({
      message: "Seeded products and events for user123",
      userId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error seeding data" });
  }
});

export default router;
