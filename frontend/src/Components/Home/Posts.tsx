import { useBlogs } from "../../Hooks";
import Loading from "../Loading";
import PostCard from "./PostCard";

const Posts = () => {
  const { blogs, loading } = useBlogs();

  return (
    <section className="flex flex-col gap-[2.5rem]">
      {loading && <Loading />}
      {!loading && blogs.length === 0 && (
        <p className="text-gray-500">No blog posts available.</p>
      )}
      {blogs &&
        !loading &&
        blogs.map((post) => <PostCard post={post} key={post.id} />)}
    </section>
  );
};

export default Posts;
