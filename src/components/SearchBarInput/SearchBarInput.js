import "./SearchBarInput.css";

export const SearchBarInput = ({ text, onSearch }) => {
  const form = document.createElement("form");

  // Previene el evento por defecto
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = searchInput.value.trim();
    if (searchValue) {
      onSearch(searchValue);
    }
  });

  // Creo un input container
  const searchDiv = document.createElement("div");
  searchDiv.classList.add("search");

  // Creo el input
  const searchInput = document.createElement("input");
  searchInput.classList.add("search-input");
  searchInput.type = "text";
  searchInput.placeholder = text;

  // Añado el manejo de eventos de entrada para cuando se borra
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      onSearch(""); // Activar la búsqueda con un string vacío para restablecer las imágenes aleatorias
    }
  });

  // Creo el search button
  const searchButton = document.createElement("button");
  searchButton.type = "submit";
  searchButton.textContent = "🔎";
  searchButton.classList.add("search-button");

  // Añado el event listener para el search button
  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const searchValue = searchInput.value.trim();
    if (searchValue) {
      onSearch(searchValue);
    }
  });

  // Añado elementos al container
  searchDiv.appendChild(searchInput);
  searchDiv.appendChild(searchButton);

  // Añado elementos al the form
  form.appendChild(searchDiv);

  return form;
};
