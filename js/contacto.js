document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const nombreInput = document.getElementById("nombre");
  const alertSuccess = document.getElementById("alertSuccess");

  // 1. Restricción en tiempo real para el campo Nombre Completo
  if (nombreInput) {
    nombreInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    });
  }

  // 2. Validación y control de envío
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        if (alertSuccess) alertSuccess.classList.add("d-none");
        return;
      }

      // SI TODO ES VÁLIDO: Mostrar y animar alerta personalizada
      if (alertSuccess) {
        // Limpia clases previas de animación por si se envía más de una vez
        alertSuccess.classList.remove("d-none", "fade");
        alertSuccess.classList.add("show");

        // Desplazamiento suave hacia la alerta
        alertSuccess.scrollIntoView({ behavior: "smooth", block: "center" });

        // PROGRAMAR EL DESVANECIMIENTO (Se oculta tras 4 segundos)
        setTimeout(() => {
          alertSuccess.classList.add("fade");
          alertSuccess.classList.remove("show");

          // Espera a que termine la animación visual de Bootstrap para ocultar el bloque por completo
          setTimeout(() => {
            alertSuccess.classList.add("d-none");
          }, 1500);
        }, 4000);
      }

      form.reset();

      setTimeout(() => {
        form.classList.remove("was-validated");
      }, 500);
    });
  }
});
