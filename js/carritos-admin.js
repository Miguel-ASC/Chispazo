(function () {
  const elementos = {
    buscar: document.getElementById("buscar-carrito"),
    estado: document.getElementById("filtrar-estado"),
    tabla: document.getElementById("carritos-tabla-body"),
    tablaContenedor: document.querySelector(".carritos-tabla-contenedor"),
    cargando: document.getElementById("carritos-cargando"),
    vacio: document.getElementById("carritos-vacio"),
    error: document.getElementById("carritos-error"),
    reintentar: document.getElementById("reintentar-carritos"),
    contador: document.getElementById("pedidos-contador"),
    actualizacion: document.getElementById("ultima-actualizacion"),
    metricaPedidos: document.getElementById("metrica-pedidos"),
    metricaVentas: document.getElementById("metrica-ventas"),
    metricaPreparar: document.getElementById("metrica-preparar"),
    metricaClientes: document.getElementById("metrica-clientes"),
    detallePedido: document.getElementById("detalle-pedido"),
    detalleCliente: document.getElementById("detalle-cliente"),
    detalleProductos: document.getElementById("detalle-productos"),
    detalleItems: document.getElementById("detalle-items"),
    detalleTotal: document.getElementById("detalle-total"),
  };

  const estadosPermitidos = new Set(["pagado", "preparando", "pendiente"]);
  const estadoPresentacion = {
    pagado: { texto: "Pagado", icono: "check2-circle" },
    preparando: { texto: "Preparando", icono: "box-seam" },
    pendiente: { texto: "Pendiente", icono: "clock" },
  };
  const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  let pedidos = [];
  let cargando = false;
  let cargaFallida = false;
  let versionCarga = 0;

  function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, (caracter) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    })[caracter]);
  }

  function normalizarTexto(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function obtenerEstado(pedido) {
    const estado = String(pedido.estado || "pendiente").toLowerCase();
    return estadosPermitidos.has(estado) ? estado : "pendiente";
  }

  function obtenerDetalles(pedido) {
    return Array.isArray(pedido.detalleCarritos) ? pedido.detalleCarritos : [];
  }

  function calcularTotal(pedido) {
    return obtenerDetalles(pedido).reduce(
      (suma, detalle) => suma
        + Number(detalle.producto?.precio || 0) * Number(detalle.cantidad || 0),
      0,
    );
  }

  function obtenerCliente(pedido) {
    if (!pedido.usuario) {
      return { nombre: "Cliente invitado", email: "Sin correo registrado" };
    }

    const nombre = `${pedido.usuario.nombre || ""} ${pedido.usuario.apellidos || ""}`.trim();
    return {
      nombre: nombre || "Cliente registrado",
      email: pedido.usuario.email || "Sin correo registrado",
    };
  }

  function formatearFecha(valor) {
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return "Fecha no disponible";
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function actualizarMetricas() {
    const totalVentas = pedidos.reduce((suma, pedido) => suma + calcularTotal(pedido), 0);
    const porPreparar = pedidos.filter((pedido) => obtenerEstado(pedido) !== "pagado").length;
    const clientes = new Set(
      pedidos.map((pedido) => pedido.usuario?.idUsuario
        || pedido.usuario?.email
        || `invitado-${pedido.idCarritos}`),
    );

    elementos.metricaPedidos.textContent = pedidos.length.toLocaleString("es-MX");
    elementos.metricaVentas.textContent = formatoMoneda.format(totalVentas);
    elementos.metricaPreparar.textContent = porPreparar.toLocaleString("es-MX");
    elementos.metricaClientes.textContent = clientes.size.toLocaleString("es-MX");
  }

  function crearFila(pedido) {
    const cliente = obtenerCliente(pedido);
    const detalles = obtenerDetalles(pedido);
    const articulos = detalles.reduce(
      (suma, detalle) => suma + Number(detalle.cantidad || 0),
      0,
    );
    const nombresProductos = detalles
      .map((detalle) => detalle.producto?.nombre || "Producto")
      .join(" ");
    const estado = obtenerEstado(pedido);
    const presentacion = estadoPresentacion[estado];
    const total = formatoMoneda.format(calcularTotal(pedido));
    const fila = document.createElement("tr");

    fila.className = "pedido-guardado";
    fila.dataset.estado = estado;
    fila.dataset.pedidoId = String(pedido.idCarritos);
    fila.dataset.busqueda = normalizarTexto(
      `${pedido.idCarritos} ${cliente.nombre} ${cliente.email} ${nombresProductos}`,
    );
    fila.innerHTML = `
      <td class="carrito-id" data-label="Pedido">#${escaparHtml(pedido.idCarritos)}</td>
      <td class="carrito-cliente" data-label="Cliente">
        <strong>${escaparHtml(cliente.nombre)}</strong>
        <span>${escaparHtml(cliente.email)}</span>
      </td>
      <td data-label="Fecha">${escaparHtml(formatearFecha(pedido.fecha))}</td>
      <td data-label="Artículos">${articulos} ${articulos === 1 ? "artículo" : "artículos"}</td>
      <td class="carrito-total" data-label="Total">${escaparHtml(total)}</td>
      <td data-label="Estado">
        <span class="carrito-estado carrito-estado--${estado}">
          <i class="bi bi-${presentacion.icono}" aria-hidden="true"></i> ${presentacion.texto}
        </span>
      </td>
      <td class="carrito-accion" data-label="Detalle">
        <button class="btn btn-carrito-detalle" type="button" data-bs-toggle="modal"
          data-bs-target="#detalleCarritoModal" data-pedido-id="${escaparHtml(pedido.idCarritos)}">
          Ver pedido <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
        </button>
      </td>`;

    return fila;
  }

  function renderizarPedidos() {
    const fragmento = document.createDocumentFragment();
    const ordenados = [...pedidos].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );

    ordenados.forEach((pedido) => fragmento.appendChild(crearFila(pedido)));
    elementos.tabla.replaceChildren(fragmento);
  }

  function actualizarEstadosVista(visibles) {
    elementos.cargando.hidden = !cargando;
    elementos.error.hidden = !cargaFallida;
    elementos.vacio.hidden = cargando || cargaFallida || visibles > 0;
    elementos.tablaContenedor.hidden = cargando || cargaFallida || visibles === 0;
  }

  function filtrarPedidos() {
    const texto = normalizarTexto(elementos.buscar.value.trim());
    const estado = elementos.estado.value;
    const filas = [...elementos.tabla.querySelectorAll("tr")];
    let visibles = 0;

    filas.forEach((fila) => {
      const coincideTexto = (fila.dataset.busqueda || "").includes(texto);
      const coincideEstado = estado === "todos" || fila.dataset.estado === estado;
      const visible = coincideTexto && coincideEstado;
      fila.hidden = !visible;
      if (visible) visibles += 1;
    });

    elementos.contador.textContent = cargando
      ? "Cargando pedidos…"
      : `Mostrando ${visibles} de ${pedidos.length} ${pedidos.length === 1 ? "pedido" : "pedidos"}`;
    actualizarEstadosVista(visibles);
  }

  function mostrarDetalle(pedido) {
    const cliente = obtenerCliente(pedido);
    const detalles = obtenerDetalles(pedido);
    const articulos = detalles.reduce(
      (suma, detalle) => suma + Number(detalle.cantidad || 0),
      0,
    );

    elementos.detallePedido.textContent = `#${pedido.idCarritos}`;
    elementos.detalleCliente.textContent = cliente.nombre;
    elementos.detalleItems.textContent = `${articulos} ${articulos === 1 ? "artículo" : "artículos"}`;
    elementos.detalleTotal.textContent = formatoMoneda.format(calcularTotal(pedido));
    elementos.detalleProductos.replaceChildren();

    if (detalles.length === 0) {
      const item = document.createElement("li");
      item.className = "detalle-productos__vacio";
      item.textContent = "Este pedido no contiene productos disponibles.";
      elementos.detalleProductos.appendChild(item);
      return;
    }

    detalles.forEach((detalle) => {
      const item = document.createElement("li");
      const nombre = detalle.producto?.nombre || "Producto";
      const cantidad = Number(detalle.cantidad || 0);
      const subtotal = Number(detalle.producto?.precio || 0) * cantidad;
      item.innerHTML = `
        <span><strong>${escaparHtml(nombre)}</strong><small>Cantidad: ${cantidad}</small></span>
        <strong>${escaparHtml(formatoMoneda.format(subtotal))}</strong>`;
      elementos.detalleProductos.appendChild(item);
    });
  }

  async function cargarPedidos() {
    const versionActual = ++versionCarga;
    cargando = true;
    cargaFallida = false;
    filtrarPedidos();

    try {
      const respuesta = await ChispazoAPI.listarCarritos();
      if (versionActual !== versionCarga) return;
      pedidos = Array.isArray(respuesta) ? respuesta : [];
      renderizarPedidos();
      actualizarMetricas();
      elementos.actualizacion.textContent = `Actualizado ${new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } catch (error) {
      if (versionActual !== versionCarga) return;
      console.error("No fue posible cargar los pedidos.", error);
      pedidos = [];
      elementos.tabla.replaceChildren();
      cargaFallida = true;
      elementos.contador.textContent = "Información no disponible";
      elementos.actualizacion.textContent = "Sin conexión con el servidor";
      actualizarMetricas();
    } finally {
      if (versionActual !== versionCarga) return;
      cargando = false;
      filtrarPedidos();
    }
  }

  elementos.buscar.addEventListener("input", filtrarPedidos);
  elementos.estado.addEventListener("change", filtrarPedidos);
  elementos.reintentar.addEventListener("click", cargarPedidos);
  elementos.tabla.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-pedido-id]");
    if (!boton) return;
    const pedido = pedidos.find(
      (item) => String(item.idCarritos) === boton.dataset.pedidoId,
    );
    if (pedido) mostrarDetalle(pedido);
  });

  window.addEventListener("storage", cargarPedidos);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) cargarPedidos();
  });

  cargarPedidos();
})();
