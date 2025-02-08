import "./NavButton.css";

export const NavButton = ({ text, isActive = false, className = "" }) => {
  const navButton = document.createElement("button");
  navButton.textContent = text;

  // Añadir clase activa si isActive es true
  if (isActive) {
    navButton.classList.add("nav-button--active");
  }

  // Añadir la clase adicional si se proporciona
  if (className) {
    navButton.classList.add(className);
  }

  return navButton;
};
