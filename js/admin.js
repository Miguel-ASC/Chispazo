const productsController = new ProductsController();

const form = document.getElementById("product-form");
const formTitulo = document.getElementById("form-titulo");
const alertError = document.getElementById("form-alert-error");
const alertSuccess = document.getElementById("form-alert-success");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const tableBody = document.getElementById("products-table-body");
const tablaContador = document.getElementById("tabla-contador");
const imgPreviewWrapper = document.getElementById("img-preview-wrapper");
const imgPreview = document.getElementById("img-preview");
const paginationControls = document.getElementById("pagination-controls");

const fields = {
  id: document.getElementById("product-id"),
  name: document.getElementById("name"),
  description: document.getElementById("description"),
  precio: document.getElementById("precio"),
  stock: document.getElementById("stock"),
  categoria: document.getElementById("categoria"),
  imagenUrl: document.getElementById("imagen-url"),
  datasheet: document.getElementById("datasheet"),
};

let productos = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

// =========================================================
// VALIDACIÓN Y ALERTAS
// =========================================================
function validateProductForm() {
  const errors = [];
  Object.values(fields).forEach((f) => f.classList.remove("is-invalid"));

  const name = fields.name.value.trim();
  const description = fields.description.value.trim();
  const precio = fields.precio.value;
  const stock = fields.stock.value;
  const datasheet = fields.datasheet.value.trim();

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
  if (stock === "" || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    errors.push("El stock debe ser un número entero mayor o igual a 0.");
    fields.stock.classList.add("is-invalid");
  }
  if (fields.categoria.value === "") {
    errors.push("Debes seleccionar una categoría.");
    fields.categoria.classList.add("is-invalid");
  }
  if (fields.imagenUrl.value.trim() === "") {
    errors.push("Debes indicar la ruta de la imagen.");
    fields.imagenUrl.classList.add("is-invalid");
  }
  if (datasheet !== "" && !/^https?:\/\/.+/i.test(datasheet)) {
    errors.push("La URL del datasheet debe comenzar con http:// o https://");
    fields.datasheet.classList.add("is-invalid");
  }
  return errors;
}

function showFormErrors(errors) {
  hideAlerts();
  alertError.innerHTML =
    "<strong>Revisa lo siguiente:</strong><ul class='mb-0'>" +
    errors.map((e) => `<li>${e}</li>`).join("") +
    "</ul>";
  alertError.classList.remove("d-none");
}

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

function mensajeError(error) {
  if (error.status === 409) return "Ya existe un producto con ese nombre.";
  if (error.status === 404) return "El producto ya no existe en el servidor.";
  if (error.status) return "El servidor no pudo completar la operación. Revisa que el nombre no esté repetido.";
  return "No se pudo conectar con el servidor.";
}

// =========================================================
// CARGA DE DATOS
// =========================================================
async function cargarCategorias() {
  try {
    const categorias = await productsController.getCategorias();
    fields.categoria.innerHTML =
      '<option value="" selected disabled>Selecciona...</option>' +
      categorias.map((c) => `<option value="${c.idCategoria}">${c.nombre}</option>`).join("");
  } catch (error) {
    showFormErrors(["No se pudieron cargar las categorías."]);
  }
}

async function cargarProductos() {
  try {
    productos = await productsController.getAll();
    renderTable();
  } catch (error) {
    tablaContador.textContent = "0 productos";
    tableBody.innerHTML =
      '<tr><td colspan="6" class="text-center py-4">No se pudo conectar con el servidor.</td></tr>';
    paginationControls.innerHTML = "";
  }
}

// =========================================================
// CREAR / EDITAR
// =========================================================
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const errors = validateProductForm();
  if (errors.length > 0) {
    showFormErrors(errors);
    return;
  }

  const productData = {
    nombre: fields.name.value.trim(),
    descripcion: fields.description.value.trim(),
    precio: Number(fields.precio.value),
    stock: Number(fields.stock.value),
    imagenUrl: fields.imagenUrl.value.trim(),
    datasheet: fields.datasheet.value.trim(),
    categoria: { idCategoria: Number(fields.categoria.value) },
  };

  const editingId = fields.id.value;

  try {
    if (editingId) {
      await productsController.update(editingId, productData);
      showFormSuccess("Producto actualizado correctamente.");
    } else {
      await productsController.create(productData);
      showFormSuccess("Producto agregado correctamente.");
    }
    resetForm();
    await cargarProductos();
  } catch (error) {
    showFormErrors([mensajeError(error)]);
  }
});

