import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

// Get all comments for a product
router.get("/:productID", async (req, res) => {
  try {
    const productID = Number(req.params.productID);
    if (Number.isNaN(productID)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const comments = await prisma.comment.findMany({
      where: { productID },
      orderBy: { postTime: "desc" },
      include: {
        user: { select: { id: true, username: true, profileImage: true } },
      },
    });

    const shaped = comments.map((c) => ({
      id: c.id,
      userID: c.userID,
      username: c.user.username,
      profileImage: c.user.profileImage ?? "/default-avatar.png",
      content: c.content,
      rating: c.rating,
      postTime: c.postTime.toISOString(),
    }));

    res.json(shaped);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Post a new comment
router.post("/", async (req, res) => {
  try {
    const { userID, productID, content, rating } = req.body;
    if (!userID || !productID || !content) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const safeRating =
      typeof rating === "number" && rating >= 1 && rating <= 5 ? rating : 5;

    const created = await prisma.comment.create({
      data: {
        userID,
        productID: Number(productID),
        content,
        rating: safeRating,
      },
      include: {
        user: { select: { id: true, username: true, profileImage: true } },
      },
    });

    res.status(201).json({
      id: created.id,
      userID: created.userID,
      username: created.user.username,
      profileImage: created.user.profileImage ?? "/default-avatar.png",
      content: created.content,
      rating: created.rating,
      postTime: created.postTime.toISOString(),
    });
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

// Update a comment (owner only)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userID, content, rating } = req.body;

    if (!userID || !content) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const safeRating =
      typeof rating === "number" && rating >= 1 && rating <= 5 ? rating : 5;

    const updated = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content, rating: safeRating },
      include: {
        user: { select: { id: true, username: true, profileImage: true } },
      },
    });

    res.json({
      id: updated.id,
      userID: updated.userID,
      username: updated.user.username,
      profileImage: updated.user.profileImage ?? "/default-avatar.png",
      content: updated.content,
      rating: updated.rating,
      postTime: updated.postTime.toISOString(),
    });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// Delete a comment (owner only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;
