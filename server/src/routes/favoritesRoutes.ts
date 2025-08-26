// src/routes/favoritesRoute.ts
import { Router } from "express";
import { prisma } from "../db/prisma";
import type { Product } from "@shared/types/product";

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

// Get all favorites for a user
router.get("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const favorites = await prisma.favorite.findMany({
      where: { userID },
      include: {
        product: {
          include: {
            creator: { select: { id: true, username: true, profileImage: true } },
          },
        },
      },
    });

    const shaped: Product[] = favorites.map((f) => ({
      id: f.product.productID,
      name: f.product.name,
      price: Number(f.product.price),
      productType: f.product.productType.toLowerCase() as Product["productType"],
      imageUrl: f.product.imageURL ?? "https://via.placeholder.com/600x400",
      description: f.product.description ?? "",
      creator: {
        id: f.product.creator.id,
        name: f.product.creator.username,
        profileImage:
          f.product.creator.profileImage ??
          "https://via.placeholder.com/40x40",
      },
    }));

    res.json(shaped);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});


export default router;
