import { useEffect, useState } from "react";
import { useUser } from "../../Context";
import { CiSaveDown2 } from "react-icons/ci";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../config";
import axios from "axios";

interface Post {
  id: string;
}

interface SavedPostProps {
  post: Post;
}

const SavedPost: React.FC<SavedPostProps> = ({ post }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUser();

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (currentUser && post?.id) {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/v1/saved-posts/${post.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setIsSaved(response.data.isSaved);
        } catch (error) {
          console.error("Failed to check if the post is saved:", error);
        }
      }
    };
    checkSavedStatus();
  }, [post?.id, currentUser]);

  const handleSave = async () => {
    if (!currentUser) {
      toast.error("Please log in to save posts.");
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        await axios.delete(`${BACKEND_URL}/api/v1/saved-posts/${post.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Post has been unsaved");
      } else {
        await axios.post(
          `${BACKEND_URL}/api/v1/saved-posts`,
          { postId: post.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Post has been saved");
      }
      setIsSaved((prev) => !prev); // Toggle saved state
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <button
        onClick={handleSave}
        className="hover:opacity-60"
        disabled={loading} // Disable button while loading
        aria-label={isSaved ? "Unsave post" : "Save post"} // Accessibility label
      >
        <CiSaveDown2
          className={`text-2xl ${isSaved ? "text-yellow-600" : ""}`}
        />
      </button>
    </div>
  );
};

export default SavedPost;
