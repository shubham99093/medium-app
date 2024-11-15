// /util/dropDown.tsx
import { ReactNode, useEffect, useRef } from "react";

interface DropDownProps {
  children: ReactNode; // Elements to render inside the dropdown
  size?: string; // Optional size class for styling
  showDrop: boolean; // Control whether to show the dropdown
  setShowDrop: (show: boolean) => void; // Function to update dropdown visibility
}

const DropDown: React.FC<DropDownProps> = ({
  children,
  size = "",
  showDrop,
  setShowDrop,
}) => {
  const dropRef = useRef<HTMLDivElement | null>(null); // Reference to the dropdown element

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      // Check if the click is outside the dropdown
      if (
        showDrop &&
        dropRef.current &&
        !dropRef.current.contains(e.target as Node)
      ) {
        setShowDrop(false); // Hide dropdown
      }
    };

    window.addEventListener("mousedown", clickOutside); // Add event listener
    return () => window.removeEventListener("mousedown", clickOutside); // Cleanup
  }, [dropRef, showDrop, setShowDrop]);

  return (
    <>
      {showDrop && (
        <div
          ref={dropRef}
          className={`shadows flex flex-col absolute right-0 top-[2rem] bg-white ${size}`}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default DropDown;
