function normalizarImagenProducto(ruta) {
  if (!ruta || ruta.startsWith("data:") || /^https?:\/\//.test(ruta)) {
    return ruta;
  }
  const nombreArchivo = ruta.replace(/^.*(?:\/|^)img\//, "");
  return new URL(`../img/${nombreArchivo}`, document.baseURI).href;
}

function seedProductosIniciales(productsController) {
  if (productsController.items.length > 0) return;

  const seed = [
    ["Resistencias", "Valores disponibles: (10W a 1MW). Alta precisión para control de corriente en circuitos.", "15.00", "../img/Resistencias.jpg", "2024-05-01", "Resistencias"],
    ["Capacitores", "Valores disponibles: (10pF–100nF). Filtrado de señal y desacople en fuentes de poder.", "25.00", "../img/Capacitores.jpg", "2024-05-01", "Capacitores"],
    ["Diodos rectificadores", "Valores disponibles: 1N4001–1N4007. Diodos rectificadores de propósito general.", "30.00", "../img/Diodos.jpg", "2024-05-02", "Semiconductores"],
    ["Bobinas e Inductores", "Valores disponibles: (10uH–10mH). Almacenamiento de energía en campos magnéticos.", "45.00", "../img/Bobinas.jpg", "2024-05-02", "Bobinas e inductores"],
    ["Conectores y Cables", "Valores disponibles: 2.54mm (macho/hembra). Cables Dupont para prototipado rápido.", "35.00", "../img/Conectores.jpg", "2024-05-03", "Conectores y cables"],
    ["Módulo ESP32", "Wi-Fi & Bluetooth dual core con antenas integradas.", "145.00", "../img/esp32_esp8266.jpg", "2024-05-03", "Módulos y placas"],
    ["Sensor de gas MQ-2", "Valores disponibles: (MQ-2, MQ-3, MQ-7, MQ-135). Detección analógica y digital.", "85.00", "../img/sensor-de-gas-y-aire-MQ-2.jpg", "2024-05-04", "Sensores"],
    ["Válvula solenoide", "Valores disponibles: (12V, 24V). Control de flujo magnético en sistemas neumáticos o de agua.", "190.00", "../img/valvulas_solenoides24v.jpg", "2024-05-04", "Actuadores"],
    ["Baterías recargables", "Valores disponibles: (LiPo, Li-ion 18650, alcalinas). Soluciones portátiles de energía.", "120.00", "../img/Baterías (LiPo, Li-ion 18650, alcalinas).jpg", "2024-05-05", "Alimentación"],
    ["Pantalla táctil", "Pantallas táctiles resistivas y capacitivas para proyectos con interacción de usuario.", "120.00", "../img/pantalla tactil resistiva-capacitiva.jpg", "2024-05-05", "Interfaz y entrada"],
  ];

  seed.forEach(([name, description, precio, img, createdAt, categoria]) => {
    productsController.addProduct(name, description, precio, normalizarImagenProducto(img), createdAt, categoria);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. GESTIÓN Y RENDERIZADO DEL CATÁLOGO
  // ==========================================
  const productsController = new ProductsController();

  seedProductosIniciales(productsController);

  // Obtener la categoría desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  let categoriaURL = urlParams.get("categoria");

  // Si se entra directo a productos.html sin parámetros, forzamos "Resistencias"
  if (!categoriaURL) {
    categoriaURL = "Resistencias";
  }

  // Normalizar el nombre de la categoría para corregir el typo del
  // submenú ("Conectores e cables" vs "Conectores y cables")
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

  // Obtener productos filtrados (activos + de esa categoría) desde el controller.
  // Esto incluye tanto los productos sembrados como cualquier producto
  // nuevo creado desde admin.html, porque ambos comparten localStorage.
  const productosAMostrar = productsController.getProductsByCategory(categoriaBusqueda);

  // Pintar en el contenedor HTML
  const container = document.getElementById("productos-grid");

  if (container) {
    container.innerHTML = "";

    if (!productosAMostrar || productosAMostrar.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center my-5 text-white">
          <h3>No se encontraron productos en la categoría "${categoriaBusqueda}".</h3>
        </div>`;
    } else {
      const cardsHTML = productosAMostrar.map((product) => {
        const precioNumero = parseFloat(product.precio || product.price || 0);
        const precioFormateado = isNaN(precioNumero) ? "0.00" : precioNumero.toFixed(2);
        const imgSrc = normalizarImagenProducto(product.img || product.image) || "../img/default.jpg";

        return `
          <div class="col-md-4 mb-4">
            <div class="card h-100 tarjeta-custom border-0 rounded-3 overflow-hidden">
              <div class="tarjeta-custom__img-container text-center p-2">
                <img src="${imgSrc}" class="img-fluid" alt="${product.name}" style="max-height: 200px; object-fit: contain;">
              </div>
              <div class="card-body card-body-custom d-flex flex-column">
                <h5 class="card-title-custom mb-2">${product.name}</h5>
                <p class="descripcion-producto mb-4">${product.description}</p>
                <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                  <span class="precio-custom">$${precioFormateado} MXN</span>
                  <button class="btn btn-carrito-custom d-flex align-items-center justify-content-center" aria-label="Agregar al carrito" data-id="${product.id}">
                    <i class="bi bi-cart-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
      }).join("");

      container.innerHTML = cardsHTML;
    }
  }
});