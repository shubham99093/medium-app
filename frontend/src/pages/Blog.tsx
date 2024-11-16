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
import Base64Image from "../Components/Base64ImageProps";

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
  const base64blogpostimg = postImg;

  return (
    <>
      <section className="max-w-[680px] mx-auto py-[3rem] ">
        <h2 className="text-4xl font-extrabold capitalize font-heading">
          {title}
        </h2>
        <div className="flex items-center gap-2 py-[2rem]">
          <Base64Image
            base64String={userImg as string}
            onClick={() => navigate(`/profile/${userId}`)}
            altText="user profile"
            style="w-[3rem] h-[3rem] object-cover rounded-full cursor-pointer"
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
            <Base64Image
              base64String={base64blogpostimg}
              altText="post image"
              style="max-w-[100%] h-auto w-full object-cover"
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
