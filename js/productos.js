
function normalizarImagenProducto(ruta) {
  if (!ruta || ruta.startsWith("data:") || /^https?:\/\//.test(ruta)) {
    return ruta;
  }
  const nombreArchivo = ruta.replace(/^.*(?:\/|^)img\//, "");
  return new URL(`../img/${nombreArchivo}`, document.baseURI).href;
}

function normalizarCategoria(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
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

function convertirProductoAPI(producto) {
  return {
    id: producto.idProducto,
    name: producto.nombre,
    description: producto.descripcion || "",
    precio: producto.precio,
    img: producto.imagenUrl || "../img/default.jpg",
    createdAt: producto.createdAt || "",
    categoria: producto.categoria?.nombre || producto.categoria?.nombreCategoria || "",
    activo: producto.activo !== false,
  };
}

async function cargarProductos(productsController) {
  try {
    const productosAPI = await ChispazoAPI.listarProductos();
    productsController.items = productosAPI.map(convertirProductoAPI);
    productsController.currentId = productsController.items.reduce(
      (maximo, producto) => Math.max(maximo, Number(producto.id) || 0),
      0,
    );
    return true;
  } catch (error) {
    console.warn("No se pudo cargar el catálogo desde la API; se usará el respaldo local.", error);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // ==========================================
  // 1. GESTIÓN Y RENDERIZADO DEL CATÁLOGO
  // ==========================================
  const productsController = new ProductsController();

  const apiDisponible = await cargarProductos(productsController);
  if (!apiDisponible) seedProductosIniciales(productsController);

  const urlParams = new URLSearchParams(window.location.search);
  const categoriaURL = urlParams.get("categoria");
  const terminoBusqueda = urlParams.get("buscar") || "";

  const categoriaBusqueda = categoriaURL || "";

  // Actualizar el título principal de la página
  const tituloCatalogo = document.getElementById("titulo-catalogo");
  if (tituloCatalogo) {
    tituloCatalogo.textContent = categoriaBusqueda
      ? `CATÁLOGO DE ${categoriaBusqueda.toUpperCase()}`
      : terminoBusqueda
        ? `RESULTADOS PARA "${terminoBusqueda}"`
        : "CATÁLOGO DE PRODUCTOS";
  }

  const productosAMostrar = productsController.getActiveProducts().filter((producto) => {
    const coincideCategoria = !categoriaBusqueda
      || normalizarCategoria(producto.categoria) === normalizarCategoria(categoriaBusqueda);
    const texto = normalizarCategoria(
      `${producto.name} ${producto.description} ${producto.categoria}`,
    );
    const coincideBusqueda = !terminoBusqueda
      || texto.includes(normalizarCategoria(terminoBusqueda));
    return coincideCategoria && coincideBusqueda;
  });

  const container = document.getElementById("productos-grid");

  if (container) {
    container.innerHTML = "";

    if (!productosAMostrar || productosAMostrar.length === 0) {
      const mensaje = terminoBusqueda
        ? `No se encontraron productos para "${terminoBusqueda}".`
        : categoriaBusqueda
          ? `No se encontraron productos en la categoría "${categoriaBusqueda}".`
        : "Aún no hay productos disponibles.";
      container.innerHTML = `
        <div class="col-12 text-center my-5 text-white">
          <h3>${mensaje}</h3>
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