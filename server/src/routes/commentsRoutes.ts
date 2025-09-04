import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

// Get all comments for a product
router.get("/:productID", async (req, res) => {
  try {
    const productID = Number(req.params.productID);
    if (Number.isNaN(productID)) return res.status(400).json({ error: "Invalid product ID" });

    const comments = await prisma.comment.findMany({
      where: { productID },
      orderBy: { postTime: "desc" },
      include: {
        user: { select: { id: true, username: true, profileImage: true } },
      },
    });

    const shaped = comments.map((c) => ({
      id: `${c.userID}-${c.productID}-${c.postTime.getTime()}`,
      userID: c.userID,
      username: c.user.username,
      profileImage: c.user.profileImage ?? "/default-avatar.png",
      content: c.content,
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
    const { userID, productID, content } = req.body;
    if (!userID || !productID || !content) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const created = await prisma.comment.create({
      data: {
        userID,
        productID,
        content,
      },
      include: {
        user: { select: { id: true, username: true, profileImage: true } },
      },
    });

    res.status(201).json({
      id: `${created.userID}-${created.productID}-${created.postTime.getTime()}`,
      userID: created.userID,
      username: created.user.username,
      profileImage: created.user.profileImage ?? "/default-avatar.png",
      content: created.content,
      postTime: created.postTime.toISOString(),
    });
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

// (Optional) Delete a comment (only if owner)
router.delete("/:productID/:userID", async (req, res) => {
  try {
    const { productID, userID } = req.params;
    await prisma.comment.delete({
      where: { userID_productID: { userID, productID: Number(productID) } },
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;
