import { BiLock } from "react-icons/bi";
import { useUser, UserSchema } from "../../Context";
import { useSavedPosts } from "../../Hooks";
import Loading from "../Loading";
import PostCard from "../Home/PostCard";

const ProfileList = ({ getUserData }: { getUserData: UserSchema }) => {
  const { posts, loading } = useSavedPosts();
  const { currentUser } = useUser();
  return (
    <div>
      {currentUser && currentUser?.id === getUserData?.id ? (
        <div className="flex flex-col gap-[2rem] mb-[2rem]">
          {posts && posts.length === 0 && (
            <p className="text-gray-500">
              <span className="capitalize mr-1">{getUserData?.name}</span> has
              no saved post
            </p>
          )}
          {loading ? (
            <Loading />
          ) : (
            posts &&
            posts?.map((post, i) => <PostCard post={post?.post} key={i} />)
          )}
        </div>
      ) : (
        <PrivateLists username={getUserData?.name as string} />
      )}
    </div>
  );
};

export default ProfileList;

const PrivateLists = ({ username }: { username: string }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-[3rem] text-center">
      <p>
        <span className="capitalize">{username} saved posts are private</span>
      </p>
      <span className="text-[10rem] text-gray-500">
        <BiLock />
      </span>
    </div>
  );
};
