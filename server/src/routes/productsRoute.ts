import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

// GET /products
router.get("/", async (_req, res) => {
  try {
    const products = await prisma.products.findMany({
      include: {
        creator: {
          select: { id: true, username: true, profileImage: true }
        }
      },
      orderBy: { createTime: "desc" }
    });

    // shape to match your ProductCard + Shop expectations
    const shaped = products.map((p) => ({
      id: p.productID,
      name: p.name,
      price: Number(p.price),
      productType: p.productType.toLowerCase(),
      creator: {
        id: p.creator.id,
        name: p.creator.username,
        profileImage: p.creator.profileImage ?? "https://via.placeholder.com/40x40"
      },
      imageUrl: p.imageURL ?? "https://via.placeholder.com/600x400"
    }));

    res.json(shaped);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
