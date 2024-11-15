import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "../middleware";
import dotenv from "dotenv";

const prisma = new PrismaClient();
const savedPostRouter = Router();
dotenv.config();

const handleError = (res: Response, message: string, status: number = 500) => {
  console.error(message); // Log the error message
  return res.status(status).json({ message });
};

savedPostRouter.get(
  "/",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.headers["userId"] as string;

      const savedPosts = await prisma.savedPost.findMany({
        where: {
          userId: userId,
        },
        include: {
          post: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (savedPosts.length > 0) {
        return res.json({ savedPosts });
      } else {
        return res.json({ message: "User has no saved posts" });
      }
    } catch (error) {
      return handleError(res, "Failed to retrieve saved posts", 500);
    }
  }
);

savedPostRouter.get(
  "/:postId",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.headers["userId"] as string;
      const { postId } = req.params;

      const savedPost = await prisma.savedPost.findFirst({
        where: {
          userId: userId,
          postId: postId,
        },
      });

      return res.json({ isSaved: !!savedPost });
    } catch (error) {
      return handleError(res, "Failed to check saved post status", 500);
    }
  }
);

savedPostRouter.post(
  "/",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { postId } = req.body;
      const userId = req.headers["userId"] as string;

      const isPostSaved = await prisma.savedPost.findFirst({
        where: {
          userId: userId,
          postId: postId,
        },
      });

      if (isPostSaved) {
        return res.status(400).json({ message: "Post already saved" });
      }

      const savedPost = await prisma.savedPost.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });

      return res
        .status(200)
        .json({ message: "Post saved successfully", savedPost });
    } catch (error) {
      return handleError(res, "Failed to save post", 500);
    }
  }
);

savedPostRouter.delete(
  "/:postId",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const userId = req.headers["userId"] as string;

      const isPostSaved = await prisma.savedPost.findFirst({
        where: {
          userId: userId,
          postId: postId,
        },
      });

      if (!isPostSaved) {
        return res.status(400).json({ message: "Post not saved" });
      }

      await prisma.savedPost.delete({
        where: {
          id: isPostSaved.id,
        },
      });

      return res.status(200).json({ message: "Post unsaved successfully" });
    } catch (error) {
      return handleError(res, "Failed to unsave post", 500);
    }
  }
);

export default savedPostRouter;
