import { FaRegComment } from "react-icons/fa";

interface CommentProps {
  commentCount?: number; // Prop for the actual comment count
  onClick?: () => void; // Optional click handler
}

const Comment: React.FC<CommentProps> = ({ commentCount = 10, onClick }) => {
  return (
    <button
      className="flex items-center gap-1 text-sm"
      onClick={onClick} // Call the click handler if provided
      aria-label="View comments" // Accessibility label
    >
      <FaRegComment className="text-lg" />
      <span>{commentCount}</span> {/* Display the actual comment count */}
    </button>
  );
};

export default Comment;
