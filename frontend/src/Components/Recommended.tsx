import React, { useEffect, useState } from "react";
import axios from "axios";
import { readTime } from "../utils/helper";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

interface UserType {
  id: string;
  name: string;
  imgUrl?: string;
}

interface PostType {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imgUrl?: string;
  author: UserType;
  tags?: string[];
}

interface RecommendedProps {
  post: PostType;
}

const Recommended: React.FC<RecommendedProps> = ({ post: singlePost }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [commonTags, setCommonTags] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<PostType[]>(
          `${BACKEND_URL}/api/v1/blog/bulk`
        );
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const recommendedPost: PostType[] = posts.filter(
      (post) => post.id !== singlePost.id
    );

    recommendedPost.sort(() => Math.random() - 0.5);
    const minRecommendation = 4;
    setCommonTags(recommendedPost.slice(0, minRecommendation));
  }, [posts, singlePost]);

  return (
    <section className="bg-gray-100">
      <div className="w-[90%] md:w-[90%] lg:w-[60%] mx-auto py-[3rem]">
        <h2 className="text-xl font-bold">Recommended from Medium</h2>
        {loading ? (
          <p>Loading recommended posts...</p>
        ) : commonTags.length === 0 ? (
          <p>No recommended posts found based on your preference</p>
        ) : (
          <div className="grid grid-cols-card gap-[2rem] my-[3rem]">
            {commonTags.map((post) => (
              <Post post={post} key={post.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Recommended;

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const {
    title,
    content,
    createdAt,
    imgUrl: postImg,
    id: postId,
    author,
  } = post;
  const { name, imgUrl: userImg } = author;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/post/${postId}`)}
      className="w-full cursor-pointer"
    >
      {postImg && (
        <img
          className="w-fill h-[200px] object-cover"
          src={postImg}
          alt="post-img"
        />
      )}
      <div className="flex items-center gap-1 py-3">
        {author && (
          <>
            <img
              className="w-[2rem] h-[2rem] object-cover rounded-full"
              src={userImg}
              alt="userImg"
            />
            <h3 className="text-sm capitalize">{name}</h3>
          </>
        )}
      </div>
      <h2 className="font-extrabold leading-5 line-clamp-2">{title}</h2>
      <div
        className="line-clamp-2 my-3 text-gray-500 leading-5"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <p className="text-sm text-gray-600">
        {readTime({ __html: content })} min read
        <span className="ml-3">{moment(createdAt).format("MMM DD")}</span>
      </p>
    </div>
  );
};
