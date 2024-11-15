import React from "react";

interface BlurEffectProps {
  children: React.ReactNode;
  blur: boolean;
  setBlur: React.Dispatch<React.SetStateAction<boolean>>;
}

const BlurEffect = ({ children, blur, setBlur }: BlurEffectProps) => {
  return (
    <>
      <div
        onClick={() => {
          setBlur(false);
        }}
        className={`bg-white/50 fixed inset-0 z-10 
        ${
          blur ? "visible opacity-100" : "invisible opacity-0"
        } transition-all duration-500`}
      />
      {children}
    </>
  );
};

export default BlurEffect;
