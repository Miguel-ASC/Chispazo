// ---------------------------------------------------------------------------
// cart.js
// Usa las variables globales: products (array), cart (objeto {id: cantidad}),
// MAX_POR_PRODUCTO (número) y money(valor) — se asume que ya existen
// (por ejemplo definidas en data.js, cargado antes que este archivo).
// ---------------------------------------------------------------------------

const CART_STORAGE_KEY = "cart";
const MAX_POR_PRODUCTO = 10;
const storedProducts = localStorage.getItem("products");
const products = storedProducts
  ? JSON.parse(storedProducts)
      .items.filter((product) => product.activo)
      .map((product) => ({
        id: String(product.id),
        name: product.name,
        desc: product.description,
        price: Number(product.precio),
        image: product.img,
      }))
  : [];
let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}");

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function money(value) {
  return `$${value.toFixed(2)} MXN`;
}

function addToCart(id) {
  id = String(id);
  if (!products.some((product) => product.id === id)) return;
  const actual = cart[id] || 0;
  if (actual >= MAX_POR_PRODUCTO) return;
  cart[id] = actual + 1;
  saveCart();
  actualizarContadorNav();
  mostrarConfirmacion(buttonForProduct(id));
  renderCart();
  bumpCount();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  if (delta > 0 && cart[id] >= MAX_POR_PRODUCTO) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  actualizarContadorNav();
  renderCart();
}

function removeItem(id) {
  delete cart[id];
  saveCart();
  actualizarContadorNav();
  renderCart();
}

function bumpCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 250);
}

function actualizarContadorNav() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  const totalItems = Object.keys(cart).reduce((sum, id) => sum + cart[id], 0);
  el.textContent = totalItems;
  el.hidden = totalItems === 0;
  el.setAttribute(
    "aria-label",
    `${totalItems} producto${totalItems === 1 ? "" : "s"} en el carrito`,
  );
}

function buttonForProduct(id) {
  return document.querySelector(`#productos-grid button[data-id="${id}"]`);
}

function mostrarConfirmacion(button) {
  if (!button) return;

  button.classList.remove("producto-agregado");
  void button.offsetWidth;
  button.classList.add("producto-agregado");

  const confirmation = document.createElement("div");
  confirmation.className = "cart-confirmacion";
  confirmation.setAttribute("role", "status");
  confirmation.textContent = "Producto agregado al carrito";
  document.body.appendChild(confirmation);
  setTimeout(() => confirmation.remove(), 1800);
}

// ---------------------------------------------------------------------------
// Construye el markup de una tarjeta de producto dentro del carrito,
// siguiendo la estructura base de cart-item / tarjeta-custom.
// ---------------------------------------------------------------------------
function crearTarjetaCarrito(id) {
  const p = products.find((x) => x.id === id);
  const qty = cart[id];
  const alMaximo = qty >= MAX_POR_PRODUCTO;

  return `
    <div class="cart-item tarjeta-custom mb-3" data-id="${id}">
      <div class="cart-item__img">
        <img src="${p.image}" alt="${p.name}" />
      </div>
      <div class="cart-item__info">
        <h3 class="card-title-custom mb-1">${p.name}</h3>
        <p class="descripcion-producto mb-0">${p.desc}</p>
        ${alMaximo ? '<p class="descripcion-producto mb-0"><small>Máximo 10 por producto</small></p>' : ""}
      </div>
      <div class="cart-item__precio">
        <span class="precio-custom">${money(p.price)}</span>
      </div>
      <div class="cart-item__cantidad">
        <button
          class="btn-qty"
          type="button"
          data-action="minus"
          data-id="${id}"
          aria-label="Disminuir cantidad"
        >
          −</button
        ><span class="cart-item__qty-valor">${qty}</span
        ><button
          class="btn-qty${alMaximo ? "" : " btn-qty--activo"}"
          type="button"
          data-action="plus"
          data-id="${id}"
          aria-label="Aumentar cantidad"
          ${alMaximo ? "disabled" : ""}
        >
          +
        </button>
      </div>
      <div class="cart-item__subtotal">
        <span class="precio-custom">${money(p.price * qty)}</span>
      </div>
      <div class="cart-item__accion">
        <button
          class="btn-eliminar"
          type="button"
          data-action="remove"
          data-id="${id}"
          aria-label="Eliminar producto"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Actualiza el panel "Resumen de pedido" (subtotal y total).
// Como esos elementos no tienen id en el HTML, se ubican por posición
// dentro de .resumen-carrito, sin tocar el archivo html.
// ---------------------------------------------------------------------------
function actualizarResumen(subtotal) {
  const resumen = document.querySelector(".resumen-carrito");
  if (!resumen) return;

  const envio = 0; // envío estimado fijo, igual que el markup original
  const total = subtotal + envio;

  const filaSubtotal = resumen.querySelector(
    ".d-flex.justify-content-between.mb-2",
  );
  const filaEnvio = resumen.querySelector(
    ".d-flex.justify-content-between.mb-3",
  );
  const filaTotal = resumen.querySelector(
    ".d-flex.justify-content-between.align-items-center.mb-4",
  );

  if (filaSubtotal) {
    const valorSubtotal = filaSubtotal.querySelector("span:last-child");
    if (valorSubtotal) valorSubtotal.textContent = money(subtotal);
  }
  if (filaEnvio) {
    const valorEnvio = filaEnvio.querySelector("span:last-child");
    if (valorEnvio) valorEnvio.textContent = money(envio);
  }
  if (filaTotal) {
    const valorTotal = filaTotal.querySelector("h3:last-child");
    if (valorTotal) valorTotal.textContent = money(total);
  }
}

function renderCart() {
  const cartContainer = document.getElementById("carrito");
  if (!cartContainer) return;

  const ids = Object.keys(cart);

  actualizarContadorNav();

  if (ids.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart text-center py-5">
        <p class="textos mb-0">Tu carrito está vacío.</p>
      </div>`;
    actualizarResumen(0);
    return;
  }

  cartContainer.innerHTML = ids.map((id) => crearTarjetaCarrito(id)).join("");

  const subtotal = ids.reduce(
    (sum, id) => sum + products.find((x) => x.id === id).price * cart[id],
    0,
  );
  actualizarResumen(subtotal);
}

// ---------------------------------------------------------------------------
// Delegación de eventos: un solo listener en el contenedor en vez de
// re-vincular botones en cada render.
// ---------------------------------------------------------------------------
function inicializarEventosCarrito() {
  const cartContainer = document.getElementById("carrito");
  if (!cartContainer) return;

  cartContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const { action, id } = btn.dataset;
    if (action === "plus") changeQty(id, 1);
    else if (action === "minus") changeQty(id, -1);
    else if (action === "remove") removeItem(id);
  });
}

function inicializarEventosCatalogo() {
  const productsGrid = document.getElementById("productos-grid");
  if (!productsGrid) return;

  productsGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (button) addToCart(button.dataset.id);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarEventosCarrito();
  inicializarEventosCatalogo();
  actualizarContadorNav();
  renderCart();
});
