import { discover, discoverActions } from "../../data";

const Discover = () => {
  return (
    <div className="sticky top-[6rem]">
      <div className="border-b border-gray-400 pb-7">
        <h2 className="font-semibold">Discover more of what metters to you</h2>
        <div className="my-2 flex items-center gap-3 flex-wrap">
          {discover.map((item, i) => (
            <button
              className="bg-gray-200 py-2 px-3 text-sm rounded-full active:bg-gray-400"
              key={i}
            >
              {item}
            </button>
          ))}
        </div>
        <button className="text-green-600 text-sm py-3 hover:text-black1">
          See more topic
        </button>
      </div>
      <div className="flex items-center flex-wrap gap-3 leading-3 pt-8">
        {discoverActions.map((item, i) => (
          <button className="text-md text-black1" key={i}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Discover;
