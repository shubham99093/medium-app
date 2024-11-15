import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./Routes/user";
import blogRoutes from "./Routes/blog";
import savedPostRouter from "./Routes/savedPost";

dotenv.config();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "https://medium-app-seven.vercel.app", // or '*'
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // if you need to send cookies or authentication headers
};
// Middleware setup

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", async (req, res) => {
  return res.send("Hello, Welcome to my App");
});

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/saved-posts", savedPostRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
