import { useEffect, useState } from "react";
import { PiHandsClappingDuotone } from "react-icons/pi";
import { toast } from "react-toastify";
import { useUser } from "../../Context";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { formatNum } from "../../utils/helper";

interface LikeProps {
  postId: string;
}

const Like: React.FC<LikeProps> = ({ postId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/blog/${postId}/like-status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likeCount);
      } catch (error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Failed to load like status"
        );
      }
    };
    fetchLikeStatus();
  }, [postId]);

  const handleLike = async () => {
    try {
      if (currentUser) {
        if (isLiked) {
          await axios.delete(`${BACKEND_URL}/api/v1/blog/${postId}/like`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setIsLiked(false);
          setLikeCount(likeCount - 1);
          toast.success("Post unliked");
        } else {
          await axios.post(
            `${BACKEND_URL}/api/v1/blog/${postId}/like`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setIsLiked(true);
          setLikeCount(likeCount + 1);
          toast.success("Post liked");
        }
      } else {
        toast.error("Please log in to like posts");
      }
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <button onClick={handleLike} className="flex items-center gap-1 text-sm">
      <PiHandsClappingDuotone
        className={`text-xl ${isLiked ? "text-black" : "text-gray-500"}`}
      />
      <span>{formatNum(likeCount)}</span>
    </button>
  );
};

export default Like;
