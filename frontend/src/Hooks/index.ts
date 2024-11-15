// /Hook/index.ts
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { UserSchema } from "../Context";

// Define Blog interface
export interface Blog {
  author: {
    id: string;
    name: string;
    imgUrl: string | undefined;
  };
  createdAt: string;
  imgUrl: string;
  title: string;
  content: string;
  id: string;
}

// Generic response type to handle API responses
interface ApiResponse<T> {
  data: T;
}

// Helper function to get auth headers
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Hook to fetch a single blog by ID
export const useBlog = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null); // Set initial state to null

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get<ApiResponse<Blog>>(
          `${BACKEND_URL}/api/v1/blog/${id}`,
          getAuthHeaders()
        );
        setBlog(response.data); // Here, response.data is of type Blog
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return { loading, blog };
};

// Hook to fetch a user by ID
export const useUser = (userId: string) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSchema | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<ApiResponse<UserSchema>>(
          `${BACKEND_URL}/api/v1/user/${userId}`,
          getAuthHeaders()
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { loading, user };
};

// Hook to fetch all blogs
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get<ApiResponse<Blog[]>>(
          `${BACKEND_URL}/api/v1/blog/bulk`,
          getAuthHeaders()
        );
        setBlogs(response.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return { loading, blogs };
};

// Hook to fetch blogs by user ID
export const useUserBlogs = (userId: string) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await axios.get<ApiResponse<{ posts: Blog[] }>>(
          `${BACKEND_URL}/api/v1/user/posts/${userId}`
        );
        setBlogs(response.data.posts);
      } catch (error) {
        console.error("Failed to fetch user blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [userId]);

  return { loading, blogs };
};

// Hook to fetch saved posts
export const useSavedPosts = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]); // Specify type according to your API response

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get<ApiResponse<{ savedPost: any[] }>>(
          `${BACKEND_URL}/api/v1/saved-posts`,
          getAuthHeaders()
        );
        setPosts(response.data.savedPosts);
      } catch (error) {
        console.error("Failed to fetch saved posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  return { loading, posts };
};

// Hook to fetch all users
export const useUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]); // Specify type according to your API response

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<ApiResponse<{ users: any[] }>>(
          `${BACKEND_URL}/api/v1/user/bulk`,
          getAuthHeaders()
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { loading, users };
};

export default useBlogs;
