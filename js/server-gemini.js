/* ============================================================
   SERVIDOR CHISPITA (versión GRATIS con Google Gemini)
   ------------------------------------------------------------
   CÓMO USAR ESTE SERVIDOR:
   1. npm init -y
      npm install express cors dotenv
   2. Crea un archivo ".env" con:
        GEMINI_API_KEY=tu_key_de_google_aqui
   3. Corre: node server-gemini.js
   4. Abre http://localhost:3000
   ============================================================ */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
   const GEMINI_MODEL = "gemini-3.6-flash";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const SYSTEM_PROMPT = `
Eres "Chispita", la asistente virtual de Chispazo, una tienda en línea mexicana
de componentes electrónicos, microcontroladores, sensores, kits STEM y
herramientas para makers.

Reglas:
- Responde siempre en español, de forma breve, amable y con algo de energía
  (puedes usar 1 emoji como máximo por respuesta, ej. ⚡).
- Ayuda con dudas sobre: productos del catálogo, envíos, precios,
  la calculadora de código de colores para resistencias, garantías y contacto.
- Si no sabes un dato específico de la tienda (como el estado exacto de un
  pedido), dile al usuario que escriba a soporte@chispazo.com o al
  +52 55 1234 5678.
- No inventes precios ni políticas que no te hayan dado.
- No respondas temas fuera de electrónica, la tienda Chispazo o el sitio.
`.trim();

function convertirHistorialAGemini(history) {
  if (!Array.isArray(history)) return [];
  return history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

app.post("/api/chispita", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Falta el mensaje del usuario." });
    }
    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ error: "El servidor no tiene configurada GEMINI_API_KEY." });
    }

    const contents = convertirHistorialAGemini(history);
    contents.push({ role: "user", parts: [{ text: message }] });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error de Gemini API:", errText);
      return res.status(502).json({ error: "Error al contactar a la IA." });
    }

    const data = await response.json();
    const textoRespuesta =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ||
      "No pude generar una respuesta, intenta de nuevo.";

    res.json({ reply: textoRespuesta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor Chispazo + Chispita (Gemini, gratis) en http://localhost:${PORT}`);
});