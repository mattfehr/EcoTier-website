import { Router } from "express";
import { prisma } from "../db/prisma";
import type { UserPublicProfile } from "@shared/types/user";
import type { Product } from "@shared/types/product";
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

      products: user.products.map<Product>((p) => ({
        productID: p.productID,
        name: p.name,
        price: Number(p.price),
        productType: p.productType.toLowerCase() as Product["productType"],
        imageURL: p.imageURL ?? "https://via.placeholder.com/600x400",
        description: p.description ?? "",
        public: p.public,
        createTime: p.createTime.toISOString(),
        updateTime: p.updateTime.toISOString(),
        PIN: p.PIN ?? undefined,
        creatorID: p.creatorID,
        creator: {
          id: user.id,
          username: user.username,
          profileImage: user.profileImage ?? "https://via.placeholder.com/40x40",
        },
      })),

      favorites: user.favorites.map<Product>((f) => {
        const p = f.product;
        return {
          productID: p.productID,
          name: p.name,
          price: Number(p.price),
          productType: p.productType.toLowerCase() as Product["productType"],
          imageURL: p.imageURL ?? "https://via.placeholder.com/600x400",
          description: p.description ?? "",
          public: p.public,
          createTime: p.createTime.toISOString(),
          updateTime: p.updateTime.toISOString(),
          PIN: p.PIN ?? undefined,
          creatorID: p.creatorID,
          creator: {
            id: p.creator.id,
            username: p.creator.username,
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

// GET /users/:id/following
router.get("/:id/following", async (req, res) => {
  const { id } = req.params;

  try {
    const follows = await prisma.follow.findMany({
      where: { followerID: id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    const shaped = follows.map((f) => ({
      id: f.following.id,
      username: f.following.username,
      profileImage: f.following.profileImage ?? "https://via.placeholder.com/40x40",
    }));

    res.json(shaped);
  } catch (e) {
    console.error("Error fetching following:", e);
    res.status(500).json({ error: "Failed to fetch following list" });
  }
});

// POST /users/:id/follow
router.post("/:id/follow", async (req, res) => {
  const { id: targetId } = req.params;
  const { userId } = req.body;

  if (targetId === userId) {
    return res.status(400).json({ error: "Cannot follow yourself" });
  }

  try {
    await prisma.follow.create({
      data: {
        followerID: userId,
        followingID: targetId,
      },
    });

    res.status(201).json({ message: "Followed successfully" });
  } catch (e) {
    console.error("Error following user:", e);
    res.status(500).json({ error: "Failed to follow user" });
  }
});

// DELETE /users/:id/follow
router.delete("/:id/follow", async (req, res) => {
  const { id: targetId } = req.params;
  const { userId } = req.body;

  try {
    await prisma.follow.delete({
      where: {
        followerID_followingID: {
          followerID: userId,
          followingID: targetId,
        },
      },
    });

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (e) {
    console.error("Error unfollowing user:", e);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
});

export default router;
