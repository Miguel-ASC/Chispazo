/**
 * ProductsController
 * Cliente de la API de productos (Spring Boot). Ya no usa localStorage.
 */
class ProductsController {
  async request(path, { method = "GET", body } = {}) {
    const config = { method, headers: {} };
    if (body) {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(body);
    }

    const resp = await fetch(`${API_URL}${path}`, config);
    if (!resp.ok) {
      const error = new Error(`Error ${resp.status}`);
      error.status = resp.status;
      throw error;
    }
    return resp.status === 204 ? null : resp.json();
  }

  getAll() {
    return this.request("/productos/mostrar");
  }

  getCategorias() {
    return this.request("/categorias/mostrar");
  }

  create(producto) {
    return this.request("/productos/insertar", { method: "POST", body: producto });
  }

  update(id, producto) {
    return this.request(`/productos/actualizar/${id}`, { method: "PUT", body: producto });
  }

  remove(id) {
    return this.request(`/productos/borrar/${id}`, { method: "DELETE" });
  }

  normalizeText(text) {
    if (!text) return "";
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  filterByCategory(items, category = null) {
    if (!category) return items;
    const clean = this.normalizeText(category);
    return items.filter((p) => this.normalizeText(p.categoria?.nombre) === clean);
  }
}

// Convierte "img/x.jpg" o "../img/x.jpg" en una URL válida desde cualquier página
function normalizarImagenProducto(ruta) {
  if (!ruta || ruta.startsWith("data:") || /^https?:\/\//.test(ruta)) {
    return ruta;
  }
  const nombreArchivo = ruta.replace(/^.*(?:\/|^)img\//, "");
  return new URL(`../img/${nombreArchivo}`, document.baseURI).href;
}