import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../config";

interface PreviewProps {
  setPublish: React.Dispatch<React.SetStateAction<boolean>>;
  description: string;
  title: string;
}

const Preview = ({ setPublish, description, title }: PreviewProps) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [preview, setPreview] = useState<{
    title: string;
    photo: File | undefined;
  }>({
    title: "",
    photo: undefined,
  });

  useEffect(() => {
    setPreview({ title: title, photo: preview.photo });
    setDesc(description);
  }, [title, description]);

  const openFile = () => {
    imageRef.current?.click();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!preview.title || !desc || !preview.photo) {
        toast.error("All fields are required!!!");
        return;
      }
      if (preview.title.length < 15) {
        toast.error("Title must be at least 15 characters");
        return;
      }

      const formData = new FormData();
      formData.append("title", preview.title);
      formData.append("content", desc);
      formData.append("image", preview.photo as Blob);

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.err) {
        toast.error(response.data.err);
        return;
      }
      toast.success("Post has been added");
      navigate("/");
      setPublish(false);
      setPreview({ title: "", photo: undefined });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="absolute inset-0 bg-white z-30">
      <div className="size my-[2rem]">
        <span
          onClick={() => setPublish(false)}
          className="absolute right-[1rem] md:right-[5rem] top-[3rem] text-2xl cursor-pointer"
        >
          <LiaTimesSolid />
        </span>
        <div className="mt-[8rem] flex flex-col md:flex-row gap-10">
          <div className="flex-[1]">
            <h3>Story Preview</h3>
            <div
              style={{ backgroundImage: `url(${imageUrl})` }}
              onClick={openFile}
              className="w-full h-[200px] object-cover bg-gray-100 my-3 grid place-items-center cursor-pointer bg-cover bg-no-repeat"
            >
              {!imageUrl && "Add Image"}
            </div>
            <input
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageUrl(URL.createObjectURL(file));
                  setPreview({ ...preview, photo: file });
                }
              }}
              ref={imageRef}
              type="file"
              hidden
            />
            <input
              type="text"
              placeholder="Title"
              className="outline-none w-full border-b border-gray-300 py-2"
              value={preview.title}
              onChange={(e) =>
                setPreview({ ...preview, title: e.target.value })
              }
            />
            <ReactQuill
              theme="bubble"
              value={desc}
              onChange={setDesc}
              placeholder="Tell Your Story..."
              className="py-3 border-b border-gray-300"
            />
            <p className="text-gray-500 pt-4 text-sm">
              <span className="font-bold">Note:</span> Changes here will affect
              how your story appears in public places like Medium’s homepage and
              in subscribers’ inboxes — not the contents of the story itself.
            </p>
          </div>
          <div className="flex-[1] flex flex-col gap-4 mb-5 md:mb-0">
            <h3 className="text-2xl">
              Publishing to:
              <span className="font-bold capitalize">Meduim</span>
            </h3>
            <p>
              Add or change topics up to 5 so readers know what your story is
              about
            </p>
            <button
              onClick={handleSubmit}
              className="btn !bg-green-800 !w-fit !text-white !rounded-full"
            >
              {loading ? "Submitting..." : "Publish Now"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
