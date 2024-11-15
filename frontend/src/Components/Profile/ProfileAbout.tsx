import { useUser, UserSchema } from "../../Context";

const ProfileAbout = ({
  getUserData,
  setEditBlur,
}: {
  getUserData: UserSchema;
  setEditBlur: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { currentUser } = useUser();
  return (
    <div className="w-full ">
      <p className="text-2xl first-letter:uppercase ">
        {getUserData?.bio || getUserData?.name + " has no bio"}
      </p>
      {currentUser?.id === getUserData?.id && (
        <div className="text-right">
          <button
            onClick={() => setEditBlur(true)}
            className="border border-black py-2 px-5 text-black rounded-full mt-[3rem]"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileAbout;
