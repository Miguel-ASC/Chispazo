// =========================================================
// admin.js
// Lógica del panel administrativo: formulario de alta/edición,
// validación con alertas de Bootstrap, tabla de productos y
// baja lógica (activo = false) en lugar de borrado físico.
//
// La imagen se sube con <input type="file">, se convierte a
// base64 (Data URL) con FileReader, y así se guarda en el
// objeto JSON del producto (y en localStorage).
// =========================================================

const productsController = new ProductsController();

// Referencias al DOM que vamos a reutilizar
const form = document.getElementById("product-form");
const formTitulo = document.getElementById("form-titulo");
const alertError = document.getElementById("form-alert-error");
const alertSuccess = document.getElementById("form-alert-success");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const tableBody = document.getElementById("products-table-body");
const tablaContador = document.getElementById("tabla-contador");
const imgInput = document.getElementById("img");
const currentImgInput = document.getElementById("current-img");
const imgPreviewWrapper = document.getElementById("img-preview-wrapper");
const imgPreview = document.getElementById("img-preview");
const paginationControls = document.getElementById("pagination-controls");

const fields = {
  id: document.getElementById("product-id"),
  name: document.getElementById("name"),
  description: document.getElementById("description"),
  precio: document.getElementById("precio"),
  categoria: document.getElementById("categoria"),
  img: document.getElementById("img"),
};

let currentFilter = "todos"; // todos | activos | eliminados
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

// =========================================================
// VALIDACIÓN
// =========================================================

/**
 * Valida los campos del formulario.
 * El campo de imagen se valida distinto según el modo:
 *  - Creación: se exige haber seleccionado un archivo.
 *  - Edición: basta con que exista una imagen previa (currentImgInput)
 *    si el usuario no seleccionó un archivo nuevo.
 * @returns {string[]} arreglo de mensajes de error (vacío si todo es válido)
 */
function validateProductForm() {
  const errors = [];

  Object.values(fields).forEach((field) => field.classList.remove("is-invalid"));

  const name = fields.name.value.trim();
  const description = fields.description.value.trim();
  const precio = fields.precio.value;
  const categoria = fields.categoria.value;
  const isEditing = fields.id.value !== "";
  const hasNewFile = imgInput.files.length > 0;
  const hasExistingImg = currentImgInput.value !== "";

  if (name.length < 3) {
    errors.push("El nombre del producto debe tener al menos 3 caracteres.");
    fields.name.classList.add("is-invalid");
  }

  if (description.length < 10) {
    errors.push("La descripción debe tener al menos 10 caracteres.");
    fields.description.classList.add("is-invalid");
  }

  if (precio === "" || isNaN(precio) || Number(precio) <= 0) {
    errors.push("El precio debe ser un número mayor a 0.");
    fields.precio.classList.add("is-invalid");
  }

  if (categoria === "") {
    errors.push("Debes seleccionar una categoría.");
    fields.categoria.classList.add("is-invalid");
  }

  if (!hasNewFile && !(isEditing && hasExistingImg)) {
    errors.push("Debes seleccionar una imagen para el producto.");
    fields.img.classList.add("is-invalid");
  }

  return errors;
}

/**
 * Muestra el alert-danger de Bootstrap con la lista de errores
 * @param {string[]} errors
 */
function showFormErrors(errors) {
  hideAlerts();
  alertError.innerHTML =
    "<strong>Revisa los siguientes campos:</strong><ul class='mb-0'>" +
    errors.map((e) => `<li>${e}</li>`).join("") +
    "</ul>";
  alertError.classList.remove("d-none");
}

/**
 * Muestra el alert-success de Bootstrap
 * @param {string} message
 */
function showFormSuccess(message) {
  hideAlerts();
  alertSuccess.textContent = message;
  alertSuccess.classList.remove("d-none");
  setTimeout(() => alertSuccess.classList.add("d-none"), 3500);
}

