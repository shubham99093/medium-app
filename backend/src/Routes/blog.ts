import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import dotenv from "dotenv";
import { createBlogInput, updateBlogInput } from "@shubhampatel/meduim-app";
import { blogMiddleware, upload } from "../middleware";
import { JwtPayload, verify } from "jsonwebtoken";

const blogRoutes = Router();
const prisma = new PrismaClient();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

const handleError = (res: any, status: number, message: string) => {
  console.error(message); // Log the error message
  return res.status(status).json({ message });
};

blogRoutes.post(
  "/",
  blogMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const body = req.body;
      const parsed = createBlogInput.parse(body);
      const authorId = req.headers["userId"] as string;

      let imgBase64: string | undefined;
      if (req.file) {
        imgBase64 = req.file.buffer.toString("base64");
      }

      const blogData = {
        title: parsed.title,
        content: parsed.content,
        authorId: authorId,
        Published: true,
        imgUrl: imgBase64,
      };

      const blog = await prisma.post.create({
        data: blogData,
      });

      return res.json({ blog });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      return handleError(res, 411, errorMessage);
    }
  }
);

blogRoutes.put("/", blogMiddleware, async (req, res) => {
  try {
    const body = req.body;
    const parsed = updateBlogInput.parse(body);
    const blog = await prisma.post.update({
      where: {
        id: parsed.id,
      },
      data: {
        title: parsed.title,
        content: parsed.content,
      },
    });

    if (!blog) {
      return handleError(res, 404, "No blog found");
    }
    return res.json({ message: "Blog Updated Successfully" });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return handleError(res, 411, errorMessage);
  }
});

blogRoutes.delete("/:id", blogMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await prisma.post.delete({
      where: {
        id: id,
      },
    });
    return res.json({ blog });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return handleError(res, 411, errorMessage);
  }
});

blogRoutes.get("/bulk", async (req, res) => {
  try {
    const blogs = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        imgUrl: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            imgUrl: true,
          },
        },
      },
    });

    if (blogs.length === 0) {
      return handleError(res, 404, "No posts found");
    }
    return res.json(blogs);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return handleError(res, 411, errorMessage);
  }
});

blogRoutes.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await prisma.post.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        imgUrl: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            imgUrl: true,
          },
        },
      },
    });

    if (!blog) {
      return handleError(res, 404, "No post found");
    }
    return res.json(blog);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return handleError(res, 411, errorMessage);
  }
});

// Like status endpoint
blogRoutes.get("/:postId/like-status", async (req, res) => {
  try {
    const jwt = req.header("authorization") as string;
    const token = jwt.split(" ")[1];
    try {
      const payload = verify(token, JWT_SECRET) as JwtPayload;
      if (payload.id) {
        req.headers["userId"] = payload.id;
      }
    } catch {}
    const userId = req.headers["userId"] as string;
    const { postId } = req.params;

    // Check if the user has liked the post
    let like = null;
    if (userId) {
      like = await prisma.like.findUnique({
        where: {
          userId_postId: { userId, postId },
        },
      });
    }

    // Get the total number of likes for the post
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    return res.json({ isLiked: !!like, likeCount });
  } catch (error) {
    return handleError(res, 500, "Internal Server Error");
  }
});

// Like a post
blogRoutes.post("/:postId/like", blogMiddleware, async (req, res) => {
  try {
    const userId = req.headers["userId"] as string;
    const { postId } = req.params;

    // Check if the user already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      return handleError(res, 400, "You already liked this post");
    }

    // Create a new like
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return res.status(201).json({ message: "Post liked successfully" });
  } catch (error) {
    return handleError(res, 500, "Internal Server Error");
  }
});

// Unlike a post
blogRoutes.delete("/:postId/like", blogMiddleware, async (req, res) => {
  try {
    const userId = req.headers["userId"] as string;
    const { postId } = req.params;

    // Check if the like exists
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (!like) {
      return handleError(res, 400, "You have not liked this post");
    }

    // Delete the like
    await prisma.like.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });

    return res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    return handleError(res, 500, "Internal Server Error");
  }
});

export default blogRoutes;
