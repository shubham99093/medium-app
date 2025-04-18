import { useState } from "react";
import { useUser } from "../Context";
import ReactQuill from "react-quill";
import Preview from "../Components/Preview";

const NewStory = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const { publish, setPublish } = useUser();

  return (
    <section className="w-[90%] md:w-[90%] lg:w-[60%] mx-auto py-[3rem]">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        placeholder="Title"
        className="text-4xl outline-none w-full"
      />
      <ReactQuill
        theme="bubble"
        value={description}
        onChange={setDescription}
        placeholder="Tell Your Story..."
        className="write my-5"
      />
      <div
        className={`${
          publish ? "visible opacity-100" : "invisible opacity-0"
        } transition-all duration-200`}
      >
        <Preview
          setPublish={setPublish}
          description={description}
          title={title}
        />
      </div>
    </section>
  );
};

export default NewStory;
