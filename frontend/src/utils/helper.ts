export const secretEmail = (email: string): string => {
  const [username, domain] = email.split("@");
  const secretUser = username.substring(0, 2) + "*".repeat(username.length - 2);
  return `${secretUser}@${domain}`;
};

export const readTime = (content: { __html: string }): number => {
  const averageReading = 225; // Average reading speed in words per minute

  const div = document.createElement("div");
  div.innerHTML = content.__html; // Set the inner HTML to parse it

  const textContext = div.textContent || div.innerHTML; // Get the text content
  const words = textContext.trim().split(/\s+/); // Split by whitespace
  return Math.ceil(words.length / averageReading); // Return reading time in minutes
};

export const formatNum = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B"; // Billion
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M"; // Million
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K"; // Thousand
  } else {
    return num.toString(); // Return as is for smaller numbers
  }
};
