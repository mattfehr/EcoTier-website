import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

// Add to cart (or increase quantity if already exists)
router.post("/", async (req, res) => {
  const { userID, productID, quantity = 1 } = req.body;
  try {
    const existing = await prisma.cartItem.findUnique({
      where: {
        userID_productID: { userID, productID },
      },
    });

    let cartItem;
    if (existing) {
      cartItem = await prisma.cartItem.update({
        where: {
          userID_productID: { userID, productID },
        },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userID, productID, quantity },
      });
    }

    res.json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Update quantity directly
router.put("/", async (req, res) => {
  const { userID, productID, quantity } = req.body;
  try {
    const cartItem = await prisma.cartItem.update({
      where: {
        userID_productID: { userID, productID },
      },
      data: { quantity },
    });
    res.json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// Remove from cart
router.delete("/", async (req, res) => {
  const { userID, productID } = req.body;
  try {
    await prisma.cartItem.delete({
      where: {
        userID_productID: { userID, productID },
      },
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

// Get all items in a user's cart
router.get("/:userID", async (req, res) => {
  const { userID } = req.params;
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userID },
      include: { product: true },
    });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

export default router;