function hideAlerts() {
  alertError.classList.add("d-none");
  alertSuccess.classList.add("d-none");
}

/**
 * Convierte un archivo (File) en un Data URL base64, en forma de Promise,
 * para poder usar await dentro del submit del formulario.
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// =========================================================
// CREAR / EDITAR (mismo formulario)
// =========================================================

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const errors = validateProductForm();

  if (errors.length > 0) {
    showFormErrors(errors);
    return;
  }

  // 1. Resolvemos la imagen: si el usuario eligió un archivo nuevo lo
  //    convertimos a base64; si no, conservamos la imagen que ya tenía
  //    el producto (solo aplica en modo edición).
  let imgData = currentImgInput.value;

  if (imgInput.files.length > 0) {
    try {
      imgData = await readFileAsDataURL(imgInput.files[0]);
    } catch (error) {
      showFormErrors(["No se pudo leer el archivo de imagen. Intenta de nuevo."]);
      return;
    }
  }

  // 2. Construimos el objeto JSON con la información del formulario
  const productData = {
    name: fields.name.value.trim(),
    description: fields.description.value.trim(),
    precio: Number(fields.precio.value).toFixed(2),
    categoria: fields.categoria.value,
    img: imgData,
  };

  const editingId = fields.id.value;

  try {
    if (editingId) {
      // --- MODO EDICIÓN ---
      productsController.updateProduct(Number(editingId), productData);
      showFormSuccess("Producto actualizado correctamente.");
    } else {
      // --- MODO CREACIÓN ---
      const today = new Date().toISOString().split("T")[0];
      productsController.addProduct(
        productData.name,
        productData.description,
        productData.precio,
        productData.img,
        today,
        productData.categoria
      );
      showFormSuccess("Producto agregado correctamente.");
    }
  } catch (error) {
    // saveToStorage() lanza un error si localStorage se queda sin espacio
    // (por ejemplo, demasiadas imágenes en base64 acumuladas)
    showFormErrors([
      "No se pudo guardar el producto: el almacenamiento local está lleno. Elimina productos o usa imágenes más pequeñas.",
    ]);
    return;
  }

  resetForm();
  renderTable();
});

/**
 * Regresa el formulario a modo "Nuevo producto"
 */
function resetForm() {
  form.reset();
  fields.id.value = "";
  currentImgInput.value = "";
  formTitulo.textContent = "Nuevo Producto";
  submitBtn.textContent = "Guardar Producto";
  cancelEditBtn.classList.add("d-none");
  imgPreviewWrapper.style.display = "none";
  Object.values(fields).forEach((field) => field.classList.remove("is-invalid"));
}

cancelEditBtn.addEventListener("click", resetForm);

/**
 * Carga los datos de un producto en el formulario para editarlo.
 * El <input type="file"> se deja vacío (no se puede precargar por
 * seguridad del navegador); currentImgInput guarda la imagen existente
 * para usarla si el usuario no sube una nueva.
 * @param {number} id
 */
