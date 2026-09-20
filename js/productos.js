document.addEventListener("DOMContentLoaded", () => {
    // Helper para normalizar textos (elimina acentos, mayúsculas y espacios extra)
    const normalizarTexto = (texto) => {
        if (!texto) return "";
        return String(texto)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    const renderizarCatalogo = () => {
        // ==========================================
        // 1. OBTENER Y NORMALIZAR CATEGORÍA DE LA URL
        // ==========================================
        const urlParams = new URLSearchParams(window.location.search);
        let categoriaURL = urlParams.get("categoria") || "Resistencias";

        // Normalización específica para casos conocidos
        let categoriaBusqueda = categoriaURL;
        if (
            normalizarTexto(categoriaURL) === "conectores e cables" ||
            normalizarTexto(categoriaURL) === "conectores y cables"
        ) {
            categoriaBusqueda = "Conectores y cables";
        }

        // Actualizar título en el HTML
        const tituloCatalogo = document.getElementById("titulo-catalogo");
        if (tituloCatalogo) {
            tituloCatalogo.textContent = `CATÁLOGO DE ${categoriaBusqueda.toUpperCase()}`;
        }

        // ==========================================
        // 2. OBTENER DATOS DE LOCALSTORAGE CON PRODUCTSCONTROLLER
        // ==========================================
        const controller = new ProductsController();
        const productosGuardados = controller.items || [];

        // ==========================================
        // 3. FILTRADO STRICTO (Categoría + Estado Activo)
        // ==========================================
        const productosAMostrar = productosGuardados.filter((product) => {
            // A) Verificar Categoría
            const catProducto = product.categoria || product.category || product.categoriaName || product.tipo || "";
            const coincideCategoria = normalizarTexto(catProducto) === normalizarTexto(categoriaBusqueda);

            // B) Verificar que esté ACTIVO de forma estricta (excluye false y undefined)
            const esActivo = product.activo === true || product.activo === "true";

            return coincideCategoria && esActivo;
        });

        // ==========================================
        // 4. RENDERIZAR EN LA GRID
        // ==========================================
        const container = document.getElementById("productos-grid");

        if (container) {
            container.innerHTML = ""; // Limpiar productos mock

            if (productosAMostrar.length === 0) {
                container.innerHTML = `
            <div class="col-12 text-center my-5 text-white">
              <h3>No hay productos disponibles en la categoría "${categoriaBusqueda}".</h3>
            </div>`;
            } else {
                const cardsHTML = productosAMostrar
                    .map((product) => {
                        const nombre = product.name || product.nombre || "Producto sin nombre";
                        const descripcion = product.description || product.descripcion || "Sin descripción disponible.";
                        const imagen = product.img || product.image || product.imagen || "../img/logo.png";

                        // Formatear precio
                        const precioNumero = parseFloat(product.precio || product.price || 0);
                        const precioFormateado = isNaN(precioNumero) ? "0.00" : precioNumero.toFixed(2);

                        return `
              <div class="col-md-4 mb-4">
                <div class="card h-100 tarjeta-custom border-0 rounded-3 overflow-hidden">
                  <div class="tarjeta-custom__img-container text-center p-2">
                    <img src="${imagen}" class="img-fluid" alt="${nombre}" style="max-height: 200px; object-fit: contain;">
                  </div>
                  <div class="card-body card-body-custom d-flex flex-column">
                    <h5 class="card-title-custom mb-2">${nombre}</h5>
                    <p class="descripcion-producto mb-4">${descripcion}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                      <span class="precio-custom">$${precioFormateado} MXN</span>
                      <button class="btn btn-carrito-custom d-flex align-items-center justify-content-center" aria-label="Agregar al carrito" data-id="${product.id}">
                        <i class="bi bi-cart-fill"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>`;
                    })
                    .join("");

                container.innerHTML = cardsHTML;
            }
        }
    };

    // Render inicial
    renderizarCatalogo();

    // Escuchar cambios en localStorage hechos desde admin.html en tiempo real
    window.addEventListener("storage", (e) => {
        if (e.key === "products") {
            renderizarCatalogo();
        }
    });

    // ==========================================
    // CONTROL DEL DROPDOWN Y MEGA SUBMENÚ
    // ==========================================
    const dropdownContainer = document.querySelector(".dropdown-menu-container");
    const megaSubmenu = document.querySelector(".mega-submenu");
    const botonProductos = dropdownContainer ? dropdownContainer.querySelector(".navegacion__etiqueta") : null;

    if (dropdownContainer && megaSubmenu) {
        let timerOcultar;

        // --- LÓGICA DESKTOP (Hover en >= 768px) ---
        const mantenerMenuAbierto = () => {
            if (window.innerWidth >= 768) {
                clearTimeout(timerOcultar);
                megaSubmenu.classList.add("activo");
            }
        };

        const programarCierreMenu = () => {
            if (window.innerWidth >= 768) {
                timerOcultar = setTimeout(() => {
                    megaSubmenu.classList.remove("activo");
                }, 250);
            }
        };

        dropdownContainer.addEventListener("mouseenter", mantenerMenuAbierto);
        dropdownContainer.addEventListener("mouseleave", programarCierreMenu);
        megaSubmenu.addEventListener("mouseenter", mantenerMenuAbierto);
        megaSubmenu.addEventListener("mouseleave", programarCierreMenu);

        // --- LÓGICA MÓVIL (< 768px) ---

        // 1. Clic en "Productos": Abre o Cierra el submenú y detiene la propagación
        if (botonProductos) {
            botonProductos.addEventListener("click", (e) => {
                if (window.innerWidth < 768) {
                    e.preventDefault();
                    e.stopPropagation(); // Evita que el clic llegue al listener global de document
                    megaSubmenu.classList.toggle("activo");
                }
            });
        }

        // 2. Clic en las categorías/enlaces dentro del menú: Cierra el submenú
        const enlacesSubmenu = megaSubmenu.querySelectorAll("a");
        enlacesSubmenu.forEach((enlace) => {
            enlace.addEventListener("click", () => {
                if (window.innerWidth < 768) {
                    megaSubmenu.classList.remove("activo");
                }
            });
        });

        // 3. Clic fuera del contenedor o del menú: Cierra el submenú
        document.addEventListener("click", (e) => {
            if (window.innerWidth < 768) {
                if (!dropdownContainer.contains(e.target)) {
                    megaSubmenu.classList.remove("activo");
                }
            }
        });
    }
});