import "./style.css";
import { NavButton } from "./src/components/NavButton/NavButton";
import { SearchBarInput } from "./src/components/SearchBarInput/SearchBarInput";
import { IconButton } from "./src/components/IconButton/IconButton";
import pinterestLogo from "./assets/Pinterest.svg.png";

const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
let currentPage = 1;
let currentSearch = "";
let isLoading = false;

//* CREO EL HEADER
//! Paso 1: Creo el header
const header = document.createElement("header");
header.className = "main-header";
document.body.appendChild(header);

//! Paso 2: Crear el elemento nav
const navBar = document.createElement("nav");
navBar.className = "navBar";
header.appendChild(navBar);

//? LADO IZQUIERDO DEL MENÚ
//! Paso 3: Crear un div con la class .left-side-menu
const divLeftSideNav = document.createElement("div");
divLeftSideNav.className = "left-side-menu";
navBar.appendChild(divLeftSideNav);

//!Paso 4: Crear un elemento img que será el logo
const imgLogo = document.createElement("img");
imgLogo.src = pinterestLogo;
imgLogo.alt = "Pinterest Logo";
imgLogo.className = "pinterestLogo";
divLeftSideNav.appendChild(imgLogo);

//? BOTONES DE NAVEGACIÓN
divLeftSideNav.append(
  NavButton({ text: "Inicio", isActive: true, className: "inicio-button" }),
  NavButton({ text: "Explorar", className: "explorar-button" }),
  NavButton({ text: "Crear", className: "crear-button" })
);

//? BARRA DE BÚSQUEDA
//! Paso 5: Crear y definir el texto para el SearchBarInput
const searchBar = SearchBarInput({
  text: "Buscar imágenes...",
  onSearch: handleSearch, 
});
navBar.appendChild(searchBar);

//? LADO DERECHO DEL MENÚ
//! Paso 6: Crear un div con la class .right-side-meu
const divRightSideNav = document.createElement("div");
divRightSideNav.className = "right-side-menu";
navBar.appendChild(divRightSideNav);

//? BOTONES DEL MENÚ
divRightSideNav.append(
  IconButton({ text: "🔔" }),
  IconButton({ text: "💬" }),
  IconButton({ text: "⚙️" })
);

/* -------- Fin del navbar y comienzo del contenido principal -------- */
//* CREO LA SECCIÓN MAIN - LA GALERÍA DE IMG
//! Paso 7: Crear un main que dará paso al contenido principal
const main = document.createElement("main");
main.className = "main-content";
document.body.appendChild(main);

//? Crear la section donde irán las imágenes
const gallerySection = document.createElement("section");
gallerySection.className = "gallery-section";
main.appendChild(gallerySection);

//? Crear el título h1
const galleryTitle = document.createElement("h1");
galleryTitle.textContent = "Galería de imágenes";
gallerySection.appendChild(galleryTitle);

//? Crear un contenedor de imágenes dentro de la galería
const imageGallery = document.createElement("div");
imageGallery.className = "image-gallery";
gallerySection.appendChild(imageGallery);

/* ------------------------------------------------------------------------------------- */

/* ---------------------- FUNCIONES ASÍNCRONAS --------------------------------- */
//* Unsplash API KEY

//! Paso 8: Crear un Loading indicator
const loadingIndicator = document.createElement("div");
loadingIndicator.className = "loading";
loadingIndicator.style.display = "none";
loadingIndicator.textContent = "Cargando imágenes...";
gallerySection.appendChild(loadingIndicator);

//! Función para mostrar imágenes en la galería
function displayImages(images) {
  console.log("Displaying images:", images);

  const existingNoResults = imageGallery.querySelector(".no-results");
  if (existingNoResults) {
    existingNoResults.remove();
  }

  if (!images || images.length === 0) {
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.textContent = "No se encontraron imágenes.";
    imageGallery.appendChild(noResults);
    return;
  }

  images.forEach((image) => {
    console.log("Adding image:", image.urls?.regular);

    const imgContainer = document.createElement("div");
    imgContainer.className = "image-container";

    const img = document.createElement("img");
    img.src = image.urls.regular;
    img.alt = image.alt_description || "Imagen de Unsplash";
    img.className = "gallery-image";

    imgContainer.appendChild(img);
    imageGallery.appendChild(imgContainer);
  });
}

//! Paso 9: Función para obtener imágenes de Unsplash
async function fetchImages(query = null, page = 1) {
  if (isLoading) return;

  isLoading = true;
  loadingIndicator.style.display = "block";

  try {
    let url;
    const params = new URLSearchParams({
      client_id: accessKey,
      page: page,
      per_page: 30,
    });

    if (query) {
      params.append("query", query);
      url = `https://api.unsplash.com/search/photos?${params}`;
    } else {
      url = `https://api.unsplash.com/photos?${params}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return query ? data.results : data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  } finally {
    isLoading = false;
    loadingIndicator.style.display = "none";
  }
}

//* FUNCIÓN PARA MANEJAR LA BÚSQUEDA
async function handleSearch(query) {
  imageGallery.innerHTML = "";
  currentSearch = query.trim();
  currentPage = 1;

  let images = await fetchImages(currentSearch, currentPage);

  // Si no hay imágenes, automáticamente busca "gatos" sin mostrar alerta
  if (!images || images.length === 0) {
    images = await fetchImages("gatos", 1);
  }

  // Siempre muestra imágenes, ya sea de la búsqueda o de "gatos"
  displayImages(images);
  document.querySelector(".search-input").value = "";
}


//* CONFIGURAR LOS EVENTOS DE BÚSQUEDA
function setupSearchListeners() {
  const searchInput = document.querySelector(".search-input");

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      handleSearch(searchInput.value);
    }
  });
}

setupSearchListeners();

//* REESTABLECER IMÁGENES AL HACER CLICK EN EL LOGO
imgLogo.addEventListener("click", async () => {
  imageGallery.innerHTML = "";
  document.querySelector(".search-input").value = "";
  currentSearch = "";
  currentPage = 1;
  const images = await fetchImages();
  displayImages(images);
});

//* CARGA INICIAL DE IMÁGENES
(async () => {
  const images = await fetchImages();
  displayImages(images);
})();
