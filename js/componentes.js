async function cargarComponente(id, archivo) {
  const contenedor = document.getElementById(id);
  if (!contenedor) return;

    try {

        const response = await fetch(archivo);

        if (!response.ok) {
            throw new Error(
                `Error al cargar ${archivo}`
            );
        }

        const contenido = (await response.text()).replace(
            /(src|href)="\/([^"]*)"/g,
            (_, atributo, ruta) => `${atributo}="${new URL(ruta, rutaBase).href}"`
        );

        contenedor.innerHTML = contenido;
        window.dispatchEvent(
            new CustomEvent("chispazo:component-loaded", { detail: { id } })
        );

    } catch (error) {

        console.error(error);

    }
}

const scriptComponentes = document.currentScript ||
    Array.from(document.scripts).find((script) =>
        script.src.endsWith("/js/componentes.js")
    );
const rutaBase = new URL(
    "../",
    scriptComponentes?.src || document.baseURI
);

// Cargar NAV
cargarComponente(
    "nav-container",
    new URL("Html/nav.html", rutaBase).href
);


// Cargar FOOTER
cargarComponente(
    "footer-container",
    new URL("Html/footer.html", rutaBase).href
);

// =========================================================
// MEGA SUBMENÚ "Productos" — hover en escritorio, tap en móvil
// =========================================================

function attachMegaSubmenuHandlers() {
  const dropdownContainer = document.querySelector(".dropdown-menu-container");
  const megaSubmenu = document.querySelector(".mega-submenu");
  const trigger = dropdownContainer?.querySelector(".mega-submenu-toggle");

  if (!dropdownContainer || !megaSubmenu || !trigger || dropdownContainer.dataset.menuBound === "1") {
    return;
  }
  dropdownContainer.dataset.menuBound = "1";

  const esMovil = () => window.matchMedia("(max-width: 991.98px)").matches;
  let timerOcultar;

  const mantenerMenuAbierto = () => {
    clearTimeout(timerOcultar);
    megaSubmenu.classList.add("activo");
    trigger.setAttribute("aria-expanded", "true");
  };

  const cerrarMenu = () => {
    megaSubmenu.classList.remove("activo");
    trigger.setAttribute("aria-expanded", "false");
  };

  const programarCierreMenu = () => {
    timerOcultar = setTimeout(cerrarMenu, 220);
  };

  dropdownContainer.addEventListener("mouseenter", () => {
    if (!esMovil()) mantenerMenuAbierto();
  });
  dropdownContainer.addEventListener("mouseleave", () => {
    if (!esMovil()) programarCierreMenu();
  });
  megaSubmenu.addEventListener("mouseenter", () => {
    if (!esMovil()) mantenerMenuAbierto();
  });
  megaSubmenu.addEventListener("mouseleave", () => {
    if (!esMovil()) programarCierreMenu();
  });

  trigger.addEventListener("click", () => {
    if (megaSubmenu.classList.contains("activo")) {
      cerrarMenu();
    } else {
      mantenerMenuAbierto();
    }
  });

  document.addEventListener("click", (event) => {
    if (!dropdownContainer.contains(event.target)) {
      cerrarMenu();
    }
  });

  megaSubmenu.addEventListener("click", (event) => {
    if (event.target.closest("a") && esMovil()) cerrarMenu();
  });
}

function configurarMenuPrincipal() {
  const navegacion = document.querySelector(".navegacion");
  const boton = document.getElementById("menu-toggle");
  const contenido = document.getElementById("menu-principal");
  if (!navegacion || !boton || !contenido || navegacion.dataset.navBound === "1") return;

  navegacion.dataset.navBound = "1";

  const establecerAbierto = (abierto) => {
    navegacion.classList.toggle("menu-abierto", abierto);
    boton.setAttribute("aria-expanded", String(abierto));
    const texto = boton.querySelector(".visually-hidden");
    if (texto) texto.textContent = abierto ? "Cerrar menú" : "Abrir menú";
    if (!abierto) {
      document.querySelector(".mega-submenu")?.classList.remove("activo");
      document.querySelector(".mega-submenu-toggle")?.setAttribute("aria-expanded", "false");
    }
  };

  boton.addEventListener("click", () => {
    establecerAbierto(!navegacion.classList.contains("menu-abierto"));
  });

  contenido.addEventListener("click", (event) => {
    if (
      window.matchMedia("(max-width: 991.98px)").matches
      && event.target.closest("a")
      && !event.target.closest(".mega-submenu-toggle")
    ) {
      establecerAbierto(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!navegacion.contains(event.target)) establecerAbierto(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navegacion.classList.contains("menu-abierto")) {
      establecerAbierto(false);
      boton.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 991) establecerAbierto(false);
  });
}

function marcarEnlaceActual() {
  const rutaActual = window.location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll(".navegacion__pestañas > a, .navegacion__producto-trigger > a")
    .forEach((enlace) => {
      const rutaEnlace = new URL(enlace.href, window.location.href).pathname.replace(/\/+$/, "") || "/";
      const esProductos = rutaEnlace.endsWith("/Html/productos.html")
        && rutaActual.endsWith("/Html/productos.html");
      if (rutaEnlace === rutaActual || esProductos) enlace.setAttribute("aria-current", "page");
    });
}

function configurarBuscadorProductos() {
  const input = document.getElementById("buscador-productos");
  const boton = document.getElementById("btn-buscar-productos");
  if (!input || !boton || input.dataset.searchBound === "1") return;

  const buscar = () => {
    const rutaProductos = new URL("Html/productos.html", rutaBase);
    const termino = input.value.trim();
    if (termino) rutaProductos.searchParams.set("buscar", termino);
    window.location.href = rutaProductos.href;
  };

  input.dataset.searchBound = "1";
  boton.addEventListener("click", buscar);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") buscar();
  });
}

window.addEventListener("chispazo:component-loaded", (event) => {
  if (event.detail && event.detail.id === "nav-container") {
    configurarMenuPrincipal();
    attachMegaSubmenuHandlers();
    configurarBuscadorProductos();
    marcarEnlaceActual();
  }
});
