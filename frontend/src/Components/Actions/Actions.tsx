import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import DropDown from "../../utils/DropDown";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { toast } from "react-toastify";
import { useUser } from "../../Context";

const Actions = ({
  postId,
  title,
  content,
}: {
  postId: string;
  title: string;
  content: string;
}) => {
  const navigate = useNavigate();
  const { setUpdateData } = useUser();
  const [showDrop, setShowDrop] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for delete action

  const handleClick = () => {
    setShowDrop(!showDrop);
  };

  const handleEdit = () => {
    navigate(`/editPost/${postId}`);
    setUpdateData({ postId, title, content });
  };

  const handleRemove = async () => {
    setLoading(true); // Start loading
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Post has been removed");
      setShowDrop(false);
      navigate("/"); // Redirect after deletion
    } catch {
      toast.error("Failed to delete the post."); // Changed to error toast
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="relative">
      <button onClick={handleClick} aria-label="More actions">
        <BsThreeDots className="text-2xl" />
      </button>
      <DropDown showDrop={showDrop} setShowDrop={setShowDrop} size="w-[7rem]">
        <Button click={handleEdit} title="Edit Story" />
        <Button
          click={handleRemove}
          title={loading ? "Deleting..." : "Delete Story"}
          disabled={loading} // Disable while loading
        />
      </DropDown>
    </div>
  );
};

interface ButtonProps {
  click: () => void; // Explicitly typing the click function
  title: string; // Title as a string
  disabled?: boolean; // Optional disabled prop
}

const Button: React.FC<ButtonProps> = ({ click, title, disabled = false }) => {
  return (
    <button
      onClick={click}
      disabled={disabled}
      className={`p-2 hover:bg-gray-100 hover:text-black/80 w-full text-sm text-left
      ${title === "Delete Story" ? "text-red-600" : ""} 
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} // Style for disabled button
    >
      {title}
    </button>
  );
};

export default Actions;
