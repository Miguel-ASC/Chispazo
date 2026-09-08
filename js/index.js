// =========================================================
// index.js
// Punto de entrada: crea el controlador, agrega 10 productos
// de muestra y los renderiza en el grid de la página.
// =========================================================

// 1. Instanciamos el controlador de productos
//    (el constructor ya intenta cargar productos guardados en localStorage)
const productsController = new ProductsController();

// 2. Creamos los 10 productos de muestra SOLO si todavía no hay nada
//    guardado en localStorage (para no duplicarlos en cada recarga)
if (productsController.items.length === 0) {
  productsController.addProduct(
    "Resistencias",
    "Valores disponibles: (10W a 1MW). Alta precisión para control de corriente en circuitos.",
    "15.00",
    "img/Resistencias.jpg",
    "2024-05-01",
    "Componentes Pasivos"
  );

  productsController.addProduct(
    "Capacitores",
    "Valores disponibles: (10pF–100nF). Filtrado de señal y desacople en fuentes de poder.",
    "25.00",
    "img/Capacitores.jpg",
    "2024-05-01",
    "Componentes Pasivos"
  );

  productsController.addProduct(
    "Semiconductores",
    "Valores disponibles: 1N4001–1N4007. Diodos rectificadores de propósito general.",
    "30.00",
    "img/Diodos.jpg",
    "2024-05-02",
    "Semiconductores"
  );

  productsController.addProduct(
    "Bobinas e Inductores",
    "Valores disponibles: (10uH–10mH). Almacenamiento de energía en campos magnéticos.",
    "45.00",
    "img/Bobinas.jpg",
    "2024-05-02",
    "Componentes Pasivos"
  );

  productsController.addProduct(
    "Conectores y Cables",
    "Valores disponibles: 2.54mm (macho/hembra). Cables Dupont para prototipado rápido.",
    "35.00",
    "img/Conectores.jpg",
    "2024-05-03",
    "Conectores y Cables"
  );

  productsController.addProduct(
    "Módulos y Placas",
    "Wi-Fi & Bluetooth dual core con antenas integradas.",
    "145.00",
    "img/esp32_esp8266.jpg",
    "2024-05-03",
    "Microcontroladores"
  );

  productsController.addProduct(
    "Sensores",
    "Valores disponibles: (MQ-2, MQ-3, MQ-7, MQ-135). Detección analógica y digital.",
    "85.00",
    "img/sensor-de-gas-y-aire-MQ-2.jpg",
    "2024-05-04",
    "Sensores"
  );

  productsController.addProduct(
    "Actuadores",
    "Valores disponibles: (12V, 24V). Control de flujo magnético en sistemas neumáticos o de agua.",
    "190.00",
    "img/valvulas_solenoides24v.jpg",
    "2024-05-04",
    "Actuadores"
  );

  productsController.addProduct(
    "Alimentación",
    "Valores disponibles: (LiPo, Li-ion 18650, alcalinas). Soluciones portátiles de energía.",
    "120.00",
    "img/Baterías (LiPo, Li-ion 18650, alcalinas).jpg",
    "2024-05-05",
    "Alimentación"
  );

  productsController.addProduct(
    "Interfaz y entrada",
    "Pantallas táctiles resistivas y capacitivas para proyectos con interacción de usuario.",
    "120.00",
    "img/pantalla tactil resistiva-capacitiva.jpg",
    "2024-05-05",
    "Interfaz y Entrada"
  );
}

// 3. Verificamos en consola que los 10 productos se agregaron correctamente
console.log("Productos agregados:", productsController.items);
console.log("Total de productos:", productsController.items.length);

// =========================================================
// 4. Función que construye el HTML de UNA tarjeta de producto
//    (reutiliza las mismas clases CSS que ya tienes en tu HTML)
// =========================================================
function createProductCard(product) {
  return `
    <div class="col-md-4 mb-4">
      <div class="card h-100 tarjeta-custom border-0 rounded-3 overflow-hidden">
        <div class="tarjeta-custom__img-container">
          <img src="${product.img}" class="img-fluid" alt="${product.name}">
        </div>
        <div class="card-body card-body-custom d-flex flex-column">
          <h5 class="card-title-custom mb-2">${product.name}</h5>
          <p class="descripcion-producto mb-4">${product.description}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
            <span class="precio-custom">$${product.precio} MXN</span>
            <button class="btn btn-carrito-custom d-flex align-items-center justify-content-center"
              aria-label="Agregar al carrito" data-id="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000"
                class="bi bi-cart-fill" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L1.01 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================
// 5. Función que recorre this.items y los pinta todos juntos
//    en el contenedor del grid
// =========================================================
function renderProducts(products) {
  const container = document.getElementById("productos-grid");

  if (!container) {
    console.error(
      'No se encontró el elemento con id="productos-grid". Agrega ese id al <div class="row g-4"> de tu HTML.'
    );
    return;
  }

  container.innerHTML = ""; // limpiamos el grid antes de pintar

  products.forEach((product) => {
    container.innerHTML += createProductCard(product);
  });
}

// 6. Esperamos a que el DOM esté listo y pintamos SOLO los productos activos
//    (los eliminados desde el panel admin tienen activo = false y no se muestran aquí)
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(productsController.getActiveProducts());
});
