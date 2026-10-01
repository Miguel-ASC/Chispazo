(function () {
  const elementos = {
    form: document.getElementById("product-form"),
    formTitulo: document.getElementById("form-titulo"),
    alertaError: document.getElementById("form-alert-error"),
    alertaExito: document.getElementById("form-alert-success"),
    submit: document.getElementById("submit-btn"),
    cancelar: document.getElementById("cancel-edit-btn"),
    tabla: document.getElementById("products-table-body"),
    tablaContenedor: document.getElementById("productos-tabla-contenedor"),
    tablaContador: document.getElementById("tabla-contador"),
    paginacion: document.getElementById("pagination-controls"),
    paginacionResumen: document.getElementById("paginacion-resumen"),
    panelPie: document.querySelector(".productos-panel__pie"),
    buscar: document.getElementById("buscar-producto"),
    filtrarCategoria: document.getElementById("filtrar-categoria"),
    cargando: document.getElementById("productos-cargando"),
    vacio: document.getElementById("productos-vacio"),
    error: document.getElementById("productos-error"),
    reintentar: document.getElementById("reintentar-productos"),
    estado: document.getElementById("admin-estado"),
    estadoTexto: document.getElementById("admin-estado-texto"),
    actualizacion: document.getElementById("admin-actualizacion"),
    metricaProductos: document.getElementById("metrica-productos"),
    metricaInventario: document.getElementById("metrica-inventario"),
    metricaStock: document.getElementById("metrica-stock"),
    metricaAgotados: document.getElementById("metrica-agotados"),
    imagenInput: document.getElementById("img"),
    imagenActual: document.getElementById("current-img"),
    imagenPreviewWrapper: document.getElementById("img-preview-wrapper"),
    imagenPreview: document.getElementById("img-preview"),
  };

  const campos = {
    id: document.getElementById("product-id"),
    nombre: document.getElementById("name"),
    descripcion: document.getElementById("description"),
    precio: document.getElementById("precio"),
    stock: document.getElementById("stock"),
    categoria: document.getElementById("categoria"),
    imagen: document.getElementById("img"),
    datasheet: document.getElementById("datasheet"),
  };

  const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });
  const PRODUCTOS_POR_PAGINA = 6;

  let productos = [];
  let categorias = [];
  let paginaActual = 1;
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

  function productoAPIParaLocal(producto) {
    return {
      id: producto.idProducto,
      nombre: producto.nombre || "Producto sin nombre",
      descripcion: producto.descripcion || "",
      precio: Number(producto.precio) || 0,
      stock: Number(producto.stock) || 0,
      imagen: producto.imagenUrl || "../img/default.jpg",
      categoria: producto.categoria?.nombre || producto.categoria?.nombreCategoria || "Sin categoría",
      categoriaId: producto.categoria?.idCategoria ? String(producto.categoria.idCategoria) : "",
      datasheet: producto.datasheet || producto.datasheetUrl || "",
    };
  }

  function productoLocalParaAPI(producto) {
    return {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precio),
      stock: Number(producto.stock),
      imagenUrl: producto.imagen,
      categoria: producto.categoriaId
        ? { idCategoria: Number(producto.categoriaId) }
        : null,
    };
  }

  function establecerEstado(tipo, titulo, detalle) {
    elementos.estado.classList.remove(
      "admin-dashboard__estado--cargando",
      "admin-dashboard__estado--error",
    );
    if (tipo === "cargando") {
      elementos.estado.classList.add("admin-dashboard__estado--cargando");
    }
    if (tipo === "error") {
      elementos.estado.classList.add("admin-dashboard__estado--error");
    }
    elementos.estadoTexto.textContent = titulo;
    elementos.actualizacion.textContent = detalle;
  }

  function actualizarMetricas() {
    const unidades = productos.reduce(
      (total, producto) => total + Math.max(0, Number(producto.stock) || 0),
      0,
    );
    const valorInventario = productos.reduce(
      (total, producto) => total
        + Math.max(0, Number(producto.stock) || 0) * Math.max(0, Number(producto.precio) || 0),
      0,
    );
    const agotados = productos.filter((producto) => Number(producto.stock) <= 0).length;

    elementos.metricaProductos.textContent = productos.length.toLocaleString("es-MX");
    elementos.metricaInventario.textContent = formatoMoneda.format(valorInventario);
    elementos.metricaStock.textContent = unidades.toLocaleString("es-MX");
    elementos.metricaAgotados.textContent = agotados.toLocaleString("es-MX");
  }

  function poblarCategorias() {
    campos.categoria.replaceChildren();
    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "Selecciona una categoría";
    opcionInicial.disabled = true;
    opcionInicial.selected = true;
    campos.categoria.appendChild(opcionInicial);

    elementos.filtrarCategoria.replaceChildren();
    const opcionTodas = document.createElement("option");
    opcionTodas.value = "todas";
    opcionTodas.textContent = "Todas las categorías";
    elementos.filtrarCategoria.appendChild(opcionTodas);

    categorias.forEach((categoria) => {
      const valor = String(categoria.idCategoria);
      const nombre = categoria.nombre || "Categoría";

      const opcionFormulario = document.createElement("option");
      opcionFormulario.value = valor;
      opcionFormulario.textContent = nombre;
      campos.categoria.appendChild(opcionFormulario);

      const opcionFiltro = document.createElement("option");
      opcionFiltro.value = valor;
      opcionFiltro.textContent = nombre;
      elementos.filtrarCategoria.appendChild(opcionFiltro);
    });
  }

  function obtenerProductosFiltrados() {
    const busqueda = normalizarTexto(elementos.buscar.value.trim());
    const categoria = elementos.filtrarCategoria.value;

    return productos.filter((producto) => {
      const coincideBusqueda = normalizarTexto(
        `${producto.nombre} ${producto.descripcion} ${producto.categoria} ${producto.id}`,
      ).includes(busqueda);
      const coincideCategoria = categoria === "todas"
        || String(producto.categoriaId) === categoria;
      return coincideBusqueda && coincideCategoria;
    });
  }

  function obtenerPresentacionStock(stockOriginal) {
    const stock = Math.max(0, Number(stockOriginal) || 0);
    if (stock === 0) {
      return { clase: "producto-stock--agotado", texto: "Agotado" };
    }
    if (stock <= 5) {
      return { clase: "producto-stock--bajo", texto: `${stock} disponibles` };
    }
    return { clase: "", texto: `${stock} disponibles` };
  }

  function crearFila(producto) {
    const stock = obtenerPresentacionStock(producto.stock);
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td data-label="Producto">
        <div class="producto-resumen">
          <img src="${escaparHtml(producto.imagen)}" alt="${escaparHtml(producto.nombre)}" />
          <div>
            <strong>${escaparHtml(producto.nombre)}</strong>
            <small>Producto #${escaparHtml(producto.id)}</small>
          </div>
        </div>
      </td>
      <td class="producto-categoria" data-label="Categoría">${escaparHtml(producto.categoria || "Sin categoría")}</td>
      <td class="producto-precio" data-label="Precio">${escaparHtml(formatoMoneda.format(Number(producto.precio) || 0))}</td>
      <td data-label="Existencias">
        <span class="producto-stock ${stock.clase}">${escaparHtml(stock.texto)}</span>
      </td>
      <td class="producto-acciones" data-label="Acciones">
        <div>
          <button class="producto-accion" type="button" data-action="edit" data-id="${escaparHtml(producto.id)}"
            aria-label="Editar ${escaparHtml(producto.nombre)}" title="Editar">
            <i class="bi bi-pencil" aria-hidden="true"></i>
          </button>
          <button class="producto-accion producto-accion--eliminar" type="button" data-action="delete"
            data-id="${escaparHtml(producto.id)}" aria-label="Eliminar ${escaparHtml(producto.nombre)}" title="Eliminar">
            <i class="bi bi-trash" aria-hidden="true"></i>
          </button>
        </div>
      </td>`;
    return fila;
  }

  function actualizarEstadosVista(totalFiltrados) {
    elementos.cargando.hidden = !cargando;
    elementos.error.hidden = !cargaFallida;
    elementos.vacio.hidden = cargando || cargaFallida || totalFiltrados > 0;
    elementos.tablaContenedor.hidden = cargando || cargaFallida || totalFiltrados === 0;
    elementos.panelPie.hidden = cargando || cargaFallida || totalFiltrados === 0;
  }

  function renderizarPaginacion(totalPaginas, totalFiltrados, inicio, fin) {
    elementos.paginacionResumen.textContent = totalFiltrados
      ? `Productos ${inicio + 1}–${fin} de ${totalFiltrados}`
      : "";

    if (totalPaginas <= 1) {
      elementos.paginacion.replaceChildren();
      return;
    }

    const paginasVisibles = totalPaginas <= 7
      ? Array.from({ length: totalPaginas }, (_, indice) => indice + 1)
      : [...new Set([1, paginaActual - 1, paginaActual, paginaActual + 1, totalPaginas])]
        .filter((pagina) => pagina >= 1 && pagina <= totalPaginas)
        .sort((primera, segunda) => primera - segunda);

    let html = `
      <li class="page-item">
        <button class="page-link" type="button" data-page="${paginaActual - 1}"
          aria-label="Página anterior" ${paginaActual === 1 ? "disabled" : ""}>
          <i class="bi bi-chevron-left" aria-hidden="true"></i>
        </button>
      </li>`;

    let paginaAnterior = 0;
    paginasVisibles.forEach((pagina) => {
      if (pagina - paginaAnterior > 1) {
        html += '<li class="page-item pagination-ellipsis" aria-hidden="true"><span class="page-link">&hellip;</span></li>';
      }
      const actual = pagina === paginaActual;
      html += `
        <li class="page-item ${actual ? "active" : ""}">
          <button class="page-link" type="button" data-page="${pagina}"
            aria-label="Página ${pagina}" ${actual ? 'aria-current="page"' : ""}>${pagina}</button>
        </li>`;
      paginaAnterior = pagina;
    });

    html += `
      <li class="page-item">
        <button class="page-link" type="button" data-page="${paginaActual + 1}"
          aria-label="Página siguiente" ${paginaActual === totalPaginas ? "disabled" : ""}>
          <i class="bi bi-chevron-right" aria-hidden="true"></i>
        </button>
      </li>`;
    elementos.paginacion.innerHTML = html;
  }

  function renderizarTabla() {
    const filtrados = obtenerProductosFiltrados();
    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PRODUCTOS_POR_PAGINA));
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;

    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const fin = Math.min(inicio + PRODUCTOS_POR_PAGINA, filtrados.length);
    const pagina = filtrados.slice(inicio, fin);
    const fragmento = document.createDocumentFragment();
    pagina.forEach((producto) => fragmento.appendChild(crearFila(producto)));
    elementos.tabla.replaceChildren(fragmento);

    elementos.tablaContador.textContent = cargando
      ? "Cargando productos…"
      : cargaFallida
        ? "Información no disponible"
        : `Mostrando ${filtrados.length} de ${productos.length} ${productos.length === 1 ? "producto" : "productos"}`;

    renderizarPaginacion(totalPaginas, filtrados.length, inicio, fin);
    actualizarEstadosVista(filtrados.length);
  }

  function ocultarAlertas() {
    elementos.alertaError.classList.add("d-none");
    elementos.alertaExito.classList.add("d-none");
  }

  function mostrarErrores(errores) {
    ocultarAlertas();
    const titulo = document.createElement("strong");
    titulo.textContent = "Revisa los siguientes campos:";
    const lista = document.createElement("ul");
    errores.forEach((error) => {
      const item = document.createElement("li");
      item.textContent = error;
      lista.appendChild(item);
    });
    elementos.alertaError.replaceChildren(titulo, lista);
    elementos.alertaError.classList.remove("d-none");
  }

  function mostrarExito(mensaje) {
    ocultarAlertas();
    elementos.alertaExito.textContent = mensaje;
    elementos.alertaExito.classList.remove("d-none");
    window.setTimeout(() => elementos.alertaExito.classList.add("d-none"), 3500);
  }

  function validarFormulario() {
    const errores = [];
    Object.values(campos).forEach((campo) => campo?.classList.remove("is-invalid"));

    const editando = campos.id.value !== "";
    const tieneImagenNueva = elementos.imagenInput.files.length > 0;
    const tieneImagenActual = elementos.imagenActual.value !== "";
    const datasheet = campos.datasheet.value.trim();

    if (campos.nombre.value.trim().length < 3) {
      errores.push("El nombre debe contener al menos 3 caracteres.");
      campos.nombre.classList.add("is-invalid");
    }
    if (campos.descripcion.value.trim().length < 10) {
      errores.push("La descripción debe contener al menos 10 caracteres.");
      campos.descripcion.classList.add("is-invalid");
    }
    if (campos.precio.value === "" || Number(campos.precio.value) <= 0) {
      errores.push("El precio debe ser un número mayor a 0.");
      campos.precio.classList.add("is-invalid");
    }
    if (
      campos.stock.value === ""
      || !Number.isInteger(Number(campos.stock.value))
      || Number(campos.stock.value) < 0
    ) {
      errores.push("Las existencias deben ser un número entero igual o mayor a 0.");
      campos.stock.classList.add("is-invalid");
    }
    if (!campos.categoria.value) {
      errores.push("Selecciona una categoría.");
      campos.categoria.classList.add("is-invalid");
    }
    if (!tieneImagenNueva && !(editando && tieneImagenActual)) {
      errores.push("Selecciona una imagen para el producto.");
      campos.imagen.classList.add("is-invalid");
    }
    if (datasheet && !/^https?:\/\/.+/i.test(datasheet)) {
      errores.push("La URL del datasheet debe comenzar con http:// o https://.");
      campos.datasheet.classList.add("is-invalid");
    }

    return errores;
  }

  function leerImagenComoDataURL(archivo) {
    return new Promise((resolve, reject) => {
      const imagen = new Image();
      const lector = new FileReader();

      lector.onload = () => {
        imagen.onload = () => {
          const dimensionMaxima = 1200;
          const escala = Math.min(1, dimensionMaxima / Math.max(imagen.width, imagen.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(imagen.width * escala));
          canvas.height = Math.max(1, Math.round(imagen.height * escala));
          canvas.getContext("2d").drawImage(imagen, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        imagen.onerror = () => reject(new Error("Formato de imagen no válido."));
        imagen.src = lector.result;
      };
      lector.onerror = () => reject(lector.error);
      lector.readAsDataURL(archivo);
    });
  }

  function actualizarBotonSubmit(editando, ocupado = false) {
    elementos.submit.disabled = ocupado;
    elementos.submit.setAttribute("aria-busy", String(ocupado));
    elementos.submit.innerHTML = ocupado
      ? '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span>Guardando…</span>'
      : editando
        ? '<i class="bi bi-check2" aria-hidden="true"></i><span>Actualizar producto</span>'
        : '<i class="bi bi-plus-lg" aria-hidden="true"></i><span>Guardar producto</span>';
  }

  function reiniciarFormulario() {
    elementos.form.reset();
    campos.id.value = "";
    elementos.imagenActual.value = "";
    elementos.formTitulo.textContent = "Nuevo producto";
    elementos.cancelar.classList.add("d-none");
    elementos.imagenPreviewWrapper.hidden = true;
    elementos.imagenPreview.removeAttribute("src");
    Object.values(campos).forEach((campo) => campo?.classList.remove("is-invalid"));
    actualizarBotonSubmit(false);
  }

  function cargarProductoEnFormulario(id) {
    const producto = productos.find((item) => Number(item.id) === Number(id));
    if (!producto) return;

    campos.id.value = producto.id;
    campos.nombre.value = producto.nombre;
    campos.descripcion.value = producto.descripcion;
    campos.precio.value = producto.precio;
    campos.stock.value = producto.stock;
    campos.categoria.value = producto.categoriaId;
    campos.datasheet.value = producto.datasheet || "";
    elementos.imagenInput.value = "";
    elementos.imagenActual.value = producto.imagen;
    elementos.imagenPreview.src = producto.imagen;
    elementos.imagenPreviewWrapper.hidden = false;
    elementos.formTitulo.textContent = `Editando: ${producto.nombre}`;
    elementos.cancelar.classList.remove("d-none");
    actualizarBotonSubmit(true);
    ocultarAlertas();
    elementos.form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function guardarProducto(evento) {
    evento.preventDefault();
    const errores = validarFormulario();
    if (errores.length) {
      mostrarErrores(errores);
      return;
    }

    const editandoId = campos.id.value;
    actualizarBotonSubmit(Boolean(editandoId), true);

    try {
      let imagen = elementos.imagenActual.value;
      if (elementos.imagenInput.files.length) {
        imagen = await leerImagenComoDataURL(elementos.imagenInput.files[0]);
      }

      const opcionCategoria = campos.categoria.options[campos.categoria.selectedIndex];
      const productoLocal = {
        nombre: campos.nombre.value.trim(),
        descripcion: campos.descripcion.value.trim(),
        precio: Number(campos.precio.value),
        stock: Number(campos.stock.value),
        categoria: opcionCategoria?.textContent || "Sin categoría",
        categoriaId: campos.categoria.value,
        imagen,
        datasheet: campos.datasheet.value.trim(),
      };

      if (editandoId) {
        await ChispazoAPI.actualizarProducto(
          Number(editandoId),
          productoLocalParaAPI(productoLocal),
        );
        const producto = productos.find((item) => Number(item.id) === Number(editandoId));
        if (producto) Object.assign(producto, productoLocal);
        mostrarExito("Producto actualizado correctamente.");
      } else {
        const creado = await ChispazoAPI.crearProducto(productoLocalParaAPI(productoLocal));
        productos.push({
          ...productoAPIParaLocal(creado || {}),
          ...productoLocal,
          id: creado?.idProducto,
        });
        mostrarExito("Producto agregado correctamente.");
      }

      reiniciarFormulario();
      actualizarMetricas();
      renderizarTabla();
    } catch (error) {
      mostrarErrores([
        error.status === 409
          ? "Ya existe un producto con ese nombre."
          : error.message || "No se pudo guardar el producto. Verifica la conexión y los datos.",
      ]);
    } finally {
      actualizarBotonSubmit(Boolean(campos.id.value), false);
    }
  }

  async function eliminarProducto(id, boton) {
    const producto = productos.find((item) => Number(item.id) === Number(id));
    if (!producto || !window.confirm(`¿Quieres eliminar definitivamente "${producto.nombre}"?`)) {
      return;
    }

    boton.disabled = true;
    try {
      await ChispazoAPI.eliminarProducto(id);
      productos = productos.filter((item) => Number(item.id) !== Number(id));
      mostrarExito(`"${producto.nombre}" fue eliminado correctamente.`);
      actualizarMetricas();
      renderizarTabla();
    } catch (error) {
      mostrarErrores([error.message || "No se pudo eliminar el producto."]);
      boton.disabled = false;
    }
  }

  async function cargarCatalogo() {
    const versionActual = ++versionCarga;
    cargando = true;
    cargaFallida = false;
    establecerEstado("cargando", "Sincronizando catálogo", "Consultando el servidor…");
    renderizarTabla();

    try {
      const [respuestaCategorias, respuestaProductos] = await Promise.all([
        ChispazoAPI.listarCategorias(),
        ChispazoAPI.listarProductos(),
      ]);
      if (versionActual !== versionCarga) return;

      categorias = Array.isArray(respuestaCategorias) ? respuestaCategorias : [];
      productos = Array.isArray(respuestaProductos)
        ? respuestaProductos.map(productoAPIParaLocal)
        : [];
      poblarCategorias();
      actualizarMetricas();
      establecerEstado(
        "conectado",
        "Catálogo sincronizado",
        `Actualizado ${new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      );
    } catch (error) {
      if (versionActual !== versionCarga) return;
      console.error("No fue posible cargar el catálogo.", error);
      productos = [];
      categorias = [];
      poblarCategorias();
      actualizarMetricas();
      cargaFallida = true;
      establecerEstado("error", "Servidor no disponible", "No se pudo actualizar el catálogo");
    } finally {
      if (versionActual !== versionCarga) return;
      cargando = false;
      renderizarTabla();
    }
  }

  elementos.form.addEventListener("submit", guardarProducto);
  elementos.cancelar.addEventListener("click", () => {
    reiniciarFormulario();
    ocultarAlertas();
  });
  elementos.buscar.addEventListener("input", () => {
    paginaActual = 1;
    renderizarTabla();
  });
  elementos.filtrarCategoria.addEventListener("change", () => {
    paginaActual = 1;
    renderizarTabla();
  });
  elementos.reintentar.addEventListener("click", cargarCatalogo);

  elementos.imagenInput.addEventListener("change", async () => {
    const archivo = elementos.imagenInput.files[0];
    if (!archivo) {
      elementos.imagenPreviewWrapper.hidden = !elementos.imagenActual.value;
      if (elementos.imagenActual.value) {
        elementos.imagenPreview.src = elementos.imagenActual.value;
      }
      return;
    }

    try {
      elementos.imagenPreview.src = await leerImagenComoDataURL(archivo);
      elementos.imagenPreviewWrapper.hidden = false;
      elementos.imagenInput.classList.remove("is-invalid");
    } catch {
      elementos.imagenPreviewWrapper.hidden = true;
      mostrarErrores(["No se pudo leer la imagen seleccionada."]);
    }
  });

  elementos.paginacion.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-page]");
    if (!boton || boton.disabled) return;
    const pagina = Number(boton.dataset.page);
    if (pagina < 1) return;
    paginaActual = pagina;
    renderizarTabla();
    elementos.tablaContenedor.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elementos.tabla.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-action]");
    if (!boton) return;
    const id = Number(boton.dataset.id);
    if (boton.dataset.action === "edit") cargarProductoEnFormulario(id);
    if (boton.dataset.action === "delete") eliminarProducto(id, boton);
  });

  cargarCatalogo();
})();
