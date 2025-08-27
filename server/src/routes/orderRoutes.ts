// src/routes/ordersRoute.ts
import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

// Place order (checkout)
router.post("/checkout", async (req, res) => {
  try {
    const { userID, fullName, address } = req.body;

    if (!userID || !fullName || !address) {
      return res
        .status(400)
        .json({ error: "userID, fullName, and address are required" });
    }

    // Get cart items for this user
    const cartItems = await prisma.cartItem.findMany({
      where: { userID },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total price
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        customerID: userID,
        fullName,            // ✅ save full name
        address,
        totalPrice,
        paymentStatus: "pending", // ✅ default status
        transactionID: null,      // ✅ placeholder for Stripe/PayPal later
        orderItems: {
          create: cartItems.map((item) => ({
            productID: item.productID,
            quantity: item.quantity,
            priceAtPurchase: Math.round(item.product.price),
          })),
        },
      },
      include: { orderItems: true },
    });

    // Clear cart after checkout
    await prisma.cartItem.deleteMany({
      where: { userID },
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

export default router;
