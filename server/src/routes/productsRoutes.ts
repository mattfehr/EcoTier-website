// src/routes/productsRoute.ts
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

// ========== SHOP PRODUCTS ==========
// GET /products?sort=price&order=asc
// Always returns public products
router.get("/", async (req, res) => {
  try {
    const { sort = "new", order = "desc" } = req.query as Record<string, string>;

    let orderBy: any = { createTime: order as "asc" | "desc" };
    if (sort === "price") orderBy = { price: order as "asc" | "desc" };
    if (sort === "updated") orderBy = { updateTime: order as "asc" | "desc" };

    const products: ProductWithCreator[] = await prisma.product.findMany({
      where: { public: true },
      include: {
        creator: { select: { id: true, username: true, profileImage: true } },
      },
      orderBy,
    });

    const shaped: Product[] = products.map((p) => ({
      productID: p.productID,
      name: p.name,
      price: Number(p.price),
      productType: p.productType.toLowerCase() as Product["productType"],
      creatorID: p.creatorID,
      creator: {
        id: p.creator.id,
        username: p.creator.username,
        profileImage: p.creator.profileImage ?? "https://via.placeholder.com/40x40",
      },
      imageURL: p.imageURL ?? "https://via.placeholder.com/600x400",
      description: p.description ?? "",
      public: p.public,
      createTime: p.createTime.toISOString(),
      updateTime: p.updateTime.toISOString(),
      PIN: p.PIN ?? undefined,
    }));

    res.json(shaped);
  } catch (e) {
    console.error("Error fetching products:", e);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ========== USER LIBRARY ==========
// GET /products/library/:userID
// Returns ALL products by this user (public + private)
router.get("/library/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const products: ProductWithCreator[] = await prisma.product.findMany({
      where: { creatorID: userID },
      include: {
        creator: { select: { id: true, username: true, profileImage: true } },
      },
      orderBy: { updateTime: "desc" },
    });

    const shaped: Product[] = products.map((p) => ({
      productID: p.productID,
      name: p.name,
      price: Number(p.price),
      productType: p.productType.toLowerCase() as Product["productType"],
      creatorID: p.creatorID,
      creator: {
        id: p.creator.id,
        username: p.creator.username,
        profileImage: p.creator.profileImage ?? "https://via.placeholder.com/40x40",
      },
      imageURL: p.imageURL ?? "https://via.placeholder.com/600x400",
      description: p.description ?? "",
      public: p.public,
      createTime: p.createTime.toISOString(),
      updateTime: p.updateTime.toISOString(),
      PIN: p.PIN ?? undefined,
    }));

    res.json(shaped);
  } catch (e) {
    console.error("Error fetching user library:", e);
    res.status(500).json({ error: "Failed to fetch user library" });
  }
});

// ========== INDIVIDUAL PRODUCT ==========
// GET /products/:id?userID=uuid
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { userID } = req.query as { userID?: string };

  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const product = await prisma.product.findFirst({
    where: {
      productID: id,
      OR: [
        { public: true },
        ...(userID ? [{ creatorID: userID }] : []), // allow if user owns it
      ],
    },
    include: {
      creator: { select: { id: true, username: true, profileImage: true } },
    },
  });

  if (!product) return res.status(404).json({ error: "Not found" });

  const shaped: Product = {
    productID: product.productID,
    name: product.name,
    price: Number(product.price),
    productType: product.productType.toLowerCase() as Product["productType"],
    creatorID: product.creatorID,
    creator: {
      id: product.creator.id,
      username: product.creator.username,
      profileImage: product.creator.profileImage ?? "https://via.placeholder.com/40x40",
    },
    imageURL: product.imageURL ?? "https://via.placeholder.com/600x400",
    description: product.description ?? "",
    public: product.public,
    createTime: product.createTime.toISOString(),
    updateTime: product.updateTime.toISOString(),
    PIN: product.PIN ?? undefined,
  };

  res.json(shaped);
});

export default router;
