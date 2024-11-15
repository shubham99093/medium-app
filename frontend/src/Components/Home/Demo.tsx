import { useState, useEffect } from "react";
import Banner from "./Banner";
import Posts from "./Posts";
import Discover from "./Discover";

const Demo = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div>
      <Banner />
      <div className="size py-7 flex flex-col-reverse md:flex-row gap-[7rem]">
        <div className="flex-[1.5]">
          <Posts />
        </div>
        <div className="flex-[1] relative">
          <Discover />
        </div>
      </div>
    </div>
  );
};

export default Demo;
