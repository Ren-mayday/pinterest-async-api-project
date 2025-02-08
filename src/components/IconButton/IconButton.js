import "./IconButton.css";

export const IconButton = ({ text }) => {
  const iconButton = document.createElement("button");
  iconButton.textContent = text;
  iconButton.className = "icon-button";
  return iconButton;
};
