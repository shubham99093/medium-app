import { z, ZodError } from "zod";

export const signupInput = z.object({
  name: z.string(),
  email: z.string().email({ message: "Please Enter valid email" }),
  password: z
    .string({ message: "add password" })
    .min(8, { message: "minimum add 8 charecter" }),
});

export const signinInput = z.object({
  email: z.string().email({ message: "Please Enter valid email" }),
  password: z
    .string({ message: "add password" })
    .min(8, { message: "minimum add 8 charecter" }),
});

export const createBlogInput = z.object({
  title: z.string().min(10),
  content: z.string().min(10),
});

export const updateBlogInput = z.object({
  title: z.string().min(10),
  content: z.string().min(10),
  id: z.string(),
});

export const userUpdateInput = z.object({
  name: z.string().min(3).max(30),
  bio: z.string().optional(),
});

export type SignupInputType = z.infer<typeof signupInput>;
export type SigninInputType = z.infer<typeof signinInput>;
export type createBlogInputType = z.infer<typeof createBlogInput>;
export type UpdateBlogInputType = z.infer<typeof updateBlogInput>;
