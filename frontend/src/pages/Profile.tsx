import { useState } from "react";
import ProfileAbout from "../Components/Profile/ProfileAbout";
import ProfileHome from "../Components/Profile/ProfileHome";
import ProfileList from "../Components/Profile/ProfileList";
import BlurEffect from "../Components/BlurEffect";
import { LiaTimesSolid } from "react-icons/lia";
import { discoverActions } from "../data";
import { IoSettingsSharp } from "react-icons/io5";
import EditProfile from "../Components/Profile/EditProfile";
import { useUser as User } from "../Context";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../Hooks";
import Loading from "../Components/Loading";
import Base64Image from "../Components/Base64ImageProps";
import { defaultProfileImg } from "../../public/defaultProfileImg";

interface Activeitie {
  title: string;
  comp: () => JSX.Element;
}

const activeities: Activeitie[] = [
  { title: "Home", comp: ProfileHome },
  { title: "Lists", comp: ProfileList },
  { title: "About", comp: ProfileAbout },
];

export const Profile = () => {
  const [currentActive, setCurrentActive] = useState<Activeitie>(
    activeities[0]
  );
  const [blur, setBlur] = useState(false);
  const [editBlur, setEditBlur] = useState(false);
  const { currentUser, setCurrentUser } = User();
  const { userId } = useParams();
  const { user, loading } = useUser(userId as string);
  const navigate = useNavigate();
  const base64Img = `${
    (userId === currentUser?.id ? currentUser?.imgUrl : user?.imgUrl) ||
    defaultProfileImg
  }`;

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)] text-6xl">
        User not found
      </div>
    );
  }

  return (
    <section className="size flex gap-[4rem] relative">
      {/* User activities */}
      <div className="mt-[9rem] flex-[2]">
        <div className="flex items-end gap-4">
          <h2 className="text-3xl sm:text-5xl font-bold capitalize">
            {userId === currentUser?.id ? currentUser?.name : user?.name}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">Followers(2)</p>
          <p className="text-gray-500 text-xs sm:text-sm">Following(2)</p>
        </div>
        <div className="flex items-center gap-5 mt-[1rem] border-b border-gray-300 mb-[3rem]">
          {activeities.map((item, i) => (
            <div
              className={`py-[0.5rem] ${
                item.title === currentActive.title
                  ? "border-b border-gray-500"
                  : ""
              }`}
              key={i}
            >
              <button onClick={() => setCurrentActive(item)}>
                {item.title}
              </button>
            </div>
          ))}
        </div>
        <currentActive.comp getUserData={user} setEditBlur={setEditBlur} />
      </div>
      {/* Button to open the side bar */}
      <button
        onClick={() => setBlur(true)}
        aria-label="Open settings"
        className="fixed top-[8rem] right-0 w-[2rem] h-[2rem] bg-black text-white grid place-items-center md:hidden"
      >
        <IoSettingsSharp />
      </button>
      {/* User Details */}
      <BlurEffect blur={blur} setBlur={setBlur}>
        <div
          className={`flex-[1] border-l border-gray-300 p-[2rem] z-10 fixed right-0 bottom-0 top-0 w-[18rem] bg-white md:relative ${
            blur ? "translate-x-0" : "translate-x-[100%] md:translate-x-0"
          } transition-all duration-300`}
        >
          {/* Icon to close modal */}
          <div className="pb-4 text-right">
            <button
              onClick={() => setBlur(false)}
              aria-label="Close settings"
              className="inline-block md:hidden"
            >
              <LiaTimesSolid />
            </button>
          </div>
          {/* Profile details */}
          <div className="sticky top-7 flex flex-col justify-between">
            <Base64Image
              base64String={base64Img}
              altText="My Base64 Image"
              style="w-[3.5rem] h-[3.5rem] rounded-full object-cover"
            />
            <h2 className="py-2 font-bold capitalize">
              {userId === currentUser?.id ? currentUser?.name : user?.name}
            </h2>
            <p className="text-gray-500 first-letter:uppercase text-sm">
              {userId === currentUser?.id
                ? currentUser?.bio
                : user?.bio || "No bio available"}
            </p>
            {userId === currentUser?.id && (
              <button
                onClick={() => setEditBlur(true)}
                className="text-green-700 pt-6 text-sm w-fit"
              >
                Edit Profile
              </button>
            )}
            {/* Nav */}
            <div className="flex-[1] flex items-center flex-wrap gap-3 pt-8">
              {discoverActions.map((item, i) => (
                <button
                  onClick={() => navigate("/contect-us")}
                  key={i}
                  className="text-xs text-black1"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BlurEffect>
      {editBlur && (
        <EditProfile
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          editBlur={editBlur}
          setEditBlur={setEditBlur}
        />
      )}
    </section>
  );
};
