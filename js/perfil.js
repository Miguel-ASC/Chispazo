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
  const tabs = document.querySelector(".perfil-tabs");
  const panel = document.getElementById("perfil-sesion-panel");

  if (!perfilCard || !panel) return;

  // Ocultar tabs y formularios de login/registro
  if (formLogin) formLogin.classList.add("d-none");
  if (formRegistro) formRegistro.classList.add("d-none");
  if (tabs) tabs.classList.add("d-none");

  // Mostrar el panel de edición
  panel.classList.remove("d-none");

  // Rellenar datos existentes
  const editNombre = document.getElementById("edit-nombre");
  const editApellido = document.getElementById("edit-apellido");
  const editEmail = document.getElementById("edit-email");
  const editAntiguedad = document.getElementById("edit-antiguedad");
  const editGenero = document.getElementById("edit-genero");
  const editCurp = document.getElementById("edit-curp");
  const editFechaNac = document.getElementById("edit-fecha-nac");
  const editPassword = document.getElementById("edit-password");
  const avatarPreview = document.getElementById("avatar-preview");

  if (editNombre) editNombre.value = sesion.nombre || "";
  if (editApellido) editApellido.value = sesion.apellido || "";
  if (editEmail) editEmail.value = sesion.email || "";
  if (editGenero) editGenero.value = sesion.genero || "";
  if (editCurp) editCurp.value = sesion.curp || "";
  if (editFechaNac) editFechaNac.value = sesion.fechaNacimiento || "";
  if (editPassword && sesion.password) editPassword.value = sesion.password;

  if (editAntiguedad) {
    const fecha = sesion.fechaIngreso ? new Date(sesion.fechaIngreso) : new Date();
    editAntiguedad.value = fecha.toLocaleDateString("es-MX");
  }

  if (avatarPreview && sesion.avatar) {
    avatarPreview.src = sesion.avatar;
  }

  // --- Control del botón "Modificar" en el Perfil ---
  const btnModificarPass = document.getElementById("btn-abrir-modal-pass");
  const btnToggleEditPass = document.getElementById("btn-toggle-edit-password");

  // Asegurar estado inicial: campo oculto/readonly
  if (editPassword) {
    editPassword.setAttribute("readonly", "true");
    editPassword.type = "password";
  }
  if (btnToggleEditPass) {
    btnToggleEditPass.classList.add("d-none");
  }

  if (btnModificarPass && editPassword) {
    btnModificarPass.addEventListener("click", () => {
      const isReadOnly = editPassword.hasAttribute("readonly");

      if (isReadOnly) {
        // Habilitar edición y MOSTRAR el ojito solo al presionar Modificar
        editPassword.removeAttribute("readonly");
        editPassword.focus();

        if (btnToggleEditPass) {
          btnToggleEditPass.classList.remove("d-none");
        }

        btnModificarPass.innerHTML = '<i class="fa-solid fa-check me-1"></i> Listo';
        btnModificarPass.style.backgroundColor = "#198754";
      } else {
        // Bloquear edición, OCULTAR el ojito y reestablecer a tipo password
        editPassword.setAttribute("readonly", "true");
        editPassword.type = "password";

        if (btnToggleEditPass) {
          btnToggleEditPass.classList.add("d-none");
          const eyeIcon = btnToggleEditPass.querySelector("i");
          if (eyeIcon) eyeIcon.className = "fa-regular fa-eye";
        }

        btnModificarPass.innerHTML = '<i class="fa-solid fa-pen-to-square me-1"></i> Modificar';
        btnModificarPass.style.backgroundColor = "#1a2c4e";
      }
    });
  }

  // Evento para cambiar la foto de perfil
  const inputAvatar = document.getElementById("input-avatar");
  const fileChosenName = document.getElementById("file-chosen-name");

  if (inputAvatar) {
    inputAvatar.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        if (fileChosenName) fileChosenName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function (event) {
          const base64Image = event.target.result;
          if (avatarPreview) avatarPreview.src = base64Image;
          sesion.avatar = base64Image;
        };
        reader.readAsDataURL(file);
      } else {
        if (fileChosenName) fileChosenName.textContent = "Ningún archivo seleccionado";
      }
    });
  }

  // Guardar Cambios de Perfil
  const formEditPerfil = document.getElementById("form-edit-perfil");
  if (formEditPerfil) {
    formEditPerfil.addEventListener("submit", (e) => {
      e.preventDefault();

      sesion.nombre = editNombre ? editNombre.value.trim() : sesion.nombre;
      sesion.apellido = editApellido ? editApellido.value.trim() : sesion.apellido;
      sesion.genero = editGenero ? editGenero.value : sesion.genero;
      sesion.curp = editCurp ? editCurp.value.trim() : sesion.curp;
      sesion.fechaNacimiento = editFechaNac ? editFechaNac.value : sesion.fechaNacimiento;
      if (editPassword) sesion.password = editPassword.value;

      // 1. Guardar en la sesión activa actual (incluyendo avatar en Base64)
      localStorage.setItem("chispazo_session", JSON.stringify(sesion));

      // 2. Sincronizar con la base de datos local de usuarios
      const usuarios = JSON.parse(localStorage.getItem("chispazo_usuarios")) || [];
      const index = usuarios.findIndex((u) => u.email === sesion.email);
      if (index !== -1) {
        usuarios[index] = { ...usuarios[index], ...sesion };
        localStorage.setItem("chispazo_usuarios", JSON.stringify(usuarios));
      }

      // Restablecer campos de contraseña
      if (btnToggleEditPass) {
        btnToggleEditPass.classList.add("d-none");
        const eyeIcon = btnToggleEditPass.querySelector("i");
        if (eyeIcon) eyeIcon.className = "fa-regular fa-eye";
      }
      if (editPassword) {
        editPassword.setAttribute("readonly", "true");
        editPassword.type = "password";
      }
      if (btnModificarPass) {
        btnModificarPass.innerHTML = '<i class="fa-solid fa-pen-to-square me-1"></i> Modificar';
        btnModificarPass.style.backgroundColor = "#1a2c4e";
      }

      alert("¡Perfil actualizado con éxito!");
    });
  }

  // Evento Cerrar Sesión
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
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const perfilCard = document.querySelector(".perfil-card");
  const perfilFormLogin = document.getElementById("form-login");
  const perfilFormRegistro = document.getElementById("form-registro");
  const sesion = obtenerSesionActiva();

  // --- Delegación Global de Eventos para el Ojito ---
  document.addEventListener("click", (e) => {
    const btnToggle = e.target.closest(".toggle-password, #btn-toggle-edit-password");
    if (!btnToggle) return;

    // Si el botón tiene d-none, ignorar clic
    if (btnToggle.classList.contains("d-none")) return;

    let inputTarget = null;
    const targetId = btnToggle.getAttribute("data-target");

    if (targetId) {
      inputTarget = document.getElementById(targetId);
    } else if (btnToggle.id === "btn-toggle-edit-password") {
      inputTarget = document.getElementById("edit-password");
    } else {
      inputTarget = btnToggle.parentElement.querySelector("input");
    }

    // SI EL CAMPO TIENE READONLY (NO SE HA PULSADO MODIFICAR), NO HACE NADA
    if (inputTarget && inputTarget.hasAttribute("readonly")) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const icon = btnToggle.querySelector("i") || (e.target.tagName === "I" ? e.target : null);

    if (inputTarget) {
      if (inputTarget.type === "password") {
        inputTarget.type = "text";
        if (icon) icon.className = "fa-regular fa-eye-slash";
      } else {
        inputTarget.type = "password";
        if (icon) icon.className = "fa-regular fa-eye";
      }
    }
  });

  if (sesion && perfilCard) {
    mostrarVistaCerrarSesion(sesion);
    return;
  }

  // --- Carga Inicial desde LocalStorage ---
  const recordarmeCheck = document.getElementById("recordarme");
  const loginEmailInput = document.getElementById("login-email");

  const savedEmail = localStorage.getItem("chispazo_saved_email");
  if (savedEmail && loginEmailInput && recordarmeCheck) {
    loginEmailInput.value = savedEmail;
    recordarmeCheck.checked = true;
  }

  // --- Modal Términos y Condiciones ---
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

  // --- Formulario de Login ---
  if (perfilFormLogin) {
    perfilFormLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = document.getElementById("login-email");
      const passInput = document.getElementById("login-password");

      emailInput.setCustomValidity("");
      passInput.setCustomValidity("");

      if (!emailInput.value.trim()) {
        emailInput.setCustomValidity("Por favor ingresa tu correo electrónico.");
        emailInput.reportValidity();
        return;
      }
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.setCustomValidity("Ingresa una dirección de correo electrónico válida.");
        emailInput.reportValidity();
        return;
      }

      if (!passInput.value) {
        passInput.setCustomValidity("Por favor ingresa tu contraseña.");
        passInput.reportValidity();
        return;
      }
      if (!passwordRegex.test(passInput.value)) {
        passInput.setCustomValidity(
          "La contraseña debe incluir al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
        );
        passInput.reportValidity();
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem("chispazo_usuarios")) || [];
      const emailIngresado = emailInput.value.trim().toLowerCase();

      const usuarioValido = usuarios.find(
        (u) => u.email === emailIngresado && u.password === passInput.value
      );

      if (!usuarioValido) {
        passInput.setCustomValidity("Correo o contraseña incorrectos.");
        passInput.reportValidity();
        return;
      }

      if (recordarmeCheck && recordarmeCheck.checked) {
        localStorage.setItem("chispazo_saved_email", emailInput.value.trim());
      } else {
        localStorage.removeItem("chispazo_saved_email");
      }

      // IMPORTANTE: Incluir todos los datos guardados del usuario (avatar, género, curp, etc.)
      localStorage.setItem(
        "chispazo_session",
        JSON.stringify({
          ...usuarioValido,
          fechaIngreso: usuarioValido.fechaIngreso || new Date().toISOString()
        })
      );

      window.location.href = "../index.html";
    });

    const loginInputs = perfilFormLogin.querySelectorAll("input");
    loginInputs.forEach((input) => {
      input.addEventListener("input", () => input.setCustomValidity(""));
    });
  }

  // --- Formulario de Registro ---
  if (perfilFormRegistro) {
    perfilFormRegistro.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombreInput = document.getElementById("reg-nombre");
      const apellidoInput = document.getElementById("reg-apellido");
      const emailInput = document.getElementById("reg-email");
      const passwordInput = document.getElementById("reg-password");
      const confirmPasswordInput = document.getElementById("reg-confirm-password");
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
        nombreInput.setCustomValidity("El nombre debe tener al menos 2 caracteres.");
        nombreInput.reportValidity();
        return;
      }
      if (!textoRegex.test(nombreInput.value.trim())) {
        nombreInput.setCustomValidity("El nombre solo debe contener letras.");
        nombreInput.reportValidity();
        return;
      }

      if (!apellidoInput.value.trim() || apellidoInput.value.trim().length < 2) {
        apellidoInput.setCustomValidity("El apellido debe tener al menos 2 caracteres.");
        apellidoInput.reportValidity();
        return;
      }
      if (!textoRegex.test(apellidoInput.value.trim())) {
        apellidoInput.setCustomValidity("El apellido solo debe contener letras.");
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
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&.#_-)."
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
        terminosInput.setCustomValidity("Debes aceptar los Términos y Condiciones.");
        terminosInput.reportValidity();
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem("chispazo_usuarios")) || [];
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
        avatar: ""
      });

      try {
        localStorage.setItem("chispazo_usuarios", JSON.stringify(usuarios));
      } catch (error) {
        console.error("No se pudo guardar el usuario en localStorage:", error);
        alert("No se pudo guardar la cuenta. Verifica el espacio disponible de almacenamiento.");
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