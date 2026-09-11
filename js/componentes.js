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


// Cargar NAV
cargarComponente(
    "nav-container",
    "/Html/nav.html"
);


// Cargar FOOTER
cargarComponente(
    "footer-container",
    "/Html/footer.html"
);