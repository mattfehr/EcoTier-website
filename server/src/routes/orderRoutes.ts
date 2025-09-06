// src/routes/ordersRoute.ts
import { Router } from "express";
import { prisma } from "../db/prisma";
import type { Product } from "@shared/types/product";

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

    // Get cart items
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

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total price
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        customerID: userID,
        fullName,
        address,
        totalPrice,
        paymentStatus: "pending",
        transactionID: null,
        orderItems: {
          create: cartItems.map((item) => ({
            productID: item.productID,
            quantity: item.quantity,
            priceAtPurchase: Number(item.product.price),
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // Clear cart after checkout
    await prisma.cartItem.deleteMany({
      where: { userID },
    });

    // Shape response with Product[] so frontend matches everywhere else
    const products: (Product & { quantity: number; priceAtPurchase: number })[] =
      cartItems.map((c) => ({
        productID: c.product.productID,
        name: c.product.name,
        price: Number(c.product.price),
        productType: c.product.productType.toLowerCase() as Product["productType"],
        imageURL: c.product.imageURL ?? "https://via.placeholder.com/600x400",
        description: c.product.description ?? "",
        public: c.product.public,
        createTime: c.product.createTime.toISOString(),
        updateTime: c.product.updateTime.toISOString(),
        PIN: c.product.PIN ?? undefined,
        creatorID: c.product.creatorID,
        creator: {
          id: c.product.creator.id,
          username: c.product.creator.username,
          profileImage:
            c.product.creator.profileImage ?? "https://via.placeholder.com/40x40",
        },
        quantity: c.quantity,
        priceAtPurchase: Number(c.product.price),
      }));

    res.json({ success: true, orderID: order.orderNumber, totalPrice, products });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

export default router;