function loadProductIntoForm(id) {
  const product = productsController.getProductById(id);
  if (!product) return;

  fields.id.value = product.id;
  fields.name.value = product.name;
  fields.description.value = product.description;
  fields.precio.value = product.precio;
  fields.categoria.value = product.categoria || "";
  imgInput.value = ""; // no se puede precargar un input file
  currentImgInput.value = product.img;

  formTitulo.textContent = `Editando: ${product.name}`;
  submitBtn.textContent = "Actualizar Producto";
  cancelEditBtn.classList.remove("d-none");

  // Vista previa con la imagen actual del producto
  imgPreview.src = product.img;
  imgPreviewWrapper.style.display = "block";

  hideAlerts();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Vista previa: al elegir un archivo nuevo, lo leemos y mostramos al instante
imgInput.addEventListener("change", () => {
  const file = imgInput.files[0];

  if (!file) {
    // Si el usuario cancela la selección, mostramos la imagen anterior (si hay)
    if (currentImgInput.value) {
      imgPreview.src = currentImgInput.value;
      imgPreviewWrapper.style.display = "block";
    } else {
      imgPreviewWrapper.style.display = "none";
    }
    return;
  }

  readFileAsDataURL(file).then((dataUrl) => {
    imgPreview.src = dataUrl;
    imgPreviewWrapper.style.display = "block";
  });
});

// =========================================================
// TABLA: listar, eliminar (baja lógica), reactivar
// =========================================================

function renderTable() {
  let items = productsController.items;

  if (currentFilter === "activos") {
    items = items.filter((p) => p.activo);
  } else if (currentFilter === "eliminados") {
    items = items.filter((p) => !p.activo);
  }

  tablaContador.textContent = `${items.length} producto${items.length === 1 ? "" : "s"}`;

  if (items.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">No hay productos en este filtro.</td></tr>`;
    paginationControls.innerHTML = "";
    return;
  }

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = items.slice(start, start + ITEMS_PER_PAGE);

  tableBody.innerHTML = pageItems
    .map((product) => {
      const estadoBadge = product.activo
        ? '<span class="badge bg-success">Activo</span>'
        : '<span class="badge bg-secondary">Eliminado</span>';

      const accionEliminarLabel = product.activo ? "Eliminar" : "Reactivar";
      const accionEliminarClase = product.activo ? "btn-outline-danger" : "btn-outline-success";
      const accionEliminarIcono = product.activo ? "bi-trash" : "bi-arrow-counterclockwise";

      return `
        <tr>
          <td><img src="${product.img}" alt="${product.name}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;"></td>
          <td>${product.name}</td>
          <td>${product.categoria || "—"}</td>
          <td>$${product.precio} MXN</td>
          <td>${estadoBadge}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-light" data-action="edit" data-id="${product.id}" aria-label="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn ${accionEliminarClase}" data-action="toggle" data-id="${product.id}" aria-label="${accionEliminarLabel}">
                <i class="bi ${accionEliminarIcono}"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  renderPagination(totalPages);
}

/**
 * Dibuja los controles de paginación (Anterior, números de página, Siguiente)
 * usando el componente .pagination de Bootstrap.
 * @param {number} totalPages
 */
function renderPagination(totalPages) {
  if (totalPages <= 1) {
    paginationControls.innerHTML = "";
    return;
  }

  let html = "";

  html += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <button class="page-link" data-page="${currentPage - 1}" aria-label="Anterior">&laquo;</button>
    </li>
  `;

  for (let page = 1; page <= totalPages; page++) {
    html += `
      <li class="page-item ${page === currentPage ? "active" : ""}">
        <button class="page-link" data-page="${page}">${page}</button>
      </li>
    `;
  }

  html += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <button class="page-link" data-page="${currentPage + 1}" aria-label="Siguiente">&raquo;</button>
    </li>
  `;

  paginationControls.innerHTML = html;
}

// Delegación de eventos para los botones de paginación
paginationControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-page]");
  if (!button) return;

  const page = Number(button.dataset.page);
  if (page < 1) return;

  currentPage = page;
  renderTable();
});

// Delegación de eventos: un solo listener para todos los botones editar/eliminar
tableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "edit") {
    loadProductIntoForm(id);
  }

  if (action === "toggle") {
    const product = productsController.getProductById(id);
    if (!product) return;

    if (product.activo) {
      productsController.deactivateProduct(id);
      showFormSuccess(`"${product.name}" fue eliminado (baja lógica).`);
    } else {
      productsController.activateProduct(id);
      showFormSuccess(`"${product.name}" fue reactivado.`);
    }

    renderTable();
  }
});

// Filtro Todos / Activos / Eliminados
document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    currentPage = 1;
    renderTable();
  });
});

// =========================================================
// Primer render al cargar la página
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  renderTable();
});
