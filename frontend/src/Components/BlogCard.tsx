import { Link } from "react-router-dom";
import Avatar from "./Header/Avatar";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string;
}

const BlogCard = ({
  authorName,
  title,
  content,
  publishedDate,
  id,
}: BlogCardProps) => {
  const getContentPreview = (content: string, limit: number = 100) => {
    return content.length < limit ? content : content.slice(0, limit) + "...";
  };

  return (
    <Link
      to={`/blog/${id}`}
      className="hover:shadow-lg transition-shadow duration-200"
    >
      <div className="border-b border-slate-200 pb-4 p-4">
        <div className="flex items-center pb-2">
          <div className="flex justify-center flex-col pr-2">
            <Avatar name={authorName} size="small" />
          </div>
          <div className="font-light pr-2 text-sm">{authorName}</div>
          <div className="text-[6px] text-black opacity-55">&#9679;</div>
          <div className="pl-2 font-medium text-black opacity-55 text-sm">
            {publishedDate}
          </div>
        </div>
        <div className="text-2xl font-bold">{title}</div>
        <div className="text-lg text-black pb-4">
          {getContentPreview(content)}
        </div>
        <div className="text-black opacity-55">
          {`${Math.ceil(content.length / 100)} minutes`}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
