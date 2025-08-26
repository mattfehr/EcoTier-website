// src/routes/favoritesRoute.ts
import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

// Toggle favorite
router.post("/toggle", async (req, res) => {
  try {
    const { userID, productID } = req.body;

    if (!userID || !productID) {
      return res.status(400).json({ error: "userID and productID are required" });
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userID_productID: {
          userID,
          productID,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: {
          userID_productID: {
            userID,
            productID,
          },
        },
      });
      return res.json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: { userID, productID },
      });
      return res.json({ favorited: true });
    }
  } catch (err) {
    console.error("Error toggling favorite:", err);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
});

// Get all favorites for a user
router.get("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const favorites = await prisma.favorite.findMany({
      where: { userID },
      include: {
        product: { include: { creator: true } },
      },
    });

    res.json(favorites.map((f) => f.product));
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// ✅ Check if user has favorited a specific product
router.get("/:userID/contains/:productID", async (req, res) => {
  try {
    const { userID, productID } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userID_productID: {
          userID,
          productID: Number(productID),
        },
      },
    });

    res.json({ favorited: !!favorite });
  } catch (err) {
    console.error("Error checking favorite:", err);
    res.status(500).json({ error: "Failed to check favorite" });
  }
});

export default router;
