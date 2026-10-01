(function () {
  const sessionKey = "chispazo_session";
  const scriptActual = document.currentScript;
  const rutaProyecto = new URL("../", scriptActual?.src || document.baseURI);
  const rutaPerfil = new URL("Html/perfil.html", rutaProyecto).href;
  const rutaAdmin = new URL("Html/admin.html", rutaProyecto).href;

  function obtenerSesion() {
    try {
      const raw = localStorage.getItem(sessionKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      localStorage.removeItem(sessionKey);
      return null;
    }
  }

  function cerrarSesion() {
    localStorage.removeItem("chispazo_session");
    localStorage.removeItem("chispazo_saved_email");
    window.location.reload();
  }

  function actualizarIconoLogin() {
  const iconoLogin = document.getElementById("icono-login");
  if (!iconoLogin) return;

  const sesion = obtenerSesion();

  if (!sesion) {
    const enlaceAdmin = document.getElementById("admin-nav-link");
    if (enlaceAdmin) enlaceAdmin.hidden = true;
    iconoLogin.classList.remove("login-activo");
    iconoLogin.setAttribute("title", "Iniciar sesión / Registrarse");
    iconoLogin.setAttribute("aria-label", "Iniciar sesión / Registrarse");
    iconoLogin.setAttribute("href", rutaPerfil);

    const submenuPrevio = document.getElementById("user-dropdown-menu");
    if (submenuPrevio) submenuPrevio.remove();
    return;
  }

  const nombre = sesion.nombre || sesion.email || "Usuario";
  const enlaceAdmin = document.getElementById("admin-nav-link");
  if (enlaceAdmin) {
    enlaceAdmin.hidden = String(sesion.rol || "").toLowerCase() !== "admin";
    enlaceAdmin.href = rutaAdmin;
  }
  iconoLogin.classList.add("login-activo");
  iconoLogin.setAttribute("title", `Sesión activa: ${nombre}`);
  iconoLogin.setAttribute("aria-label", `Sesión activa: ${nombre}`);
  iconoLogin.setAttribute("href", "#");

  // Si el usuario tiene una foto guardada, se dibuja dentro del botón circular del header
  if (sesion.avatar) {
    const avatar = document.createElement("img");
    avatar.src = sesion.avatar;
    avatar.alt = nombre;
    avatar.className = "navegacion__imagen navegacion__avatar";
    iconoLogin.replaceChildren(avatar);
  }

  const parentContainer = iconoLogin.parentElement;
  if (parentContainer) {
    parentContainer.classList.add("user-dropdown-container");
  }

  let userMenu = document.getElementById("user-dropdown-menu");
  if (!userMenu) {
    userMenu = document.createElement("div");
    userMenu.id = "user-dropdown-menu";
    userMenu.className = "user-dropdown-menu";
    userMenu.innerHTML = `
      <div class="user-dropdown-header">
        <span>Hola, <strong>${nombre}</strong></span>
      </div>
      <ul class="user-dropdown-list">
        <li>
          <a href="${rutaPerfil}">
            <i class="fa-solid fa-user me-2"></i> Mi Perfil
          </a>
        </li>
        <li>
          <button type="button" id="btn-logout-dropdown" class="btn-logout-dropdown">
            <i class="fa-solid fa-right-from-bracket me-2"></i> Cerrar sesión
          </button>
        </li>
      </ul>
    `;
    parentContainer.appendChild(userMenu);

    const logoutBtn = document.getElementById("btn-logout-dropdown");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", cerrarSesion);
    }
  }

  let hideTimeout;
  const mostrarMenu = () => {
    clearTimeout(hideTimeout);
    userMenu.classList.add("show");
  };

  const ocultarMenu = () => {
    hideTimeout = setTimeout(() => {
      userMenu.classList.remove("show");
    }, 150);
  };

  iconoLogin.addEventListener("mouseenter", mostrarMenu);
  iconoLogin.addEventListener("mouseleave", ocultarMenu);
  userMenu.addEventListener("mouseenter", mostrarMenu);
  userMenu.addEventListener("mouseleave", ocultarMenu);
}

  document.addEventListener("DOMContentLoaded", () => {
    actualizarIconoLogin();
  });

  window.addEventListener("chispazo:component-loaded", (event) => {
    if (event.detail?.id === "nav-container") {
      actualizarIconoLogin();
    }
  });
})();
