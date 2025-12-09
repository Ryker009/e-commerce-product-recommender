import express from "express";
import { UserEvent } from "../models/UserEvent.js";
import { Product } from "../models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, productId, type } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const event = await UserEvent.create({
      userId,
      product,
      type,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  const events = await UserEvent.find({ userId: req.params.userId }).populate("product");
  res.json(events);
});

export default router;
