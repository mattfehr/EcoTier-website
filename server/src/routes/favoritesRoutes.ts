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

// ✅ Get all favorite product IDs for a user
router.get("/:userID/ids", async (req, res) => {
  try {
    const { userID } = req.params;

    const favorites = await prisma.favorite.findMany({
      where: { userID },
      select: { productID: true },
    });

    res.json(favorites.map((f) => f.productID));
  } catch (err) {
    console.error("Error fetching favorite IDs:", err);
    res.status(500).json({ error: "Failed to fetch favorite IDs" });
  }
});

// Get all favorites for a user (full Product objects)
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
      productID: f.product.productID,
      name: f.product.name,
      price: Number(f.product.price),
      productType: f.product.productType.toLowerCase() as Product["productType"],
      imageURL: f.product.imageURL ?? "https://via.placeholder.com/600x400",
      description: f.product.description ?? "",
      public: f.product.public,
      createTime: f.product.createTime.toISOString(),
      updateTime: f.product.updateTime.toISOString(),
      PIN: f.product.PIN ?? undefined,
      creatorID: f.product.creatorID,
      creator: {
        id: f.product.creator.id,
        username: f.product.creator.username,
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
