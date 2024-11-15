import React from "react";

interface LoadingProps {
  message?: string;
  imageSrc?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  imageSrc = "/loading2.gif",
}) => {
  return (
    <div className="fixed inset-0 grid place-items-center bg-white z-30">
      <img src={imageSrc} alt="Loading" />
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;
