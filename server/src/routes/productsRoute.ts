// src/routes/productsRoute.ts
import { Router } from "express";
import { prisma } from "../db/prisma";
import type { Product } from "@shared/types/product";
import type { Prisma } from "@prisma/client";

const router = Router();

// Prisma type for query result (includes creator fields we select)
type ProductWithCreator = Prisma.ProductGetPayload<{
  include: {
    creator: { select: { id: true; username: true; profileImage: true } };
  };
}>;

router.get("/", async (_req, res) => {
  try {
    const products: ProductWithCreator[] = await prisma.product.findMany({
      include: {
        creator: {
          select: { id: true, username: true, profileImage: true }
        }
      },
      orderBy: { createTime: "desc" }
    });

    const shaped: Product[] = products.map((p) => ({
      id: p.productID,
      name: p.name,
      price: Number(p.price),
      productType: p.productType.toLowerCase() as Product["productType"],
      creator: {
        id: p.creator.id,
        name: p.creator.username,
        profileImage:
          p.creator.profileImage ?? "https://via.placeholder.com/40x40"
      },
      imageUrl: p.imageURL ?? "https://via.placeholder.com/600x400"
    }));

    res.json(shaped);
  } catch (e) {
    console.error("Error fetching products:", e);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
