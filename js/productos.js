document.addEventListener("DOMContentLoaded", async () => {
  const productsController = new ProductsController();

  const urlParams = new URLSearchParams(window.location.search);
  let categoriaBusqueda = urlParams.get("categoria");

  // Compatibilidad con el link antiguo del nav
  if (categoriaBusqueda && categoriaBusqueda.toLowerCase() === "conectores e cables") {
    categoriaBusqueda = "Conectores y cables";
  }

  const tituloCatalogo = document.getElementById("titulo-catalogo");
  if (tituloCatalogo) {
    tituloCatalogo.textContent = categoriaBusqueda
      ? `CATÁLOGO DE ${categoriaBusqueda.toUpperCase()}`
      : "CATÁLOGO DE PRODUCTOS";
  }

  const container = document.getElementById("productos-grid");
  if (!container) return;

  try {
    const todos = await productsController.getAll();
    const productos = productsController.filterByCategory(todos, categoriaBusqueda);

    if (productos.length === 0) {
      const mensaje = categoriaBusqueda
        ? `No se encontraron productos en la categoría "${categoriaBusqueda}".`
        : "Aún no hay productos disponibles.";
      container.innerHTML = `<div class="col-12 text-center my-5 text-white"><h3>${mensaje}</h3></div>`;
      return;
    }

    container.innerHTML = productos
      .map((p) => `
        <div class="col-md-4 mb-4">
          <div class="card h-100 tarjeta-custom border-0 rounded-3 overflow-hidden">
            <div class="tarjeta-custom__img-container text-center p-2">
              <img src="${normalizarImagenProducto(p.imagenUrl) || "../img/default.jpg"}"
                   class="img-fluid" alt="${p.nombre}" style="max-height: 200px; object-fit: contain;">
            </div>
            <div class="card-body card-body-custom d-flex flex-column">
              <h5 class="card-title-custom mb-2">${p.nombre}</h5>
              <p class="descripcion-producto mb-4">${p.descripcion ?? ""}</p>
              <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                <span class="precio-custom">$${Number(p.precio).toFixed(2)} MXN</span>
                <button class="btn btn-carrito-custom d-flex align-items-center justify-content-center"
                        aria-label="Agregar al carrito" data-id="${p.idProducto}">
                  <i class="bi bi-cart-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>`)
      .join("");
  } catch (error) {
    console.error(error);
    container.innerHTML = `<div class="col-12 text-center my-5 text-white"><h3>No se pudo conectar con el servidor.</h3></div>`;
  }
});