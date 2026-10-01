// ---------------------------------------------------------------------------
// cart.js
// Usa las variables globales: products (array), cart (objeto {id: cantidad}),
// MAX_POR_PRODUCTO (número) y money(valor) — se asume que ya existen
// (por ejemplo definidas en data.js, cargado antes que este archivo).
// ---------------------------------------------------------------------------

const CART_STORAGE_KEY = "cart";
const MAX_POR_PRODUCTO = 10;

function normalizarImagenProducto(ruta) {
  if (!ruta || ruta.startsWith("data:") || /^https?:\/\//.test(ruta)) {
    return ruta;
  }

  const nombreArchivo = ruta.replace(/^.*(?:\/|^)img\//, "");
  return new URL(`../img/${nombreArchivo}`, document.baseURI).href;
}
let products = [];

async function cargarProductos() {
  try {
    const resp = await fetch(`${API_URL}/productos/mostrar`);
    if (!resp.ok) throw new Error();
    const data = await resp.json();
    products = data.map((p) => ({
      id: String(p.idProducto),
      name: p.nombre,
      desc: p.descripcion,
      price: Number(p.precio),
      image: normalizarImagenProducto(p.imagenUrl),
    }));
  } catch (error) {
    products = [];
  }
}

// Quita del carrito ids viejos que ya no existen en la BD
function limpiarCarritoInvalido() {
  if (products.length === 0) return;
  Object.keys(cart).forEach((id) => {
    if (!products.some((p) => p.id === id)) delete cart[id];
  });
  saveCart();
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

document.addEventListener("DOMContentLoaded", async () => {
  inicializarEventosCarrito();
  inicializarEventosCatalogo();
  actualizarContadorNav();

  // Solo pide productos en las páginas que los necesitan
  if (document.getElementById("carrito") || document.getElementById("productos-grid")) {
    await cargarProductos();
    limpiarCarritoInvalido();
  }
  renderCart();
});

window.addEventListener("chispazo:component-loaded", (event) => {
  if (event.detail?.id === "nav-container") actualizarContadorNav();
});
// --- MOSTRAR NOTIFICACIÓN TIPO TOAST AL AGREGAR UN PRODUCTO ---
function mostrarNotificacionToast(mensaje) {
  let toastContainer = document.getElementById("toast-container-carrito");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container-carrito";
    toastContainer.style.position = "fixed";
    toastContainer.style.bottom = "20px";
    toastContainer.style.right = "20px";
    toastContainer.style.zIndex = "9999";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "alert alert-success text-white fw-bold mb-2 shadow-lg";
  toast.style.backgroundColor = "#198754";
  toast.style.border = "none";
  toast.style.fontSize = "0.85rem";
  toast.style.padding = "8px 16px";
  toast.style.borderRadius = "4px";
  toast.textContent = mensaje;

  toastContainer.appendChild(toast);

  // Ocultar notificación después de 2.5 segundos
  setTimeout(() => {
    toast.remove();
  }, 2500);
}

// --- ACTUALIZAR CONTADOR DEL NAVBAR ---
function actualizarContadorNavbar() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contadorBadge = document.querySelector("#contador-carrito");
  if (contadorBadge) {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorBadge.textContent = totalItems;
    contadorBadge.style.display = totalItems > 0 ? "inline-block" : "none";
  }
}

// --- RENDERIZAR TABLA PRINCIPAL (Html/cart.html) ---
function renderizarPaginaCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const tablaContenedor =
    document.querySelector("table tbody") ||
    document.querySelector("#contenedor-carrito-pagina");
  const subtotalTextos = document.querySelectorAll(
    ".resumen-subtotal, #subtotal-carrito",
  );
  const totalTextos = document.querySelectorAll(
    ".resumen-total, #total-carrito",
  );

  if (!tablaContenedor) return;

  if (carrito.length === 0) {
    tablaContenedor.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-white-50 py-5">
          <h4>Tu carrito está vacío.</h4>
        </td>
      </tr>`;

    subtotalTextos.forEach((el) => (el.textContent = "$0.00 MXN"));
    totalTextos.forEach((el) => (el.textContent = "$0.00 MXN"));
    return;
  }

  let total = 0;
  tablaContenedor.innerHTML = carrito
    .map((item) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      const esSubcarpeta = window.location.pathname.includes("/Html/");
      const rutaImg = esSubcarpeta ? `../${item.img}` : item.img;

      return `
      <tr class="align-middle text-white border-bottom border-secondary">
        <td class="py-3">
          <div class="d-flex align-items-center gap-3">
            <img src="${rutaImg}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover;" class="rounded">
            <span class="fw-bold">${item.nombre}</span>
          </div>
        </td>
        <td>$${item.precio.toFixed(2)} MXN</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-light px-2 btn-restar" data-id="${item.id}">-</button>
            <span class="fw-bold fs-6">${item.cantidad}</span>
            <button class="btn btn-sm btn-outline-light px-2 btn-sumar" data-id="${item.id}">+</button>
          </div>
        </td>
        <td class="fw-bold text-warning">$${subtotal.toFixed(2)} MXN</td>
        <td>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${item.id}">
            Eliminar
          </button>
        </td>
      </tr>
    `;
    })
    .join("");

  subtotalTextos.forEach((el) => (el.textContent = `$${total.toFixed(2)} MXN`));
  totalTextos.forEach((el) => (el.textContent = `$${total.toFixed(2)} MXN`));
}

function actualizarVistas() {
  actualizarContadorNavbar();
  renderizarPaginaCarrito();
}

// --- MANEJADOR DE EVENTOS DE CLIC ---
document.addEventListener("click", (e) => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // CORRECCIÓN: Si el botón pertenece al formulario de contacto, salimos inmediatamente para no interferir
  if (e.target.closest("#contactForm")) {
    return;
  }

  // Agregar al carrito (Botones principales o amarillos)
  const btnAgregar =
    e.target.closest(".btn-agregar-carrito") ||
    e.target.closest("button.btn-warning");
  if (btnAgregar && !e.target.closest("#lista-carrito-offcanvas")) {
    e.preventDefault();
    const id = btnAgregar.getAttribute("data-id") || "1";
    const nombre = btnAgregar.getAttribute("data-nombre") || "Producto";
    const precio = parseFloat(btnAgregar.getAttribute("data-precio")) || 0;
    const img = btnAgregar.getAttribute("data-img") || "";

    const existe = carrito.find((p) => p.id === id);
    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ id, nombre, precio, img, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarVistas();
    mostrarNotificacionToast("Producto agregado al carrito");
    return;
  }

  // Sumar (+)
  const btnSumar = e.target.closest(".btn-sumar");
  if (btnSumar) {
    const id = btnSumar.getAttribute("data-id");
    const producto = carrito.find((p) => p.id === id);
    if (producto) {
      producto.cantidad += 1;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarVistas();
    }
    return;
  }

  // Restar (-)
  const btnRestar = e.target.closest(".btn-restar");
  if (btnRestar) {
    const id = btnRestar.getAttribute("data-id");
    const producto = carrito.find((p) => p.id === id);
    if (producto) {
      producto.cantidad -= 1;
      if (producto.cantidad <= 0) {
        carrito = carrito.filter((p) => p.id !== id);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarVistas();
    }
    return;
  }

  // Eliminar
  const btnEliminar = e.target.closest(".btn-eliminar");
  if (btnEliminar) {
    const id = btnEliminar.getAttribute("data-id");
    carrito = carrito.filter((p) => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarVistas();
    return;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarVistas();
});
(function () {
  const EXTRA_KEY = "productos-inicio";

  JSON.parse(localStorage.getItem(EXTRA_KEY) || "[]").forEach((p) => {
    if (!products.some((x) => x.id === p.id)) {
      products.push({ ...p, image: normalizarImagenProducto(p.img) });
    }
  });

  function registrarProducto(boton) {
    const nombre = boton.dataset.nombre;
    const precio = parseFloat(boton.dataset.precio);
    if (!boton.dataset.id || !nombre || Number.isNaN(precio)) return null;

    const id = "inicio-" + boton.dataset.id;
    if (products.some((p) => p.id === id)) return id;

    const img = boton.dataset.img || "";
    const nuevo = { id, name: nombre, desc: "", price: precio, img };

    const guardados = JSON.parse(localStorage.getItem(EXTRA_KEY) || "[]");
    guardados.push(nuevo);
    localStorage.setItem(EXTRA_KEY, JSON.stringify(guardados));

    products.push({ ...nuevo, image: normalizarImagenProducto(img) });
    return id;
  }

  document.addEventListener(
    "click",
    (event) => {
      const boton = event.target.closest(".btn-agregar-carrito");
      if (!boton || boton.closest("#productos-grid")) return;

      event.preventDefault();
      event.stopPropagation();

      const id = registrarProducto(boton);
      if (!id) return;

      const antes = cart[id] || 0;
      addToCart(id);
      if ((cart[id] || 0) > antes) mostrarConfirmacion(boton);
    },
    true,
  );
})();
