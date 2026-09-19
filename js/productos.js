document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. GESTIÓN Y RENDERIZADO DEL CATÁLOGO
  // ==========================================
  const productsController = new ProductsController(); //[cite: 21]

  // Obtener la categoría desde la URL
  const urlParams = new URLSearchParams(window.location.search); //[cite: 21]
  let categoriaURL = urlParams.get("categoria"); //[cite: 21]

  // SI NO HAY PARÁMETRO EN LA URL, FORZAR "Resistencias" POR DEFECTO
  if (!categoriaURL || categoriaURL.trim() === "") {
    categoriaURL = "Resistencias"; //[cite: 21]
  }

  // Normalizar el nombre de la categoría
  let categoriaBusqueda = categoriaURL; //[cite: 21]
  if (
    categoriaURL.toLowerCase() === "conectores e cables" ||
    categoriaURL.toLowerCase() === "conectores y cables"
  ) {
    categoriaBusqueda = "Conectores y cables"; //[cite: 21]
  }

  // Actualizar el título principal de la página
  const tituloCatalogo = document.getElementById("titulo-catalogo"); //[cite: 21]
  if (tituloCatalogo) {
    tituloCatalogo.textContent = `CATÁLOGO DE ${categoriaBusqueda.toUpperCase()}`; //[cite: 21]
  }

  // Obtener únicamente los productos filtrados por la categoría elegida
  const productosAMostrar = productsController.getProductsByCategory(categoriaBusqueda); //[cite: 21]

  // Pintar en el contenedor HTML
  const container = document.getElementById("productos-grid"); //[cite: 21]

  if (container) {
    container.innerHTML = ""; //[cite: 21]

    if (!productosAMostrar || productosAMostrar.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center my-5 text-white">
          <h3>No se encontraron productos en la categoría "${categoriaBusqueda}".</h3>
        </div>`; //[cite: 21]
    } else {
      const cardsHTML = productosAMostrar.map((product) => {
        const precioNumero = parseFloat(product.precio || product.price || 0); //[cite: 21]
        const precioFormateado = isNaN(precioNumero) ? "0.00" : precioNumero.toFixed(2); //[cite: 21]

        return `
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 mb-4">
            <div class="card h-100 tarjeta-custom border-0 rounded-3 overflow-hidden shadow-sm">
              <div class="tarjeta-custom__img-container text-center p-3">
                <img src="${product.img || product.image || '../img/favicon.png'}" 
                    class="img-fluid tarjeta-img" 
                    alt="${product.name}">
              </div>
              <div class="card-body card-body-custom d-flex flex-column p-3">
                <h5 class="card-title-custom mb-2">${product.name}</h5>
                <p class="descripcion-producto mb-3">${product.description}</p>
                <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                  <span class="precio-custom">$${precioFormateado} MXN</span>
                  <button class="btn btn-carrito-custom d-flex align-items-center justify-content-center" 
                          aria-label="Agregar al carrito" 
                          data-id="${product.id}">
                    <i class="bi bi-cart-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>`; //[cite: 21]
        }).join(""); //[cite: 21]

      container.innerHTML = cardsHTML; //[cite: 21]
    }
  }

  // ==========================================
  // 2. INTERACCIÓN Y CONTROL DEL MEGA SUBMENÚ (DELEGACIÓN)
  // ==========================================
  let timerOcultar;
  const esMovil = () => window.innerWidth < 768;

  // Manejar interacciones en Escritorio (mouseenter / mouseleave)
  document.addEventListener("mouseover", (e) => {
    if (esMovil()) return;
    const container = e.target.closest(".dropdown-menu-container");
    if (container) {
      clearTimeout(timerOcultar);
      const submenu = container.querySelector(".mega-submenu");
      if (submenu) submenu.classList.add("activo");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (esMovil()) return;
    const container = e.target.closest(".dropdown-menu-container");
    if (container) {
      const submenu = container.querySelector(".mega-submenu");
      if (submenu) {
        timerOcultar = setTimeout(() => {
          submenu.classList.remove("activo");
        }, 300);
      }
    }
  });

  // Manejar Clics en Móvil (Tap para desplegar / cerrar)
  document.addEventListener("click", (e) => {
    const dropdownContainer = e.target.closest(".dropdown-menu-container");

    if (esMovil()) {
      if (dropdownContainer) {
        const enlaceProductos = e.target.closest("a");
        const megaSubmenu = dropdownContainer.querySelector(".mega-submenu");

        // Si se hace clic en el enlace principal del menú desplegable
        if (enlaceProductos && megaSubmenu && !e.target.closest(".mega-submenu")) {
          if (!megaSubmenu.classList.contains("activo")) {
            e.preventDefault(); // Evita navegar si el submenú está cerrado
            megaSubmenu.classList.add("activo");
          }
        }
      } else {
        // Clic fuera del menú: cerrar todos los mega submenús activos en móvil
        document.querySelectorAll(".mega-submenu.activo").forEach((menu) => {
          menu.classList.remove("activo");
        });
      }
    }
  });
});