import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import BlurEffect from "../BlurEffect";
import useBlogs from "../../Hooks";
import { useNavigate } from "react-router-dom";

interface searchProps {
  blur: boolean;
  setBlur: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search = ({ blur, setBlur }: searchProps) => {
  const [search, setSearch] = useState("");
  const { blogs } = useBlogs();

  const searchData =
    blogs &&
    blogs?.filter(
      (blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.content.toLowerCase().includes(search.toLowerCase())
    );

  const navigate = useNavigate();
  return (
    <>
      <BlurEffect blur={blur} setBlur={setBlur}>
        <div
          className={`absolute sm:relative right-4 left-4 top-[4rem] sm:left-0 sm:top-0
            ${
              blur
                ? "visible opacity-100"
                : "invisible sm:visible sm:opacity-100 opacity-0"
            }
            transition-all duration-200
            `}
        >
          <div className="flex items-center gap-2 bg-gray-100 px-2 rounded-full relative z-10">
            <span className="text-2xl text-gray-400">{<CiSearch />}</span>
            <input
              className="bg-transparent outline-none py-[0.7rem] text-sm w-full"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Medium"
              aria-label="Search"
            />
            {search !== "" && (
              <div className="absolute right-0 left-0 top-full bg-white shadow rounded-md">
                {searchData.length > 0 ? (
                  <>
                    {searchData.map((post, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          navigate(`/post/${post?.id}`);
                          setSearch("");
                        }}
                        className="p-2 border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
                      >
                        <h2 className="line-clamp-1 capitalize text-sm font-bold">
                          {post.title}
                        </h2>
                        <div
                          className="text-xs text-gray-500 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-sm text-gray-500 p-3">No Post Found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </BlurEffect>
    </>
  );
};

export default Search;
