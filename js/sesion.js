(function () {
  const sessionKey = "chispazo_session";

  function obtenerSesion() {
    try {
      const raw = localStorage.getItem(sessionKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      localStorage.removeItem(sessionKey);
      return null;
    }
  }

  function actualizarIconoLogin() {
    const iconoLogin = document.getElementById("icono-login");
    if (!iconoLogin) return;

    const sesion = obtenerSesion();

    if (!sesion) {
      iconoLogin.classList.remove("login-activo");
      iconoLogin.setAttribute("title", "Iniciar sesión / Registrarse");
      iconoLogin.setAttribute("aria-label", "Iniciar sesión / Registrarse");
      iconoLogin.setAttribute("href", "/Html/perfil.html");
      return;
    }

    const nombre = sesion.nombre || sesion.email || "usuario";
    iconoLogin.classList.add("login-activo");
    iconoLogin.setAttribute("title", `Sesión activa: ${nombre}`);
    iconoLogin.setAttribute("aria-label", `Sesión activa: ${nombre}`);
    iconoLogin.setAttribute("href", "/Html/perfil.html");
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
