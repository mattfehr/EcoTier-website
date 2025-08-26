// src/routes/cartRoute.ts
import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

// ✅ Toggle cart item (add or remove)
router.post("/toggle", async (req, res) => {
  try {
    let { userID, productID, quantity = 1 } = req.body;

    if (!userID || !productID) {
      return res
        .status(400)
        .json({ error: "userID and productID are required" });
    }

    productID = Number(productID);

    const existing = await prisma.cartItem.findUnique({
      where: {
        userID_productID: { userID, productID },
      },
    });

    if (existing) {
      // Remove completely
      await prisma.cartItem.delete({
        where: {
          userID_productID: { userID, productID },
        },
      });
      return res.json({ inCart: false, quantity: 0 });
    } else {
      // Add fresh with given quantity (default 1)
      const created = await prisma.cartItem.create({
        data: { userID, productID, quantity },
      });
      return res.json({ inCart: true, quantity: created.quantity });
    }
  } catch (err) {
    console.error("Error toggling cart:", err);
    res.status(500).json({ error: "Failed to toggle cart" });
  }
});

// ✅ Check if user has a product in their cart
router.get("/:userID/contains/:productID", async (req, res) => {
  try {
    const { userID, productID } = req.params;

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userID_productID: {
          userID,
          productID: Number(productID),
        },
      },
    });

    res.json({
      inCart: !!cartItem,
      quantity: cartItem?.quantity ?? 0,
    });
  } catch (err) {
    console.error("Error checking cart:", err);
    res.status(500).json({ error: "Failed to check cart" });
  }
});

// ✅ Get all product IDs in a user's cart
router.get("/:userID/ids", async (req, res) => {
  try {
    const { userID } = req.params;

    const cartItems = await prisma.cartItem.findMany({
      where: { userID },
      select: { productID: true },
    });

    res.json(cartItems.map((c) => c.productID));
  } catch (err) {
    console.error("Error fetching cart IDs:", err);
    res.status(500).json({ error: "Failed to fetch cart IDs" });
  }
});

// ✅ Get full cart with product objects
router.get("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const cartItems = await prisma.cartItem.findMany({
      where: { userID },
      include: {
        product: {
          include: {
            creator: { select: { id: true, username: true, profileImage: true } },
          },
        },
      },
    });

    // Shape to match Product[] (like favorites does)
    const shaped = cartItems.map((c) => ({
      id: c.product.productID,
      name: c.product.name,
      price: Number(c.product.price),
      productType: c.product.productType.toLowerCase(),
      imageUrl: c.product.imageURL ?? "https://via.placeholder.com/600x400",
      description: c.product.description ?? "",
      creator: {
        id: c.product.creator.id,
        name: c.product.creator.username,
        profileImage:
          c.product.creator.profileImage ??
          "https://via.placeholder.com/40x40",
      },
      quantity: c.quantity,
    }));

    res.json(shaped);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

export default router;
