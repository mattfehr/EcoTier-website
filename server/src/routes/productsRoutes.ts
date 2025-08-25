import { Router } from "express";
import { prisma } from "../db/prisma";
import type { Product } from "@shared/types/product";
import type { Prisma } from "@prisma/client";

const router = Router();

type ProductWithCreator = Prisma.ProductGetPayload<{
  include: {
    creator: { select: { id: true; username: true; profileImage: true } };
  };
}>;

// GET /products?sort=price&order=asc
router.get("/", async (req, res) => {
  try {
    const {
      sort = "new",
      order = "desc",
    } = req.query as Record<string, string>;

    let orderBy: any = { createTime: order as "asc" | "desc" };
    if (sort === "price") orderBy = { price: order as "asc" | "desc" };
    if (sort === "updated") orderBy = { updateTime: order as "asc" | "desc" };

    const products: ProductWithCreator[] = await prisma.product.findMany({
      include: {
        creator: {
          select: { id: true, username: true, profileImage: true },
        },
      },
      orderBy,
    });

    const shaped: Product[] = products.map((p) => ({
      id: p.productID,
      name: p.name,
      price: Number(p.price),
      productType: p.productType.toLowerCase() as Product["productType"],
      creator: {
        id: p.creator.id,
        name: p.creator.username,
        profileImage: p.creator.profileImage ?? "https://via.placeholder.com/40x40",
      },
      imageUrl: p.imageURL ?? "https://via.placeholder.com/600x400",
      description: p.description ?? "",
    }));

    res.json(shaped);
  } catch (e) {
    console.error("Error fetching products:", e);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const product = await prisma.product.findUnique({
    where: { productID: id },
    include: {
      creator: {
        select: { id: true, username: true, profileImage: true },
      },
    },
  });

  if (!product) return res.status(404).json({ error: "Not found" });

  const shaped: Product = {
    id: product.productID,
    name: product.name,
    price: Number(product.price),
    productType: product.productType.toLowerCase() as Product["productType"],
    imageUrl: product.imageURL ?? "https://via.placeholder.com/600x400",
    description: product.description ?? "",
    creator: {
      id: product.creator.id,
      name: product.creator.username,
      profileImage: product.creator.profileImage ?? "https://via.placeholder.com/40x40",
    },
  };

  res.json(shaped);
});

export default router;
