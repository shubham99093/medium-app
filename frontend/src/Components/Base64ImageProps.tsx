import React from "react";

type Base64ImageProps = {
  base64String: string;
  altText?: string;
  style?: string;
  onClick?: () => void;
};

const Base64Image: React.FC<Base64ImageProps> = ({
  base64String,
  altText = "Base64 Image",
  style,
}) => {
  return (
    <img
      src={`data:image/jpeg;base64,${base64String}`}
      alt={altText}
      className={style}
    />
  );
};

export default Base64Image;
