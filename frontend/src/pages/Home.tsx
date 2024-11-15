import Demo from "../Components/Home/Demo";
import { useUser } from "../Context";
import Posts from "../Components/Home/Posts";
import Follow from "../Components/Follow";

const Home = () => {
  const { currentUser } = useUser();

  return <div className="">{currentUser ? <HomePage /> : <Demo />}</div>;
};

function HomePage() {
  return (
    <section className="size flex gap-[5rem] relative">
      <div className="flex-[2] py-10 mb-[4rem]">
        <Posts />
      </div>
      <div className="hidden md:inline-block md:w-[21rem] p-7 border-l border-gray-300">
        <h3>Who to follow?</h3>
        <Follow />
      </div>
    </section>
  );
}

export default Home;
