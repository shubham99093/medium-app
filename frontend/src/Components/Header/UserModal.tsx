import React from "react";
import { MdOutlineLocalLibrary } from "react-icons/md";
import { BiSpreadsheet } from "react-icons/bi";
import { HiOutlineChartBar } from "react-icons/hi";
import { LiaEditSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { secretEmail } from "../../utils/helper";
import { useUser } from "../../Context";

interface UserModalInterface {
  title: string;
  icon: React.ReactNode;
  path: string;
}

interface UserModalProps {
  setBlur: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserModal = ({ setBlur }: UserModalProps) => {
  const { currentUser } = useUser();
  const userModal: UserModalInterface[] = [
    {
      title: "Profile",
      icon: <LiaEditSolid />,
      path: `/profile/${currentUser?.id}`,
    },
    {
      title: "Contect-us",
      icon: <MdOutlineLocalLibrary />,
      path: "/Contect-us",
    },
    {
      title: "Policy",
      icon: <BiSpreadsheet />,
      path: "/policy",
    },
    {
      title: "About us",
      icon: <HiOutlineChartBar />,
      path: "/about-us",
    },
  ];

  const signOut = async () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <section className="absolute w-[18rem] p-6 bg-white right-0 top-[100%] shadow rounded-md z-50 text-gray-500">
      <div className="flex flex-col gap-4 border-b border-gray-300 pb-5">
        <Link
          to={"/new-story"}
          className="flex md:hidden items-center gap-2 text-gray-500 hover:text-black/70"
          aria-label="Write a new story"
        >
          <span className="text-2xl">
            <LiaEditSolid />
          </span>
          <span className="text-md">Write</span>
        </Link>
        {userModal.map((link, i) => (
          <Link
            onClick={() => setBlur(false)}
            className="flex items-center gap-2 text-gray-500 hover:text-black/70"
            to={link.path}
            key={i}
            aria-label={link.title}
          >
            <span className="text-2xl">{link.icon}</span>
            <h2 className="text-md">{link.title}</h2>
          </Link>
        ))}
      </div>
      <button
        onClick={signOut}
        className="flex flex-col text-left pt-2 cursor-pointer text-gray-500 hover:text-black/70"
        aria-label="Sign out"
      >
        Sign Out
        <span className="text-sm">
          {currentUser?.email ? secretEmail(currentUser.email) : "No Email"}
        </span>
      </button>
    </section>
  );
};

export default UserModal;
