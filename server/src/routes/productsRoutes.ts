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
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { userID } = req.query as { userID?: string };

  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const product = await prisma.product.findFirst({
    where: {
      productID: id,
      OR: [
        { public: true },
        ...(userID ? [{ creatorID: userID }] : []),
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

// ========== CREATE PRODUCT ==========
router.post("/", async (req, res) => {
  try {
    const { userID, name, productType, price, ...rest } = req.body;

    if (!userID) return res.status(401).json({ error: "Missing userID" });
    if (!name || !productType || price == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        productType,
        price: Number(price),
        creatorID: userID,
        ...rest,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// ========== UPDATE PRODUCT ==========
router.put("/:id", async (req, res) => {
  try {
    const { userID, ...updates } = req.body;
    if (!userID) return res.status(401).json({ error: "Missing userID" });

    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const existing = await prisma.product.findUnique({ where: { productID: id } });
    if (!existing) return res.status(404).json({ error: "Product not found" });
    if (existing.creatorID !== userID) return res.status(403).json({ error: "Forbidden" });

    const updated = await prisma.product.update({
      where: { productID: id },
      data: {
        ...updates,
        price: updates.price != null ? Number(updates.price) : undefined,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("PUT /products/:id error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

export default router;
