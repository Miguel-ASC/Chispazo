async function cargarComponente(id, archivo) {

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

        document.getElementById(id).innerHTML = contenido;
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
  const trigger = dropdownContainer ? dropdownContainer.querySelector(":scope > a") : null;

  if (!dropdownContainer || !megaSubmenu || !trigger || dropdownContainer.dataset.menuBound === "1") {
    return;
  }
  dropdownContainer.dataset.menuBound = "1";

  const esMovil = () => window.matchMedia("(max-width: 767.98px)").matches;
  let timerOcultar;

  const mantenerMenuAbierto = () => {
    clearTimeout(timerOcultar);
    megaSubmenu.classList.add("activo");
  };

  const programarCierreMenu = () => {
    timerOcultar = setTimeout(() => {
      megaSubmenu.classList.remove("activo");
    }, 250);
  };

  // Hover: solo debe aplicar en escritorio
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

  // Tap en móvil: el primer toque abre/cierra el submenú en vez
  // de navegar. En escritorio dejamos que el click navegue normal.
  trigger.addEventListener("click", (event) => {
    if (!esMovil()) return;
    event.preventDefault();
    megaSubmenu.classList.toggle("activo");
  });

  // Cierra el submenú si el usuario toca fuera de él (solo móvil)
  document.addEventListener("click", (event) => {
    if (!esMovil()) return;
    if (!dropdownContainer.contains(event.target)) {
      megaSubmenu.classList.remove("activo");
    }
  });
}

window.addEventListener("chispazo:component-loaded", (event) => {
  if (event.detail && event.detail.id === "nav-container") {
    attachMegaSubmenuHandlers();
  }
});