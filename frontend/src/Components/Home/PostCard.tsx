import { useNavigate, useParams } from "react-router-dom";
import { Blog } from "../../Hooks";
import { readTime } from "../../utils/helper";
import { useUser } from "../../Context";
import moment from "moment";
import SavedPost from "../Actions/SavedPost";
import Actions from "../Actions/Actions";

interface PostCardProps {
  post: Blog;
}

const PostCard = ({ post }: PostCardProps) => {
  const { currentUser } = useUser();
  const {
    title,
    content,
    imgUrl: postImg,
    id: postId,
    createdAt,
    author,
  } = post;
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <section>
      <div
        onClick={() => navigate(`/post/${postId}`)}
        className="flex flex-col sm:flex-row gap-4 cursor-pointer"
      >
        <div className="flex-[2.5]">
          <p className="pb-2 font-semibold capitalize">{author.name}</p>
          <h2 className="text-xl font-bold line-clamp-2 leading-6 capitalize">
            {title}
          </h2>
          <div
            className="py-1 text-gray-500 line-clamp-2 leading-5"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        {postImg && (
          <div className="flex-[1]">
            <img
              src={postImg}
              alt={`Image for the post: ${title}`} // Improved alt text
              className="w-[53rem] h-[8rem] object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between w-full md:w-[70%] mt-[2rem] md:mt-0">
        <p className="text-xs text-gray-600">
          {readTime({ __html: content })} min read .{" "}
          {moment(createdAt).format("MMM DD")}
        </p>
        <div className="flex items-center gap-3">
          <SavedPost post={post} />
          {currentUser?.id === userId && (
            <Actions postId={postId} title={title} content={content} />
          )}
        </div>
      </div>
    </section>
  );
};

export default PostCard;
