interface AvatarProps {
  name: string;
  size?: "small" | "big";
}

function Avatar({ name, size = "small" }: AvatarProps) {
  // Generate a random background color or use initials-based color
  const getBackgroundColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-orange-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const backgroundColor = getBackgroundColor();

  return (
    <div
      className={`relative inline-flex items-center justify-center ${
        size === "small" ? "w-8 h-8" : "w-10 h-10"
      } overflow-hidden rounded-full ${backgroundColor}`}
      aria-label={name ? `${name}'s avatar` : "User avatar"}
      title={name || "User avatar"}
    >
      <span className="font-extralight text-white">
        {name ? name[0].toUpperCase() : "?"}{" "}
        {/* Default to "?" if name is empty */}
      </span>
    </div>
  );
}

export default Avatar;
