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