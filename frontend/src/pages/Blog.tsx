import { useNavigate, useParams } from "react-router-dom";
import { useBlog } from "../Hooks";
import Loading from "../Components/Loading";
import FollowBtn from "../Components/FollowBtn";
import { useUser } from "../Context";
import moment from "moment";
import { readTime } from "../utils/helper";
import Actions from "../Components/Actions/Actions";
import Like from "../Components/Actions/Like";
import Comment from "../Components/Actions/Comment";
import SavedPost from "../Components/Actions/SavedPost";
import SharePost from "../Components/Actions/SharePost";
import Recommended from "../Components/Recommended";

const Blog: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { blog, loading } = useBlog(postId as string);
  const { currentUser } = useUser();
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }
  if (!blog) {
    return <div>Blog not found</div>;
  }

  const {
    title,
    content,
    createdAt,
    imgUrl: postImg,
    author: { name, id: userId, imgUrl: userImg },
  } = blog;

  return (
    <>
      <section className="max-w-[680px] mx-auto py-[3rem] ">
        <h2 className="text-4xl font-extrabold capitalize font-heading">
          {title}
        </h2>
        <div className="flex items-center gap-2 py-[2rem]">
          <img
            onClick={() => navigate(`/profile/${userId}`)}
            className="w-[3rem] h-[3rem] object-cover rounded-full cursor-pointer"
            src={userImg as string}
            alt="user profile"
          />
          <div>
            <div
              className="capitalize flex items-center cursor-pointer"
              onClick={() => navigate(`/profile/${userId}`)}
            >
              <span>{name} .</span>
              {currentUser && currentUser.id !== userId && <FollowBtn />}
            </div>
            <p className="text-sm text-gray-500">
              {readTime({ __html: content })} min read .
              <span className="ml-1">{moment(createdAt).fromNow()}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-t border-gray-200 py-[0.5rem]">
          <div className="flex items-center gap-5">
            <Like postId={postId as string} />
            <Comment />
          </div>
          <div className="flex items-center pt-2 gap-5">
            {blog && <SavedPost post={blog} />}
            <SharePost />
            {currentUser && currentUser.id === userId && (
              <Actions
                postId={postId as string}
                title={title}
                content={content}
              />
            )}
          </div>
        </div>
        <div className="mt-[3rem]">
          {postImg && (
            <img
              className="max-w-[100%] h-auto w-full object-cover"
              src={postImg}
              alt="post image"
            />
          )}
          <div
            className="mt-6 font-ff text-lg"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>
      <Recommended post={blog} />
      {/* <Comments postId={postId} /> */}
    </>
  );
};

export default Blog;
