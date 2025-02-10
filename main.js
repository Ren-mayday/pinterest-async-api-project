import "./style.css";
import { NavButton } from "./src/components/NavButton/NavButton";
import { SearchBarInput } from "./src/components/SearchBarInput/SearchBarInput";
import { IconButton } from "./src/components/IconButton/IconButton";

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
divLeftSideNav.className = "left-side-menu"; //* Añado una class
navBar.appendChild(divLeftSideNav);

//!Paso 4: Crear un elemento img que será el logo
const imgLogo = document.createElement("img");
imgLogo.src = "/assets/Pinterest.svg.png"; //* Añado la imagen
imgLogo.alt = "Pinterest Logo"; //* Añado un alt text
imgLogo.className = "pinterestLogo"; //* Añado una class
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
  onSearch: handleSearch, // Pass the handleSearch function
});
navBar.appendChild(searchBar); // Añadir el SearchBarInput al nav

//? LADO DERECHO DEL MENÚ
//! Paso 6: Crear un div con la class .right-side-meu
const divRightSideNav = document.createElement("div");
divRightSideNav.className = "right-side-menu"; // Añado una class
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
const loadingIndicator = document.createElement("div"); // Se crea un div como indicador de carga
loadingIndicator.className = "loading"; // Asigno la clase para poder aplicarle estilos desde CSS
loadingIndicator.style.display = "none"; // Oculto inicialmente con style.display = "none"
loadingIndicator.textContent = "Cargando imágenes..."; // Añado el texto para indicar el estado de carga
gallerySection.appendChild(loadingIndicator); // Lo añado al contenedor gallerySection

//! Paso 9: Función para obtener imágenes de Unsplash
async function fetchImages(query = null, page = 1) {
  //Declaro una función async para hacer una solicitud a la API de Unsplash.
  // Recibe dos parámetros query: si se proporciona, se usa para buscar imágenes por palabra clave.
  //page: indica la página de resultados a cargar (por defecto es 1)

  if (isLoading) return; //Evita hacer múltiples solicitudes simultáneas verificando la variable isLoading
  // si ya se está cargando contenido, la función se detiene (return)

  isLoading = true; // Marca que se está cargando
  loadingIndicator.style.display = "block"; // Muestra el indicador de carga

  try {
    let url; // Declaración de la URL que almacenará la URL de la API
    const params = new URLSearchParams({
      // para manejar los parámetros de la consulta
      client_id: accessKey, // la clave de la API de Unsplash (acesskey)
      page: page, // número de páginas
      per_page: 30, // cantidad de imágenes por página
    });

    if (query) {
      params.append("query", query);
      //si hay una búsqueda (query), se usa la API de búsqueda (/search/photoes)
      url = `https://api.unsplash.com/search/photos?${params}`;
    } else {
      // si no hay búsqueda, se usa la API de imágenes aleatorias (/photos)
      url = `https://api.unsplash.com/photos?${params}`;
    }

    const response = await fetch(url); // Se realiza la solicitud de fetch con la URL completa
    if (!response.ok) {
      // si la respuesta es exitosa (!response.ok), lanza un error.
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // convierte la respuesta en un objeto json (data)
    return query ? data.results : data; // si una búsqueda (query), devuelve data.results (array con imágenes). Si no, devuelve data (array con imágenes aleatorias)
  } catch (error) {
    // captura errores y muestra un mensaje en la consola
    console.error("Error fetching images:", error);
    return []; // devulve un array vació si hay un error
  } finally {
    // se ejecuta siempre al finalizar
    isLoading = false; // marca isLoading = false para permitir nuevas solicitudes
    loadingIndicator.style.display = "none"; // oculta el indicador de carga
  }
}

function displayImages(images) {
  const existingNoResults = imageGallery.querySelector(".no-results");
  if (existingNoResults) {
    existingNoResults.remove();
  }

  if (!images || images.length === 0) {
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.textContent =
      "No se encuentran imágenes con esta búsqueda. Prueba con otra búsqueda.";
    imageGallery.appendChild(noResults);
    return;
  }

  images.forEach((image) => {
    const imgContainer = document.createElement("div");
    imgContainer.className = "image-container";

    const img = document.createElement("img");
    img.src = image.urls.regular;
    img.alt = image.alt_description || "Unsplash Image";
    img.className = "gallery-image";

    img.addEventListener("load", () => {
      imgContainer.style.height = `${img.height}px`;
    });

    imgContainer.appendChild(img);
    imageGallery.appendChild(imgContainer);
  });
}

//* FUNCIÓN PARA MANEJAR LA BÚSQUEDA
//! Paso 10
async function handleSearch(query) {
  imageGallery.innerHTML = "";
  currentSearch = query.trim();
  currentPage = 1;

  const images = await fetchImages(currentSearch, currentPage);
  displayImages(images);
}

//* CONFIGURAR LOS EVENTOS DE BÚSQUEDA
function setupSearchListeners() {
  const searchInput = document.querySelector(".search-input"); // seleccionar el input de búsqueda

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      handleSearch(searchInput.value);
    }
  });
}

// Llama a la función para configurar los eventos
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
//Borra imágenes y restablece el buscador al hacer click en el logo. Carga imágenes aleatorias.

window.addEventListener("scroll", async () => {
  // Detecta si el usuario se acerca al final de la página (-1000px del final)
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 1000
  ) {
    currentPage++; // incrementa la página
    const images = await fetchImages(currentSearch, currentPage); // carga y muestra imágenes
    displayImages(images);
  }
});

//* CARGA INICIAL DE IMÁGENES
(async () => {
  const images = await fetchImages();
  displayImages(images);
})();

// Llama fetchImages()) y displayImages(images) automáticamente al cargar la página
