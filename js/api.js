window.ChispazoAPI = (() => {
  const API_BASE_URL = ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:8081"
    : "";

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });

    if (!response.ok) {
      let message = `API ${response.status}: ${response.statusText}`;
      try {
        const body = await response.json();
        message = body.message || body.detail || body.error || message;
      } catch {
        // Algunas respuestas de error no incluyen un cuerpo JSON.
      }
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) return null;
    return response.json();
  }

  return {
    listarProductos: () => request("/productos/mostrar"),
    listarCategorias: () => request("/categorias/mostrar"),
    crearCategoria: (categoria) => request("/categorias/insertar", {
      method: "POST",
      body: JSON.stringify(categoria),
    }),
    crearProducto: (producto) => request("/productos/insertar", {
      method: "POST",
      body: JSON.stringify(producto),
    }),
    actualizarProducto: (id, producto) => request(`/productos/actualizar/${id}`, {
      method: "PUT",
      body: JSON.stringify(producto),
    }),
    eliminarProducto: (id) => request(`/productos/borrar/${id}`, {
      method: "DELETE",
    }),
    registrarUsuario: (usuario) => request("/usuarios/nuevo-usuario", {
      method: "POST",
      body: JSON.stringify(usuario),
    }),
    iniciarSesion: (credenciales) => request("/usuarios/login", {
      method: "POST",
      body: JSON.stringify(credenciales),
    }),
    actualizarUsuario: (id, usuario) => request(`/usuarios/actualizar-usuario/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    }),
    guardarCarrito: (carrito) => request("/carritos/guardar", {
      method: "POST",
      body: JSON.stringify(carrito),
    }),
    listarCarritos: () => request("/carritos/mostrar"),
  };
})();