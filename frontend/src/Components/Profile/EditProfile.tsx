import React, { useEffect, useRef, useState } from "react";
import BlurEffect from "../BlurEffect";
import { LiaTimesSolid } from "react-icons/lia";
import { UserSchema } from "../../Context";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import Base64Image from "../../Components/Base64ImageProps";
import { defaultProfileImg } from "../../../public/defaultProfileImg";

interface EditProfileProps {
  editBlur: boolean;
  setEditBlur: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: UserSchema | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserSchema | null>>;
}

interface Form {
  name: string;
  userImg: string;
  bio: string;
  Image?: File | null;
}

/*************  ✨ Codeium Command ⭐  *************/
/**
 * EditProfile is a component that allows users to edit their profile information.
 *
 * The component contains a form with fields for name, bio, and image upload.
 *
 * When the user submits the form, the component sends a PUT request to the backend
 * to update the user's profile information. If the request is successful, the
 * component updates the user's profile information in the state and displays a
 * success message.
 *
 * If the request fails, the component displays an error message.
 *
 * @param {EditProfileProps} props The props passed to the component.
 * @returns {React.ReactElement} The rendered component.
 */
/******  18c78741-74dc-4cc0-b790-ee9e499f20ef  *******/ const EditProfile = ({
  editBlur,
  setEditBlur,
  currentUser,
  setCurrentUser,
}: EditProfileProps) => {
  const imgRef = useRef<HTMLInputElement>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Form>({
    name: "",
    userImg: "",
    bio: "",
    Image: null,
  });

  const btnStyle =
    "border border-green-600 py-1 px-5 rounded-full text-green-600";

  const openFile = () => {
    imgRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgUrl(URL.createObjectURL(file));
      setForm({ ...form, Image: file });
      try {
        const response = await axios.put(
          `${BACKEND_URL}/api/v1/user/upload`,
          {
            image: file,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.url && currentUser) {
          setCurrentUser((prev) => ({
            ...prev,
            imgUrl: response.data.url,
          }));
        }
      } catch (err) {
        console.error(err);
        toast.error("Image upload failed");
      }
    }
  };

  const removeImage = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/user/removeImage`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setImgUrl(defaultProfileImg);
      setCurrentUser((prev) => ({
        ...prev,
        imgUrl: defaultProfileImg,
      }));

      toast.success("Image removed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove image");
    }
  };

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || "",
        bio: currentUser.bio || "",
        userImg: currentUser.imgUrl || defaultProfileImg,
      });
      setImgUrl(currentUser.imgUrl || defaultProfileImg);
    } else {
      setForm({ name: "", bio: "", userImg: "" });
    }
  }, [currentUser]);

  const handleInputChange =
    (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const saveForm = async () => {
    if (form.name.trim() === "") {
      toast.error("Name is required!!!");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/user/update`,
        {
          name: form.name,
          bio: form.bio,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCurrentUser((prev) => ({
        ...prev,
        name: form.name,
        bio: form.bio,
      }));

      toast.success("Profile has been updated");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setEditBlur(false);
    }
  };

  const base64Img = imgUrl ? imgUrl : form.userImg;

  return (
    <BlurEffect blur={editBlur} setBlur={setEditBlur}>
      <div className="rounded-md center w-[95%] md:w-[45rem] bg-white mx-auto shadows my-[1rem] z-20 mb-[3rem] p-[2rem]">
        {/* head */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Profile information</h2>
          <button onClick={() => setEditBlur(false)}>
            <LiaTimesSolid />
          </button>
        </div>
        {/* body */}
        <section className="mt-6">
          <p className="pb-3 text-sm text-gray-500">Photo</p>
          <div className="flex gap-[2rem]">
            <div className="w-[5rem] h-[5rem]">
              <Base64Image
                base64String={base64Img}
                altText="profile-img"
                style="min-h-[5rem] min-w-[5rem] rounded-full object-cover border border-gray-400"
              />
              <input
                onChange={handleImageChange}
                accept="image/jpg, image/png, image/jpeg"
                ref={imgRef}
                type="file"
                className="hidden"
              />
            </div>
            <div>
              <div className="flex gap-4 text-sm">
                <button onClick={openFile} className="text-green-600">
                  Update
                </button>
                <button onClick={removeImage} className="text-red-500">
                  Remove
                </button>
              </div>
              <p className="w-full sm:w-[20rem] text-gray-500 text-sm pt-2">
                Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per
                size
              </p>
            </div>
          </div>
        </section>
        {/* footer */}
        <section className="pt-[1rem] text-sm">
          <div>
            <label className="pb-3 block">Name*</label>
            <input
              onChange={handleInputChange("name")}
              value={form.name}
              type="text"
              className="w-full p-1 border-b border-black outline-none"
              placeholder="Username..."
              maxLength={50}
            />
            <p className="text-sm text-gray-600 pt-2">
              Appears on your Profile page, as your byline, and in your
              responses. {form.name.length}/50
            </p>
          </div>
          <div className="pt-[1rem] text-sm">
            <label className="pb-3 block">Bio*</label>
            <input
              onChange={handleInputChange("bio")}
              value={form.bio}
              type="text"
              className="w-full p-1 border-b border-black outline-none"
              placeholder="Bio..."
              maxLength={160}
            />
            <p className="text-gray-600 pt-2">
              Appears on your Profile and next to your stories.{" "}
              {form.bio.length}/160
            </p>
          </div>
        </section>
        <div className="flex items-center justify-end gap-4 pt-[2rem]">
          <button onClick={() => setEditBlur(false)} className={btnStyle}>
            Cancel
          </button>
          <button
            onClick={saveForm}
            className={`${btnStyle} bg-green-800 text-white ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            Save
          </button>
        </div>
      </div>
    </BlurEffect>
  );
};

export default EditProfile;
