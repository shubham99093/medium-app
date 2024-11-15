import { useParams } from "react-router-dom";
import { useUserBlogs } from "../../Hooks";
import Loading from "../Loading";
import PostCard from "../Home/PostCard";

const ProfileHome = ({ getUserData }) => {
  const { userId } = useParams();
  const { blogs, loading } = useUserBlogs(userId as string);
  return (
    <div className="flex flex-col gap-5 mb-[4rem]">
      {!blogs && (
        <h1 className="text-center text-2xl ">
          {getUserData.name} has no posts
        </h1>
      )}
      {blogs?.length === 0 && (
        <p className="text-gray-500">
          <span className="capitalize">{getUserData?.username}</span> has no
          posts
        </p>
      )}
      {loading ? (
        <Loading />
      ) : (
        blogs &&
        blogs?.map((post, i) => {
          return <PostCard post={post} key={i} />;
        })
      )}
    </div>
  );
};

export default ProfileHome;
