import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const FollowBtn = () => {
  const [isFollowed, setIsFollowed] = useState(false);

  const handleFollow = async () => {
    try {
      setIsFollowed(!isFollowed);
      toast.success(isFollowed ? "Unfollowed" : "Followed");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const { pathname } = useLocation();

  return (
    <div>
      <button
        onClick={handleFollow}
        className={`${
          pathname === "/" ? "border border-black" : ""
        } px-3 py-[0.2rem] rounded-full
        ${isFollowed ? "text-gray-500 border-none" : ""}`}
      >
        {isFollowed ? "Following" : "Follow"}
      </button>
    </div>
  );
};
export default FollowBtn;
