import express from "express";
import { getRecommendationsForUser } from "../services/recommendService.js";
import { generateExplanation } from "../services/llmService.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const { products, userStats } = await getRecommendationsForUser(userId);

    if (!products || products.length === 0) {
      return res.json({
        userId,
        recommended: [],
        explanation: "We couldn't find any recommendations yet. Try browsing some products!"
      });
    }

    let explanation = "No explanation available.";
    if (userStats) {
      explanation = await generateExplanation(userId, products, userStats);
    }

    res.json({
      userId,
      recommended: products,
      explanation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error generating recommendation" });
  }
});

export default router;
