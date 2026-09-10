document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. GESTIÓN Y RENDERIZADO DEL CATÁLOGO
  // ==========================================
  const productsController = new ProductsController();

  // Obtener la categoría desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  let categoriaURL = urlParams.get("categoria");

  // Si se entra directo a productos.html sin parámetros, forzamos "Resistencias"
  if (!categoriaURL) {
    categoriaURL = "Resistencias";
  }

  // Normalizar el nombre de la categoría para evitar errores de redacción (ej. "e" vs "y")
  let categoriaBusqueda = categoriaURL;
  if (
    categoriaURL.toLowerCase() === "conectores e cables" ||
    categoriaURL.toLowerCase() === "conectores y cables"
  ) {
    categoriaBusqueda = "Conectores y cables";
  }

  // Actualizar el título principal de la página
  const tituloCatalogo = document.getElementById("titulo-catalogo");
  if (tituloCatalogo) {
    tituloCatalogo.textContent = `CATÁLOGO DE ${categoriaBusqueda.toUpperCase()}`;
  }

  // Obtener productos filtrados desde el controller
  const productosAMostrar = productsController.getProductsByCategory(categoriaBusqueda);

  // Pintar en el contenedor HTML
  const container = document.getElementById("productos-grid");

  if (container) {
    container.innerHTML = "";

    // Mensaje si la categoría seleccionada no tiene productos asignados
    if (!productosAMostrar || productosAMostrar.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center my-5 text-white">
          <h3>No se encontraron productos en la categoría "${categoriaBusqueda}".</h3>
        </div>`;
    } else {
      // Acumulamos las tarjetas en un array para un solo renderizado en el DOM
      const cardsHTML = productosAMostrar.map((product) => {
        // Validar que el precio sea numérico para evitar NaNs
        const precioNumero = parseFloat(product.precio || product.price || 0);
        const precioFormateado = isNaN(precioNumero) ? "0.00" : precioNumero.toFixed(2);

        return `
          <div class="col-md-4 mb-4">
            <div class="card h-100 tarjeta-custom border-0 rounded-3 overflow-hidden">
              <div class="tarjeta-custom__img-container text-center p-2">
                <img src="${product.img || product.image || 'img/default.jpg'}" class="img-fluid" alt="${product.name}" style="max-height: 200px; object-fit: contain;">
              </div>
              <div class="card-body card-body-custom d-flex flex-column">
                <h5 class="card-title-custom mb-2">${product.name}</h5>
                <p class="descripcion-producto mb-4">${product.description}</p>
                <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                  <span class="precio-custom">$${precioFormateado} MXN</span>
                  <button class="btn btn-carrito-custom d-flex align-items-center justify-content-center" aria-label="Agregar al carrito">
                    <i class="bi bi-cart-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
      }).join("");

      // Inyección única al DOM
      container.innerHTML = cardsHTML;
    }
  }

  // ==========================================
  // 2. INTERACCIÓN Y CONTROL DEL MEGA SUBMENÚ
  // ==========================================
  const dropdownContainer = document.querySelector(".dropdown-menu-container");
  const megaSubmenu = document.querySelector(".mega-submenu");

  if (dropdownContainer && megaSubmenu) {
    let timerOcultar;

    // Función para mostrar y mantener el menú abierto
    const mantenerMenuAbierto = () => {
      clearTimeout(timerOcultar);
      megaSubmenu.classList.add("activo");
    };

    // Función para cerrar el menú ÚNICAMENTE tras un margen al retirar el cursor
    const programarCierreMenu = () => {
      timerOcultar = setTimeout(() => {
        megaSubmenu.classList.remove("activo");
      }, 250);
    };

    // Eventos de entrada y salida del cursor en la etiqueta "Productos ▾"
    dropdownContainer.addEventListener("mouseenter", mantenerMenuAbierto);
    dropdownContainer.addEventListener("mouseleave", programarCierreMenu);

    // Eventos de entrada y salida del cursor sobre todo el contenedor del submenú
    megaSubmenu.addEventListener("mouseenter", mantenerMenuAbierto);
    megaSubmenu.addEventListener("mouseleave", programarCierreMenu);
  }
});