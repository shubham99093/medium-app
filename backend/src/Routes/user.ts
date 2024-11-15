import { signupInput, signinInput } from "@shubhampatel/meduim-app";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
import { Router, Response } from "express";
import { userMiddleware, upload } from "../middleware";
import { z } from "zod";

// Configuration
const userRoutes = Router();
dotenv.config();
const prisma = new PrismaClient();

// Environment variable
const JWT_SECRET = process.env.JWT_SECRET || "";

// Define constants for status codes
const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  LENGTH_REQUIRED: 411,
};

// Utility function for error handling
const handleError = (res: Response, status: number, message: string) => {
  console.error(message); // Log the error message
  return res.status(status).json({ message });
};

// Welcome message
userRoutes.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Sign up route
userRoutes.post("/signup", async (req, res) => {
  try {
    const parsed = signupInput.parse(req.body);
    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email.toLowerCase(),
        password: parsed.password,
      },
    });

    const token = sign({ id: user.id }, JWT_SECRET);
    return res.json({ jwt: token });
  } catch (err) {
    const errorMessage =
      (err as Error).message || "An unexpected error occurred.";
    return handleError(res, HTTP_STATUS.BAD_REQUEST, errorMessage);
  }
});

// Sign in route
userRoutes.post("/signin", async (req, res) => {
  try {
    const parsed = signinInput.parse(req.body);
    const user = await prisma.user.findUnique({
      where: {
        email: parsed.email,
      },
    });

    if (!user || user.password !== parsed.password) {
      return handleError(
        res,
        HTTP_STATUS.FORBIDDEN,
        "User Not Found or Incorrect Password"
      );
    }

    const token = sign({ id: user.id }, JWT_SECRET);
    return res.json({ jwt: token });
  } catch (err) {
    const errorMessage =
      (err as Error).message || "An unexpected error occurred.";
    return handleError(res, HTTP_STATUS.BAD_REQUEST, errorMessage);
  }
});

// User update input schema
const userUpdateInput = z.object({
  name: z.string().min(3).max(30),
  bio: z.string().optional(),
});

// User update route
userRoutes.put("/update", userMiddleware, async (req, res) => {
  try {
    const parsed = userUpdateInput.parse(req.body);
    const userId = req.headers["userId"] as string;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.name,
        bio: parsed.bio,
      },
    });
    return res.json({ message: "User updated successfully" });
  } catch (err) {
    const errorMessage =
      (err as Error).message || "An unexpected error occurred.";
    return handleError(res, HTTP_STATUS.BAD_REQUEST, errorMessage);
  }
});

// Auth route
userRoutes.post("/auth", userMiddleware, async (req, res) => {
  try {
    const userId = req.headers["userId"] as string;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, imgUrl: true, bio: true },
    });

    if (!user) {
      return handleError(res, HTTP_STATUS.NOT_FOUND, "Unauthorized");
    }
    return res.json(user);
  } catch (err) {
    return handleError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Error"
    );
  }
});

// Image upload route
userRoutes.put(
  "/upload",
  userMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (req.file) {
        const userId = req.headers["userId"] as string;
        const user = await prisma.user.update({
          where: { id: userId },
          data: { imgUrl: `/images/${req.file.filename}` },
        });
        if (!user) {
          return handleError(res, HTTP_STATUS.NOT_FOUND, "Unauthorized");
        }
        return res.json({
          url: `/images/${req.file.filename}`,
          message: "File is uploaded",
        });
      }
      return handleError(res, HTTP_STATUS.BAD_REQUEST, "File is not uploaded");
    } catch (err) {
      console.log(err);
      const errorMessage =
        (err as Error).message || "An unexpected error occurred.";
      return handleError(res, HTTP_STATUS.BAD_REQUEST, errorMessage);
    }
  }
);

// Remove image route
userRoutes.delete("/removeImage", userMiddleware, async (req, res) => {
  try {
    const userId = req.headers["userId"] as string;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { imgUrl: "/images/profile.jpg" },
    });
    if (!user) {
      return handleError(res, HTTP_STATUS.NOT_FOUND, "Unauthorized");
    }
    return res.json({ message: "Image removed successfully" });
  } catch (err) {
    return handleError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Error"
    );
  }
});

// Bulk user route
userRoutes.get("/bulk", userMiddleware, async (req, res) => {
  try {
    const userId = req.headers["userId"] as string;
    const usersData = await prisma.user.findMany({
      select: { id: true, name: true, email: true, imgUrl: true, bio: true },
    });
    const users = usersData.filter((user) => user.id !== userId);
    return res.json({ users });
  } catch (error) {
    return handleError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }
});

// User posts route
userRoutes.get("/posts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: { author: { select: { id: true, name: true } } },
    });

    if (posts.length > 0) {
      return res.json({ posts });
    } else {
      return res.json({ message: "No posts found for this user." });
    }
  } catch (error) {
    return handleError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }
});

// Get user by ID route
userRoutes.get("/:id", userMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return handleError(res, HTTP_STATUS.NOT_FOUND, "User not found");
    }
    return res.json(user);
  } catch (err) {
    return handleError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Error"
    );
  }
});

export default userRoutes;
