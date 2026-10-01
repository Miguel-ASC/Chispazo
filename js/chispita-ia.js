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
  const imagenChispita = new URL("../img/IACHISP.png", document.currentScript.src).href;
  const FRASES_DIALOGO = ["¡Hola, soy Chispita!"];
  const DIALOGO_PRIMERA_VEZ_MS = 1500;

  let historial = [];
  let esperandoRespuesta = false;

  const estilos = document.createElement("style");
  estilos.textContent = `
    .chispita-burbuja {
      position: fixed; right: max(24px, env(safe-area-inset-right)); bottom: max(24px, env(safe-area-inset-bottom)); left: auto; width: 88px; height: 88px;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      z-index: 9999; transition: transform 0.2s ease;
    }
    .chispita-burbuja:hover { transform: scale(1.08) translateY(-3px); }
    .chispita-burbuja img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.5)); animation: chispitaFlotar 3.2s ease-in-out infinite; }
    @keyframes chispitaFlotar {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .chispita-dialogo {
      position: absolute; right: 94px; bottom: 30px; left: auto; width: max-content; max-width: min(210px, calc(100vw - 130px));
      padding: 10px 14px; border-radius: 14px 14px 14px 4px;
      background: rgba(13, 24, 19, 0.94); color: #ffffff;
      border: 1px solid rgba(255, 193, 7, 0.55);
      box-shadow: 0 8px 22px rgba(0,0,0,0.45);
      font: 600 14px/1.35 "Quicksand", sans-serif;
      opacity: 0; visibility: hidden; transform: translateX(8px) scale(0.96);
      transform-origin: right bottom; pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
    }
    .chispita-dialogo.visible { opacity: 1; visibility: visible; transform: translateX(0) scale(1); pointer-events: auto; }
    .chispita-dialogo::before {
      content: ""; position: absolute; right: -7px; bottom: 10px; left: auto; width: 12px; height: 12px;
      transform: rotate(45deg); background: rgba(13, 24, 19, 0.94);
      border-top: 1px solid rgba(255, 193, 7, 0.55); border-right: 1px solid rgba(255, 193, 7, 0.55);
    }

    .chispita-ventana {
      position: fixed; right: max(24px, env(safe-area-inset-right)); bottom: 124px; left: auto; width: 320px;
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

    @media (max-width: 576px) {
      .chispita-ventana { right: 12px; bottom: 100px; left: 12px; width: auto; max-width: none; }
      .chispita-burbuja { right: 12px; bottom: 12px; left: auto; width: 72px; height: 72px; }
      .chispita-dialogo { right: 76px; bottom: 24px; left: auto; max-width: min(180px, calc(100vw - 108px)); font-size: 13px; }
      .chispita-burbuja:hover { transform: none; }
    }
  `;
  document.head.appendChild(estilos);

  const burbuja = document.createElement("div");
  burbuja.className = "chispita-burbuja";
  burbuja.setAttribute("role", "button");
  burbuja.setAttribute("tabindex", "0");
  burbuja.setAttribute("aria-label", "Abrir chat de ayuda Chispita");
  burbuja.innerHTML = `<img src="${imagenChispita}" alt="Chispita"><div class="chispita-dialogo" id="chispita-dialogo" aria-hidden="true"></div>`;

  const ventana = document.createElement("div");
  ventana.className = "chispita-ventana";
  ventana.innerHTML = `
    <div class="chispita-header">
      <img src="${imagenChispita}" alt="Chispita">
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
  const dialogoEl = burbuja.querySelector("#chispita-dialogo");

  let indiceFrase = 0;
  let timerDialogo;

  function mostrarDialogo() {
    dialogoEl.textContent = FRASES_DIALOGO[indiceFrase];
    indiceFrase = (indiceFrase + 1) % FRASES_DIALOGO.length;
    dialogoEl.classList.add("visible");
    clearTimeout(timerDialogo);
  }

  function ocultarDialogo() {
    dialogoEl.classList.remove("visible");
    clearTimeout(timerDialogo);
  }

  timerDialogo = setTimeout(mostrarDialogo, DIALOGO_PRIMERA_VEZ_MS);

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
    if (ventana.classList.contains("abierta")) {
      mostrarDialogo();
      inputEl.focus();
    } else {
      ocultarDialogo();
    }
  });

  burbuja.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      burbuja.click();
    }
  });

  cerrarBtn.addEventListener("click", () => {
    ventana.classList.remove("abierta");
    ocultarDialogo();
  });

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
