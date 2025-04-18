import { useEffect } from "react";
import ReactQuill from "react-quill";
import { useUser } from "../Context/";

const EditPost = () => {
  const { updateData, title, setTitle, content, setContent } = useUser();
  useEffect(() => {
    if (updateData) {
      setTitle(updateData.title);
      setContent(updateData.content);
    }
  }, [updateData]);

  return (
    <section className="write w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-[3rem]">
      <input
        type="text"
        placeholder="Title..."
        className="text-4xl outline-none w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <ReactQuill
        placeholder="Description..."
        className="!text-[4rem] my-3"
        theme="bubble"
        value={content}
        onChange={setContent}
      />
    </section>
  );
};

export default EditPost;
