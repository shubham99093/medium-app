import BlogCard from "../Components/BlogCard";
import useBlogs from "../Hooks";

const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (blogs && blogs?.length === 0 && !blogs) {
    return (
      <div className="flex justify-center">
        No blogs available at this time.
      </div>
    );
  }

  return (
    <div>
      {/* <AppBar /> */}
      <div className="flex justify-center">
        <div className="max-w-[75%] min-w-[50%]">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              authorName={blog.author.name}
              title={blog.title}
              content={blog.content}
              publishedDate={new Date(blog.createdAt).toLocaleDateString()} // Assuming createdAt exists
              id={blog.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
