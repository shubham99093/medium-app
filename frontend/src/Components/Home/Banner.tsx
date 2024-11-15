import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-banner border-b border-black">
      <div className="size py-[5rem] flex flex-col items-start gap-[1rem]">
        <h1 className="font-title font-normal text-[3rem] sm:text-[4rem] md:text-[6rem] ">
          Stay curious.
        </h1>
        <p className="w-full md:w-[30rem] text-[1.3rem] md:text-[1.5rem] font-medium leading-7">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
        <button
          className="btn bg-black rounded-full text-white !text-[1.2rem] !px-6 !mt-[2.5rem]"
          onClick={() => navigate("/reading")}
          aria-label="Start reading"
        >
          Start reading
        </button>
      </div>
    </div>
  );
};

export default Banner;