function resetForm() {
  form.reset();
  fields.id.value = "";
  formTitulo.textContent = "Nuevo Producto";
  submitBtn.textContent = "Guardar Producto";
  cancelEditBtn.classList.add("d-none");
  imgPreviewWrapper.style.display = "none";
  Object.values(fields).forEach((f) => f.classList.remove("is-invalid"));
}

cancelEditBtn.addEventListener("click", resetForm);

function loadProductIntoForm(id) {
  const p = productos.find((x) => x.idProducto === Number(id));
  if (!p) return;

  fields.id.value = p.idProducto;
  fields.name.value = p.nombre;
  fields.description.value = p.descripcion ?? "";
  fields.precio.value = p.precio;
  fields.stock.value = p.stock;
  fields.categoria.value = p.categoria?.idCategoria ?? "";
  fields.imagenUrl.value = p.imagenUrl ?? "";
  fields.datasheet.value = p.datasheet ?? "";

  formTitulo.textContent = `Editando: ${p.nombre}`;
  submitBtn.textContent = "Actualizar Producto";
  cancelEditBtn.classList.remove("d-none");
  actualizarVistaPrevia();

  hideAlerts();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function actualizarVistaPrevia() {
  const ruta = fields.imagenUrl.value.trim();
  if (!ruta) {
    imgPreviewWrapper.style.display = "none";
    return;
  }
  imgPreview.src = normalizarImagenProducto(ruta);
  imgPreviewWrapper.style.display = "block";
}

fields.imagenUrl.addEventListener("input", actualizarVistaPrevia);

// =========================================================
// TABLA
// =========================================================
function renderTable() {
  tablaContador.textContent = `${productos.length} producto${productos.length === 1 ? "" : "s"}`;

  if (productos.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No hay productos registrados.</td></tr>';
    paginationControls.innerHTML = "";
    return;
  }

  const totalPages = Math.max(1, Math.ceil(productos.length / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = productos.slice(start, start + ITEMS_PER_PAGE);

  tableBody.innerHTML = pageItems
    .map((p) => `
      <tr>
        <td><img src="${normalizarImagenProducto(p.imagenUrl)}" alt="${p.nombre}"
                 style="width:48px;height:48px;object-fit:cover;border-radius:6px;"></td>
        <td>${p.nombre}</td>
        <td>${p.categoria?.nombre || "—"}</td>
        <td>$${Number(p.precio).toFixed(2)} MXN</td>
        <td>${p.stock}</td>
        <td class="text-end">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-light" data-action="edit" data-id="${p.idProducto}" aria-label="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger" data-action="delete" data-id="${p.idProducto}" aria-label="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>`)
    .join("");

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    paginationControls.innerHTML = "";
    return;
  }

  let html = `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <button class="page-link" data-page="${currentPage - 1}" aria-label="Anterior">&laquo;</button>
    </li>`;

  for (let page = 1; page <= totalPages; page++) {
    html += `
      <li class="page-item ${page === currentPage ? "active" : ""}">
        <button class="page-link" data-page="${page}">${page}</button>
      </li>`;
  }

  html += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <button class="page-link" data-page="${currentPage + 1}" aria-label="Siguiente">&raquo;</button>
    </li>`;

  paginationControls.innerHTML = html;
}

paginationControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-page]");
  if (!button) return;
  const page = Number(button.dataset.page);
  if (page < 1) return;
  currentPage = page;
  renderTable();
});

tableBody.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "edit") {
    loadProductIntoForm(id);
  }

  if (button.dataset.action === "delete") {
    const p = productos.find((x) => x.idProducto === id);
    if (!p || !confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;

    try {
      await productsController.remove(id);
      showFormSuccess(`"${p.nombre}" fue eliminado.`);
      await cargarProductos();
    } catch (error) {
      showFormErrors([mensajeError(error)]);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  cargarCategorias();
  cargarProductos();
});