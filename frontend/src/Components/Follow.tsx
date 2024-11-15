import { useNavigate } from "react-router-dom";
import { useUsers } from "../Hooks";
import { useState } from "react";
import FollowBtn from "./FollowBtn";

const Follow = () => {
  const { users } = useUsers();
  const [count, setCount] = useState(5);
  const usersData = users && users?.slice(0, count);
  const navigate = useNavigate();
  return (
    <>
      {usersData &&
        usersData?.map((user, i) => {
          const { name, bio, imgUrl, id } = user;
          return (
            <div key={i} className="flex items-start gap-2 my-4">
              <div
                onClick={() => navigate("/profile" + "/" + id)}
                className="flex-1 flex items-center gap-2 cursor-pointer"
              >
                <img
                  className="w-[3rem] h-[3rem] object-cover gap-2 cursor-pointer rounded-full"
                  src={imgUrl}
                  alt="userImg"
                />
                <div className="flex flex-col gap-1">
                  <h2 className="font-bold capitalize">{name}</h2>
                  <span className="leading-4 text-gray-500 text-sm line-clamp-2">
                    {bio || "This user has no bio"}
                  </span>
                </div>
              </div>
              <FollowBtn />
            </div>
          );
        })}
      {users?.length > 5 && (
        <button
          onClick={() => setCount(users.length)}
          className="mb-3 text-green-900 text-sm hover:underline"
        >
          Load for more users
        </button>
      )}
    </>
  );
};

export default Follow;
