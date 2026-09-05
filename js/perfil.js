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
});