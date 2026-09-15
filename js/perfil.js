function obtenerSesionActiva() {
  try {
    const raw = localStorage.getItem("chispazo_session");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function mostrarFormulario(vista) {
  const formLogin = document.getElementById("form-login");
  const formRegistro = document.getElementById("form-registro");
  const tabLogin = document.getElementById("tab-login");
  const tabRegistro = document.getElementById("tab-registro");

  if (vista === "login") {
    if (formLogin) {
      formLogin.classList.remove("d-none");
      formLogin.classList.add("d-block");
    }
    if (formRegistro) {
      formRegistro.classList.remove("d-block");
      formRegistro.classList.add("d-none");
    }

    if (tabLogin) tabLogin.classList.add("active");
    if (tabRegistro) tabRegistro.classList.remove("active");
  } else {
    if (formRegistro) {
      formRegistro.classList.remove("d-none");
      formRegistro.classList.add("d-block");
    }
    if (formLogin) {
      formLogin.classList.remove("d-block");
      formLogin.classList.add("d-none");
    }

    if (tabRegistro) tabRegistro.classList.add("active");
    if (tabLogin) tabLogin.classList.remove("active");
  }
}

function mostrarVistaCerrarSesion(sesion) {
  const perfilCard = document.querySelector(".perfil-card");
  const formLogin = document.getElementById("form-login");
  const formRegistro = document.getElementById("form-registro");
  const tabLogin = document.getElementById("tab-login");
  const tabRegistro = document.getElementById("tab-registro");

  if (!perfilCard) return;

  if (formLogin) formLogin.classList.add("d-none");
  if (formRegistro) formRegistro.classList.add("d-none");
  if (tabLogin) tabLogin.classList.add("d-none");
  if (tabRegistro) tabRegistro.classList.add("d-none");

  let panel = document.getElementById("perfil-sesion-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "perfil-sesion-panel";
    panel.className = "perfil-sesion-panel";
    panel.innerHTML = `
      <div class="perfil-sesion-contenido text-center">
        <p class="perfil-sesion-bienvenida text-white mb-4">
          Esperamos verte pronto, <strong>${sesion.nombre || sesion.email || "Usuario"}</strong>
        </p>
        <button type="button" id="cerrar-sesion" class="btn-perfil-submit">
          Cerrar sesión
        </button>
      </div>
    `;
    perfilCard.appendChild(panel);
  }

  const cerrarSesionBtn = document.getElementById("cerrar-sesion");
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("chispazo_session");
      localStorage.removeItem("chispazo_saved_email");
      window.location.href = "../index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Expresiones regulares reutilizables
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const perfilCard = document.querySelector(".perfil-card");
  const perfilFormLogin = document.getElementById("form-login");
  const perfilFormRegistro = document.getElementById("form-registro");
  const sesion = obtenerSesionActiva();

  if (sesion && perfilCard) {
    mostrarVistaCerrarSesion(sesion);
    return;
  }

  // --- Lógica de Carga Inicial desde LocalStorage ---
  const recordarmeCheck = document.getElementById("recordarme");
  const loginEmailInput = document.getElementById("login-email");

  // Recuperar correo guardado si existía "Recordarme"
  const savedEmail = localStorage.getItem("chispazo_saved_email");
  if (savedEmail && loginEmailInput && recordarmeCheck) {
    loginEmailInput.value = savedEmail;
    recordarmeCheck.checked = true;
  }

  // --- Lógica de Mostrar / Ocultar Contraseña (Ojo) ---
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  togglePasswordButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const inputTarget = document.getElementById(targetId);
      const icon = btn.querySelector("i");

      if (inputTarget && icon) {
        if (inputTarget.type === "password") {
          inputTarget.type = "text";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          inputTarget.type = "password";
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      }
    });
  });

  // --- Lógica del Modal ---
  const modal = document.getElementById("modal-terminos");
  const btnAbrir = document.getElementById("abrir-terminos");
  const btnCerrar = document.getElementById("cerrar-modal");
  const btnAceptar = document.getElementById("btn-aceptar-modal");
  const checkboxTerminos = document.getElementById("terminos");

  if (btnAbrir && modal) {
    btnAbrir.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
    });
  }

  const cerrarModal = () => {
    if (modal) modal.classList.remove("active");
  };

  if (btnCerrar) btnCerrar.addEventListener("click", cerrarModal);

  if (btnAceptar) {
    btnAceptar.addEventListener("click", () => {
      if (checkboxTerminos) checkboxTerminos.checked = true;
      cerrarModal();
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });

  // --- Validaciones + Lógica del Formulario de Inicio de Sesión ---
  if (perfilFormLogin) {
    perfilFormLogin.addEventListener("submit", (e) => {
      e.preventDefault(); // Siempre se previene el envío nativo del formulario

      const emailInput = document.getElementById("login-email");
      const passInput = document.getElementById("login-password");

      emailInput.setCustomValidity("");
      passInput.setCustomValidity("");

      // Validar correo
      if (!emailInput.value.trim()) {
        emailInput.setCustomValidity(
          "Por favor ingresa tu correo electrónico.",
        );
        emailInput.reportValidity();
        return;
      }
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.setCustomValidity(
          "Ingresa una dirección de correo electrónico válida.",
        );
        emailInput.reportValidity();
        return;
      }

      // Validar contraseña
      if (!passInput.value) {
        passInput.setCustomValidity("Por favor ingresa tu contraseña.");
        passInput.reportValidity();
        return;
      }
      if (!passwordRegex.test(passInput.value)) {
        passInput.setCustomValidity(
          "La contraseña debe incluir al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
        );
        passInput.reportValidity();
        return;
      }

      // --- VERIFICACIÓN CONTRA USUARIOS PRE ALMACENADOS ---
      const usuarios =
        JSON.parse(localStorage.getItem("chispazo_usuarios")) || [];
      const emailIngresado = emailInput.value.trim().toLowerCase();

      const usuarioValido = usuarios.find(
        (u) => u.email === emailIngresado && u.password === passInput.value,
      );

      if (!usuarioValido) {
        passInput.setCustomValidity("Correo o contraseña incorrectos.");
        passInput.reportValidity();
        return;
      }

      // Recordarme
      if (recordarmeCheck && recordarmeCheck.checked) {
        localStorage.setItem("chispazo_saved_email", emailInput.value.trim());
      } else {
        localStorage.removeItem("chispazo_saved_email");
      }

      // Sesión activa real, basada en el usuario encontrado
      localStorage.setItem(
        "chispazo_session",
        JSON.stringify({
          email: usuarioValido.email,
          nombre: usuarioValido.nombre,
          apellido: usuarioValido.apellido,
          fechaIngreso: new Date().toISOString(),
        }),
      );

      // --- REDIRECCIÓN A LA PÁGINA DE INICIO ---
      window.location.href = "../index.html";
    });

    const loginInputs = perfilFormLogin.querySelectorAll("input");
    loginInputs.forEach((input) => {
      input.addEventListener("input", () => input.setCustomValidity(""));
    });
  }

  // --- Validaciones + Lógica del Formulario de Registro ---
  if (perfilFormRegistro) {
    perfilFormRegistro.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombreInput = document.getElementById("reg-nombre");
      const apellidoInput = document.getElementById("reg-apellido");
      const emailInput = document.getElementById("reg-email");
      const passwordInput = document.getElementById("reg-password");
      const confirmPasswordInput = document.getElementById(
        "reg-confirm-password",
      );
      const terminosInput = document.getElementById("terminos");

      const campos = [
        nombreInput,
        apellidoInput,
        emailInput,
        passwordInput,
        confirmPasswordInput,
        terminosInput,
      ];

      campos.forEach((input) => {
        if (input) input.setCustomValidity("");
      });

      const textoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

      if (!nombreInput.value.trim() || nombreInput.value.trim().length < 2) {
        nombreInput.setCustomValidity(
          "El nombre debe tener al menos 2 caracteres.",
        );
        nombreInput.reportValidity();
        return;
      }
      if (!textoRegex.test(nombreInput.value.trim())) {
        nombreInput.setCustomValidity("El nombre solo debe contener letras.");
        nombreInput.reportValidity();
        return;
      }

      if (
        !apellidoInput.value.trim() ||
        apellidoInput.value.trim().length < 2
      ) {
        apellidoInput.setCustomValidity(
          "El apellido debe tener al menos 2 caracteres.",
        );
        apellidoInput.reportValidity();
        return;
      }
      if (!textoRegex.test(apellidoInput.value.trim())) {
        apellidoInput.setCustomValidity(
          "El apellido solo debe contener letras.",
        );
        apellidoInput.reportValidity();
        return;
      }

      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.setCustomValidity("Ingresa un correo electrónico válido.");
        emailInput.reportValidity();
        return;
      }

      if (!passwordRegex.test(passwordInput.value)) {
        passwordInput.setCustomValidity(
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&.#_-).",
        );
        passwordInput.reportValidity();
        return;
      }

      if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity("Las contraseñas no coinciden.");
        confirmPasswordInput.reportValidity();
        return;
      }

      if (!terminosInput.checked) {
        terminosInput.setCustomValidity(
          "Debes aceptar los Términos y Condiciones.",
        );
        terminosInput.reportValidity();
        return;
      }

      const usuarios =
        JSON.parse(localStorage.getItem("chispazo_usuarios")) || [];
      const emailNuevo = emailInput.value.trim().toLowerCase();

      const yaExiste = usuarios.some((u) => u.email === emailNuevo);
      if (yaExiste) {
        emailInput.setCustomValidity("Este correo ya está registrado.");
        emailInput.reportValidity();
        return;
      }

      usuarios.push({
        nombre: nombreInput.value.trim(),
        apellido: apellidoInput.value.trim(),
        email: emailNuevo,
        password: passwordInput.value,
        registroFecha: new Date().toISOString(),
      });

      try {
        localStorage.setItem("chispazo_usuarios", JSON.stringify(usuarios));
      } catch (error) {
        console.error("No se pudo guardar el usuario en localStorage:", error);
        alert(
          "No se pudo guardar la cuenta. Verifica el espacio disponible de almacenamiento.",
        );
        return;
      }

      alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
      perfilFormRegistro.reset();
      mostrarFormulario("login");
    });

    const regInputs = perfilFormRegistro.querySelectorAll("input");
    regInputs.forEach((input) => {
      input.addEventListener("input", () => input.setCustomValidity(""));
      input.addEventListener("change", () => input.setCustomValidity(""));
    });
  }
});
