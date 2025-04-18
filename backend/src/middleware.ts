import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

// Define constants for status codes
const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  LENGTH_REQUIRED: 411,
};

interface JwtPayload {
  id?: string;
}

// Common middleware for JWT verification
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const jwt = req.header("authorization");
  if (!jwt) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: "You are not logged in" });
  }

  const token = jwt.split(" ")[1];
  try {
    const payload = verify(token, JWT_SECRET) as JwtPayload;
    if (payload.id) {
      req.headers["userId"] = payload.id;
      return next();
    } else {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: "Unauthorized" });
    }
  } catch (err) {
    return res
      .status(HTTP_STATUS.LENGTH_REQUIRED)
      .json({ message: "Invalid token" });
  }
};

// Middleware for blog routes
export const blogMiddleware = verifyToken;

// Middleware for user routes
export const userMiddleware = verifyToken;

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  },
});
