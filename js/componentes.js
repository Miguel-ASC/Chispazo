async function cargarComponente(id, archivo) {

    try {

        const response = await fetch(archivo);

        if (!response.ok) {
            throw new Error(
                `Error al cargar ${archivo}`
            );
        }

        const contenido = await response.text();

        document.getElementById(id).innerHTML = contenido;

    } catch (error) {

        console.error(error);

    }
}

const rutaBase = new URL("../", document.currentScript.src);

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