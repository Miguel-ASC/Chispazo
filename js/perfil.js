function mostrarFormulario(vista) {
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');
    const tabLogin = document.getElementById('tab-login');
    const tabRegistro = document.getElementById('tab-registro');

    if (vista === 'login') {
        formLogin.classList.remove('d-none');
        formLogin.classList.add('d-block');
        formRegistro.classList.remove('d-block');
        formRegistro.classList.add('d-none');

        tabLogin.classList.add('active');
        tabRegistro.classList.remove('active');
    } else {
        formRegistro.classList.remove('d-none');
        formRegistro.classList.add('d-block');
        formLogin.classList.remove('d-block');
        formLogin.classList.add('d-none');

        tabRegistro.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Expresiones regulares reutilizables
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // --- Lógica de Mostrar / Ocultar Contraseña (Ojo) ---
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const inputTarget = document.getElementById(targetId);
            const icon = btn.querySelector('i');

            if (inputTarget && icon) {
                if (inputTarget.type === 'password') {
                    inputTarget.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    inputTarget.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    });

    // --- Lógica del Modal ---
    const modal = document.getElementById('modal-terminos');
    const btnAbrir = document.getElementById('abrir-terminos');
    const btnCerrar = document.getElementById('cerrar-modal');
    const btnAceptar = document.getElementById('btn-aceptar-modal');
    const checkboxTerminos = document.getElementById('terminos');

    if (btnAbrir && modal) {
        btnAbrir.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
        });
    }

    const cerrarModal = () => {
        if (modal) modal.classList.remove('active');
    };

    if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);

    if (btnAceptar) {
        btnAceptar.addEventListener('click', () => {
            if (checkboxTerminos) checkboxTerminos.checked = true;
            cerrarModal();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    // --- Validaciones del Formulario de Inicio de Sesión ---
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            const emailInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-password');

            emailInput.setCustomValidity('');
            passInput.setCustomValidity('');

            // Validar correo
            if (!emailInput.value.trim()) {
                e.preventDefault();
                emailInput.setCustomValidity('Por favor ingresa tu correo electrónico.');
                emailInput.reportValidity();
                return;
            }
            if (!emailRegex.test(emailInput.value.trim())) {
                e.preventDefault();
                emailInput.setCustomValidity('Ingresa una dirección de correo electrónico válida.');
                emailInput.reportValidity();
                return;
            }

            // Validar contraseña
            if (!passInput.value) {
                e.preventDefault();
                passInput.setCustomValidity('Por favor ingresa tu contraseña.');
                passInput.reportValidity();
                return;
            }
            if (!passwordRegex.test(passInput.value)) {
                e.preventDefault();
                passInput.setCustomValidity('La contraseña debe incluir al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
                passInput.reportValidity();
                return;
            }
        });

        const loginInputs = formLogin.querySelectorAll('input');
        loginInputs.forEach(input => {
            input.addEventListener('input', () => input.setCustomValidity(''));
        });
    }

    // --- Validaciones del Formulario de Registro ---
    const formRegistro = document.getElementById('form-registro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            const nombreInput = document.getElementById('reg-nombre');
            const apellidoInput = document.getElementById('reg-apellido');
            const emailInput = document.getElementById('reg-email');
            const passwordInput = document.getElementById('reg-password');
            const confirmPasswordInput = document.getElementById('reg-confirm-password');
            const terminosInput = document.getElementById('terminos');

            [nombreInput, apellidoInput, emailInput, passwordInput, confirmPasswordInput, terminosInput].forEach(input => {
                if (input) input.setCustomValidity('');
            });

            // 1. Validar Nombre
            const textoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            if (!nombreInput.value.trim() || nombreInput.value.trim().length < 2) {
                e.preventDefault();
                nombreInput.setCustomValidity('El nombre debe tener al menos 2 caracteres.');
                nombreInput.reportValidity();
                return;
            }
            if (!textoRegex.test(nombreInput.value.trim())) {
                e.preventDefault();
                nombreInput.setCustomValidity('El nombre solo debe contener letras.');
                nombreInput.reportValidity();
                return;
            }

            // 2. Validar Apellido
            if (!apellidoInput.value.trim() || apellidoInput.value.trim().length < 2) {
                e.preventDefault();
                apellidoInput.setCustomValidity('El apellido debe tener al menos 2 caracteres.');
                apellidoInput.reportValidity();
                return;
            }
            if (!textoRegex.test(apellidoInput.value.trim())) {
                e.preventDefault();
                apellidoInput.setCustomValidity('El apellido solo debe contener letras.');
                apellidoInput.reportValidity();
                return;
            }

            // 3. Validar Correo Electrónico
            if (!emailRegex.test(emailInput.value.trim())) {
                e.preventDefault();
                emailInput.setCustomValidity('Ingresa un correo electrónico válido.');
                emailInput.reportValidity();
                return;
            }

            // 4. Validar Contraseña
            if (!passwordRegex.test(passwordInput.value)) {
                e.preventDefault();
                passwordInput.setCustomValidity('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&.#_-).');
                passwordInput.reportValidity();
                return;
            }

            // 5. Validar Coincidencia de Contraseñas
            if (passwordInput.value !== confirmPasswordInput.value) {
                e.preventDefault();
                confirmPasswordInput.setCustomValidity('Las contraseñas no coinciden.');
                confirmPasswordInput.reportValidity();
                return;
            }

            // 6. Validar Aceptación de Términos
            if (!terminosInput.checked) {
                e.preventDefault();
                terminosInput.setCustomValidity('Debes aceptar los Términos y Condiciones.');
                terminosInput.reportValidity();
                return;
            }
        });

        const regInputs = formRegistro.querySelectorAll('input');
        regInputs.forEach(input => {
            input.addEventListener('input', () => input.setCustomValidity(''));
            input.addEventListener('change', () => input.setCustomValidity(''));
        });
    }
});