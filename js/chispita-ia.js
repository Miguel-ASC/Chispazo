/* ============================================================
   CHISPITA (versión con IA real) - Chatbot de ayuda Chispazo
   ------------------------------------------------------------
   Requiere que server-gemini.js esté corriendo y que abras el
   sitio desde http://localhost:3000 (no el .html directo).

   Uso: agrega antes de </body>, DESPUÉS de tus otros scripts:
        <script src="chispita-ia.js"></script>
   ============================================================ */

(function () {
  const ENDPOINT = "/api/chispita";

  let historial = [];
  let esperandoRespuesta = false;

  const estilos = document.createElement("style");
  estilos.textContent = `
    .chispita-burbuja {
      position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
      border-radius: 50%; background-color: #14532d; border: 2px solid #f1c40f;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4); z-index: 9999; transition: transform 0.15s ease;
    }
    .chispita-burbuja:hover { transform: scale(1.08); }
    .chispita-burbuja img { width: 36px; height: 36px; object-fit: contain; border-radius: 50%; }

    .chispita-ventana {
      position: fixed; bottom: 96px; right: 24px; width: 320px;
      max-width: calc(100vw - 32px); height: 420px; max-height: 70vh;
      background-color: #0d1117; border: 1px solid #2f6b45; border-radius: 16px;
      display: none; flex-direction: column; overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 9999; font-family: "Quicksand", sans-serif;
    }
    .chispita-ventana.abierta { display: flex; }

    .chispita-header {
      background-color: #14532d; color: #ffffff; padding: 12px 14px;
      display: flex; align-items: center; gap: 10px;
    }
    .chispita-header img { width: 30px; height: 30px; border-radius: 50%; object-fit: contain; background: #fff; }
    .chispita-header strong { font-size: 0.95rem; }
    .chispita-header span { font-size: 0.7rem; color: #b7c9bd; display:block; }
    .chispita-cerrar { margin-left: auto; background: none; border: none; color: #ffffff; font-size: 1.1rem; cursor: pointer; line-height: 1; }

    .chispita-mensajes {
      flex: 1; overflow-y: auto; padding: 12px; display: flex;
      flex-direction: column; gap: 8px; background-color: #0d1117;
    }
    .chispita-msg {
      max-width: 80%; padding: 8px 12px; border-radius: 12px;
      font-size: 0.85rem; line-height: 1.3; word-wrap: break-word;
    }
    .chispita-msg.bot { background-color: #14532d; color: #ffffff; align-self: flex-start; border-bottom-left-radius: 2px; }
    .chispita-msg.usuario { background-color: #f1c40f; color: #000000; align-self: flex-end; border-bottom-right-radius: 2px; }
    .chispita-msg.escribiendo { opacity: 0.6; font-style: italic; }

    .chispita-form { display: flex; border-top: 1px solid #2f6b45; padding: 8px; gap: 6px; background-color: #0d1117; }
    .chispita-form input {
      flex: 1; background-color: #0d3320; border: 1px solid #2f6b45; color: #ffffff;
      border-radius: 20px; padding: 6px 12px; font-size: 0.85rem; outline: none;
    }
    .chispita-form input::placeholder { color: #b7c9bd; }
    .chispita-form input:disabled { opacity: 0.6; }
    .chispita-form button {
      background-color: #f1c40f; border: none; color: #000000; font-weight: bold;
      border-radius: 20px; padding: 0 14px; cursor: pointer; font-size: 0.85rem;
    }
    .chispita-form button:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 480px) {
      .chispita-ventana { right: 12px; left: 12px; width: auto; }
      .chispita-burbuja { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(estilos);

  const burbuja = document.createElement("div");
  burbuja.className = "chispita-burbuja";
  burbuja.setAttribute("role", "button");
  burbuja.setAttribute("aria-label", "Abrir chat de ayuda Chispita");
  burbuja.innerHTML = `<img src="img/logo.png" alt="Chispita">`;

  const ventana = document.createElement("div");
  ventana.className = "chispita-ventana";
  ventana.innerHTML = `
    <div class="chispita-header">
      <img src="img/logo.png" alt="Chispita">
      <div>
        <strong>Chispita</strong>
        <span>Asistente con IA de Chispazo</span>
      </div>
      <button type="button" class="chispita-cerrar" aria-label="Cerrar chat">✕</button>
    </div>
    <div class="chispita-mensajes" id="chispita-mensajes"></div>
    <form class="chispita-form" id="chispita-form">
      <input type="text" id="chispita-input" placeholder="Escribe tu pregunta..." autocomplete="off">
      <button type="submit">Enviar</button>
    </form>
  `;

  document.body.appendChild(burbuja);
  document.body.appendChild(ventana);

  const mensajesEl = ventana.querySelector("#chispita-mensajes");
  const formEl = ventana.querySelector("#chispita-form");
  const inputEl = ventana.querySelector("#chispita-input");
  const botonEl = ventana.querySelector("button[type=submit]");
  const cerrarBtn = ventana.querySelector(".chispita-cerrar");

  function agregarMensaje(texto, tipo) {
    const msg = document.createElement("div");
    msg.className = `chispita-msg ${tipo}`;
    msg.textContent = texto;
    mensajesEl.appendChild(msg);
    mensajesEl.scrollTop = mensajesEl.scrollHeight;
    return msg;
  }

  let saludoMostrado = false;

  burbuja.addEventListener("click", () => {
    ventana.classList.toggle("abierta");
    if (ventana.classList.contains("abierta") && !saludoMostrado) {
      agregarMensaje("¡Hola! ⚡ Soy Chispita, con IA de verdad. Pregúntame lo que quieras sobre Chispazo.", "bot");
      saludoMostrado = true;
    }
    if (ventana.classList.contains("abierta")) inputEl.focus();
  });

  cerrarBtn.addEventListener("click", () => ventana.classList.remove("abierta"));

  async function enviarMensaje(texto) {
    esperandoRespuesta = true;
    inputEl.disabled = true;
    botonEl.disabled = true;

    const msgEscribiendo = agregarMensaje("Chispita está escribiendo...", "bot escribiendo");

    try {
      const resp = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: texto, history: historial }),
      });

      const data = await resp.json();
      msgEscribiendo.remove();

      if (!resp.ok) {
        agregarMensaje(
          data.error || "Ups, tuve un problema para responder. Intenta de nuevo.",
          "bot"
        );
        return;
      }

      agregarMensaje(data.reply, "bot");

      historial.push({ role: "user", content: texto });
      historial.push({ role: "assistant", content: data.reply });

      if (historial.length > 20) historial = historial.slice(-20);
    } catch (err) {
      console.error(err);
      msgEscribiendo.remove();
      agregarMensaje(
        "No pude conectarme con el servidor. ¿Está corriendo server-gemini.js?",
        "bot"
      );
    } finally {
      esperandoRespuesta = false;
      inputEl.disabled = false;
      botonEl.disabled = false;
      inputEl.focus();
    }
  }

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = inputEl.value.trim();
    if (!texto || esperandoRespuesta) return;
    agregarMensaje(texto, "usuario");
    inputEl.value = "";
    enviarMensaje(texto);
  });
})();