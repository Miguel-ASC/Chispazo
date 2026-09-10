// =========================================================
// admin.js
// Lógica del panel administrativo: formulario de alta/edición,
// validación con alertas de Bootstrap, tabla de productos y
// baja lógica (activo = false) en lugar de borrado físico.
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
const imgPreviewWrapper = document.getElementById("img-preview-wrapper");
const imgPreview = document.getElementById("img-preview");

const fields = {
  id: document.getElementById("product-id"),
  name: document.getElementById("name"),
  description: document.getElementById("description"),
  precio: document.getElementById("precio"),
  categoria: document.getElementById("categoria"),
  img: document.getElementById("img"),
};

let currentFilter = "todos"; // todos | activos | eliminados

// =========================================================
// VALIDACIÓN
// =========================================================

/**
 * Valida los campos del formulario.
 * @returns {string[]} arreglo de mensajes de error (vacío si todo es válido)
 */
function validateProductForm() {
  const errors = [];

  // Limpiamos estados de error previos
  Object.values(fields).forEach((field) => field.classList.remove("is-invalid"));

  const name = fields.name.value.trim();
  const description = fields.description.value.trim();
  const precio = fields.precio.value;
  const categoria = fields.categoria.value;
  const img = fields.img.value.trim();

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

  if (img.length < 3) {
    errors.push("Debes indicar la ruta o URL de una imagen.");
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

// =========================================================
// CREAR / EDITAR (mismo formulario)
// =========================================================

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const errors = validateProductForm();

  if (errors.length > 0) {
    showFormErrors(errors);
    return;
  }

  // 1. Construimos el objeto JSON con la información del formulario
  const productData = {
    name: fields.name.value.trim(),
    description: fields.description.value.trim(),
    precio: Number(fields.precio.value).toFixed(2),
    categoria: fields.categoria.value,
    img: fields.img.value.trim(),
  };

  const editingId = fields.id.value;

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

  resetForm();
  renderTable();
});

/**
 * Regresa el formulario a modo "Nuevo producto"
 */
function resetForm() {
  form.reset();
  fields.id.value = "";
  formTitulo.textContent = "Nuevo Producto";
  submitBtn.textContent = "Guardar Producto";
  cancelEditBtn.classList.add("d-none");
  imgPreviewWrapper.style.display = "none";
  Object.values(fields).forEach((field) => field.classList.remove("is-invalid"));
}

cancelEditBtn.addEventListener("click", resetForm);

/**
 * Carga los datos de un producto en el formulario para editarlo
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
  fields.img.value = product.img;

  formTitulo.textContent = `Editando: ${product.name}`;
  submitBtn.textContent = "Actualizar Producto";
  cancelEditBtn.classList.remove("d-none");

  updateImgPreview();
  hideAlerts();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Vista previa de la imagen mientras se escribe la URL
imgInput.addEventListener("input", updateImgPreview);

function updateImgPreview() {
  const url = imgInput.value.trim();
  if (url) {
    imgPreview.src = url;
    imgPreviewWrapper.style.display = "block";
  } else {
    imgPreviewWrapper.style.display = "none";
  }
}

// =========================================================
// TABLA Y PAGINACIÓN
// =========================================================

let currentPage = 1;
const itemsPerPage = 5; // Cambia este valor para ajustar cuántos productos ver por página

const paginationContainer = document.getElementById("pagination-container");

function renderTable() {
  let items = productsController.items;

  // 1. Filtrado por estado
  if (currentFilter === "activos") {
    items = items.filter((p) => p.activo);
  } else if (currentFilter === "eliminados") {
    items = items.filter((p) => !p.activo);
  }

  tablaContador.textContent = `${items.length} producto${items.length === 1 ? "" : "s"}`;

  if (items.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">No hay productos en este filtro.</td></tr>`;
    if (paginationContainer) paginationContainer.innerHTML = "";
    return;
  }

  // 2. Cálculo de paginación
  const totalPages = Math.ceil(items.length / itemsPerPage);

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  // 3. Renderizado de filas
  tableBody.innerHTML = paginatedItems
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

  // 4. Renderizado de botones de paginación
  renderPagination(totalPages);
}

/**
 * Genera los botones de la paginación dinámicamente
 */
function renderPagination(totalPages) {
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let html = `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo; Previous</a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  html += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">Next &raquo;</a>
    </li>
  `;

  paginationContainer.innerHTML = html;
}

// Escuchador para los clics en la paginación
if (paginationContainer) {
  paginationContainer.addEventListener("click", (event) => {
    event.preventDefault();
    const link = event.target.closest(".page-link");
    if (!link) return;

    const targetPage = Number(link.dataset.page);
    if (targetPage && targetPage !== currentPage) {
      currentPage = targetPage;
      renderTable();
    }
  });
}

// Delegación de eventos para editar y cambiar estado (eliminar/reactivar)
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
    currentPage = 1; // Resetea a la primera página al cambiar de filtro
    renderTable();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  renderTable();
});

