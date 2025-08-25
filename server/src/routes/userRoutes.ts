import { Router } from "express";
import { prisma } from "../db/prisma";
import type { UserPublicProfile } from "@shared/types/user";
import type { Prisma } from "@prisma/client";

const router = Router();

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    products: true;
    favorites: {
      include: {
        product: {
          include: {
            creator: {
              select: { id: true; username: true; profileImage: true };
            };
          };
        };
      };
    };
  };
}>;

// GET /users/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user: UserWithRelations | null = await prisma.user.findUnique({
      where: { id },
      include: {
        products: true,
        favorites: {
          include: {
            product: {
              include: {
                creator: {
                  select: { id: true, username: true, profileImage: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const shaped: UserPublicProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      createTime: user.createTime.toISOString(),
      profileImage: user.profileImage ?? "https://via.placeholder.com/40x40",
      bio: user.bio ?? "",

      products: user.products.map((p) => ({
        id: p.productID,
        name: p.name,
        price: Number(p.price),
        productType: p.productType.toLowerCase() as any,
        imageUrl: p.imageURL ?? "https://via.placeholder.com/600x400",
        description: p.description ?? "",
        creator: {
          id: user.id,
          name: user.username,
          profileImage: user.profileImage ?? "https://via.placeholder.com/40x40",
        },
      })),

      favorites: user.favorites.map((f) => {
        const p = f.product;
        return {
          id: p.productID,
          name: p.name,
          price: Number(p.price),
          productType: p.productType.toLowerCase() as any,
          imageUrl: p.imageURL ?? "https://via.placeholder.com/600x400",
          description: p.description ?? "",
          creator: {
            id: p.creator.id,
            name: p.creator.username,
            profileImage: p.creator.profileImage ?? "https://via.placeholder.com/40x40",
          },
        };
      }),
    };

    res.json(shaped);
  } catch (e) {
    console.error("Error fetching user:", e);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
