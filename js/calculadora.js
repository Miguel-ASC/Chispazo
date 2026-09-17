const band1And2Options = [
  { name: "Negro", value: "0", color: "#000000", textColor: "#ffffff" },
  { name: "Marrón", value: "1", color: "#3d2314", textColor: "#ffffff" },
  { name: "Rojo", value: "2", color: "#ff0000", textColor: "#ffffff" },
  { name: "Naranja", value: "3", color: "#e67e22", textColor: "#ffffff" },
  { name: "Amarillo", value: "4", color: "#f1c40f", textColor: "#000000" },
  { name: "Verde", value: "5", color: "#27ae60", textColor: "#ffffff" },
  { name: "Azul", value: "6", color: "#2980b9", textColor: "#ffffff" },
  { name: "Violeta", value: "7", color: "#9b59b6", textColor: "#ffffff" },
  { name: "Gris", value: "8", color: "#7f8c8d", textColor: "#ffffff" },
  { name: "Blanco", value: "9", color: "#ffffff", textColor: "#000000" },
];

const multiplierOptions = [
  { name: "Negro", value: 1, color: "#000000", displayValue: "×1 Ω", textColor: "#ffffff" },
  { name: "Marrón", value: 10, color: "#3d2314", displayValue: "×10 Ω", textColor: "#ffffff" },
  { name: "Rojo", value: 100, color: "#ff0000", displayValue: "×100 Ω", textColor: "#ffffff" },
  { name: "Naranja", value: 1000, color: "#e67e22", displayValue: "×1 kΩ", textColor: "#ffffff" },
  { name: "Amarillo", value: 10000, color: "#f1c40f", displayValue: "×10 kΩ", textColor: "#000000" },
  { name: "Verde", value: 100000, color: "#27ae60", displayValue: "×100 kΩ", textColor: "#ffffff" },
  { name: "Azul", value: 1000000, color: "#2980b9", displayValue: "×1 MΩ", textColor: "#ffffff" },
  { name: "Violeta", value: 10000000, color: "#9b59b6", displayValue: "×10 MΩ", textColor: "#ffffff" },
  { name: "Gris", value: 100000000, color: "#7f8c8d", displayValue: "×100 MΩ", textColor: "#ffffff" },
  { name: "Blanco", value: 1000000000, color: "#ffffff", displayValue: "×1 GΩ", textColor: "#000000" },
  { name: "Oro", value: 0.1, color: "#b8860b", displayValue: "×0.1 Ω", textColor: "#ffffff" },
  { name: "Plata", value: 0.01, color: "#c0c0c0", displayValue: "×0.01 Ω", textColor: "#ffffff" },
];

const toleranceOptions = [
  { name: "Gris", value: 0.05, color: "#7f8c8d", displayValue: "0.05%", textColor: "#ffffff" },
  { name: "Violeta", value: 0.1, color: "#9b59b6", displayValue: "0.1%", textColor: "#ffffff" },
  { name: "Azul", value: 0.25, color: "#2980b9", displayValue: "0.25%", textColor: "#ffffff" },
  { name: "Verde", value: 0.5, color: "#27ae60", displayValue: "0.5%", textColor: "#ffffff" },
  { name: "Marrón", value: 1, color: "#3d2314", displayValue: "1%", textColor: "#ffffff" },
  { name: "Rojo", value: 2, color: "#ff0000", displayValue: "2%", textColor: "#ffffff" },
  { name: "Oro", value: 5, color: "#b8860b", displayValue: "5%", textColor: "#ffffff" },
  { name: "Plata", value: 10, color: "#c0c0c0", displayValue: "10%", textColor: "#ffffff" },
];

// Opciones para la 6ª banda (coeficiente de temperatura, en ppm/°C).
// Solo se usa cuando currentBandMode === 6.
const tempCoefficientOptions = [
  { name: "Marrón", value: 100, color: "#3d2314", displayValue: "100 ppm/°C", textColor: "#ffffff" },
  { name: "Rojo", value: 50, color: "#ff0000", displayValue: "50 ppm/°C", textColor: "#ffffff" },
  { name: "Naranja", value: 15, color: "#e67e22", displayValue: "15 ppm/°C", textColor: "#ffffff" },
  { name: "Amarillo", value: 25, color: "#f1c40f", displayValue: "25 ppm/°C", textColor: "#000000" },
  { name: "Verde", value: 20, color: "#27ae60", displayValue: "20 ppm/°C", textColor: "#ffffff" },
  { name: "Azul", value: 10, color: "#2980b9", displayValue: "10 ppm/°C", textColor: "#ffffff" },
  { name: "Violeta", value: 5, color: "#9b59b6", displayValue: "5 ppm/°C", textColor: "#ffffff" },
  { name: "Gris", value: 1, color: "#7f8c8d", displayValue: "1 ppm/°C", textColor: "#ffffff" },
];

const chispazoStock = [
  { id: "P0001", ohms: 10 },
  { id: "P0002", ohms: 100 },
  { id: "P0003", ohms: 220 },
  { id: "P0004", ohms: 330 },
  { id: "P0005", ohms: 470 },
  { id: "P0006", ohms: 1000 },
  { id: "P0007", ohms: 2200 },
  { id: "P0008", ohms: 4700 },
  { id: "P0009", ohms: 10000 },
  { id: "P0010", ohms: 22000 },
  { id: "P0011", ohms: 47000 },
  { id: "P0012", ohms: 100000 },
  { id: "P0013", ohms: 1000000 },
];

function findClosestChispazoStock(ohms) {
  let best = chispazoStock[0];
  let minDiff = Math.abs(ohms - best.ohms);
  for (const item of chispazoStock) {
    const diff = Math.abs(ohms - item.ohms);
    if (diff < minDiff) {
      minDiff = diff;
      best = item;
    }
  }
  return best;
}

function updateChispazoEquivalent(ohms) {
  const el = document.getElementById("text-chispazo-equivalent");
  if (!el) return;
  const match = findClosestChispazoStock(ohms);
  if (match.ohms === ohms) {
    el.innerText = `✅ Disponible en Chispazo: ${formatOhms(match.ohms)} (código ${match.id})`;
  } else {
    el.innerText = `🔁 Equivalencia más cercana: ${formatOhms(match.ohms)} (código ${match.id})`;
  }
}

function formatOhms(ohms) {
  const abs = Math.abs(ohms);
  let value, suffix;
  if (abs >= 1000000000) {
    value = ohms / 1000000000;
    suffix = "GΩ";
  } else if (abs >= 1000000) {
    value = ohms / 1000000;
    suffix = "MΩ";
  } else if (abs >= 1000) {
    value = ohms / 1000;
    suffix = "kΩ";
  } else {
    value = ohms;
    suffix = "Ω";
  }
  const rounded = Math.round(value * 100) / 100;
  return `${rounded} ${suffix}`;
}

// ---- Estado global ----

// currentBandMode guarda si estamos calculando una resistencia
// de 4 o de 6 bandas. Todo el código que depende del número de cifras
// significativas revisa esta variable.
// ---- Estado global ----

let currentBandMode = 4;

let selected1 = 1;
let selected2 = 2;
let selectedDigit3 = 0;
let selected3 = 4;
let selected4 = 6;
let selectedTempco = 5;

let isUpdatingFromInput = false;


// Estado visual de las bandas.
// Al abrir la calculadora ninguna ha sido seleccionada.
let bandSelected = {
  band1: false,
  band2: false,
  band3: false,
  band4: false,
  band5: false,
  band6: false,
};

// Revisa currentBandMode para usar 2 o 3 cifras significativas.
function getCurrentResistanceOhms() {
  const d1 = parseInt(band1And2Options[selected1].value);
  const d2 = parseInt(band1And2Options[selected2].value);
  const mult = multiplierOptions[selected3].value;

  const hasThreeDigits = currentBandMode === 5 || currentBandMode === 6;

  if (hasThreeDigits) {
    // con 3 cifras, el número se arma como d1*100 + d2*10 + d3
    const d3 = parseInt(band1And2Options[selectedDigit3].value);
    return (d1 * 100 + d2 * 10 + d3) * mult;
  }
  return (d1 * 10 + d2) * mult;
}

function calcularPotencia({ voltaje, corriente, resistencia }) {
  const valores = [voltaje, corriente, resistencia].filter(
    (v) => v !== undefined && v !== null && !Number.isNaN(v)
  );

  if (valores.length < 2) {
    throw new Error("Ingresa al menos dos valores (voltaje, corriente o resistencia).");
  }

  const V = voltaje;
  const I = corriente;
  const R = resistencia;

  if (V !== undefined && I !== undefined) {
    return V * I;
  }
  if (I !== undefined && R !== undefined) {
    if (R < 0) throw new Error("La resistencia no puede ser negativa.");
    return Math.pow(I, 2) * R;
  }
  if (V !== undefined && R !== undefined) {
    if (R === 0) throw new Error("No se puede dividir entre una resistencia de 0 Ω.");
    return Math.pow(V, 2) / R;
  }
  throw new Error("Combinación de valores insuficiente.");
}

function formatPower(watts) {
  if (watts >= 1) return `${watts.toFixed(3)} W`;
  if (watts >= 0.001) return `${(watts * 1000).toFixed(2)} mW`;
  return `${(watts * 1e6).toFixed(2)} µW`;
}

function updatePower() {
  const errorEl = document.getElementById("power-error");
  const resultEl = document.getElementById("text-power");
  if (!errorEl || !resultEl) return;

  errorEl.textContent = "";

  const voltajeInput = document.getElementById("power-voltage").value;
  const corrienteInput = document.getElementById("power-current").value;
  const corrienteUnidad = parseFloat(
    document.getElementById("current-unit-select").value
  );
  const usarR = document.getElementById("use-calculated-r").checked;

  const voltaje = voltajeInput !== "" ? parseFloat(voltajeInput) : undefined;
  const corriente =
    corrienteInput !== "" ? parseFloat(corrienteInput) * corrienteUnidad : undefined;
  const resistencia = usarR ? getCurrentResistanceOhms() : undefined;

  try {
    const potencia = calcularPotencia({ voltaje, corriente, resistencia });
    resultEl.textContent = formatPower(potencia);
  } catch (err) {
    resultEl.textContent = "--";
    errorEl.textContent = err.message;
  }
}

function createItem(leftText, rightText, opt, clickCallback) {
  const item = document.createElement("div");
  item.className = "dropdown-item";
  item.style.backgroundColor = opt.color;
  item.style.color = opt.textColor;
  item.innerHTML = `<span>${leftText}</span><span>${rightText}</span>`;
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    clickCallback();
    item.parentElement.classList.remove("show");
  });
  return item;
}

function setupToggle(triggerId, menuElement) {
  document.getElementById(triggerId).addEventListener("click", (e) => {
    e.stopPropagation();
    const wasOpen = menuElement.classList.contains("show");
    document
      .querySelectorAll(".dropdown-menu-list")
      .forEach((m) => m.classList.remove("show"));
    if (!wasOpen) menuElement.classList.add("show");
  });
}

// Se ejecuta al hacer clic en las pestañas "4 bandas", "5 bandas" "6 bandas".
// Muestra u oculta la 3ª cifra y el coeficiente de temperatura, actualiza el estilo
// visual de las pestañas activas, ajusta la posición de las bandas en el gráfico,
// y vuelve a calcular todo con calculateFromBands().
function setBandMode(mode) {
  currentBandMode = mode;
  // Verificamos que mode esta seleccionado
  const isFiveBands = mode === 5;
  const isSixBands = mode === 6;
  // Tanto 5 y 6 bandas utilizan una 3° cifra
  const hasThreeDigits = isFiveBands || isSixBands;
  
  // NUEVO: activa/desactiva la clase que reposiciona las bandas 4 y 5 en el CSS
  // Clases para acomodar visualmente el mode 5 bandas
  document.querySelector(".resistor-body").classList.toggle("five-bands", isFiveBands);
  // Clases para acomodar visualmente el mode 6 bandas
  document.querySelector(".resistor-body").classList.toggle("six-bands", isSixBands);
  // Se muestra la 3° cifra que aparece en 5 y 6 bandas
  document.getElementById("band3").classList.toggle("d-none", !hasThreeDigits);
  // Se muestra el selector del 3° dígito en 5 y 6 bandas
  document.getElementById("col-digit3").classList.toggle("d-none", !hasThreeDigits);
  // La 6° cifra solamente aparece en mode 6 bandas
  document.getElementById("band6").classList.toggle("d-none", !isSixBands);
  // El selector de temperatura solamente aparece en mode 6 bandas
  document.getElementById("col-tempco").classList.toggle("d-none", !isSixBands);
  // El texto de temperatura solamente aparece en mode 6 bandas
  document.getElementById("text-tempco").classList.toggle("d-none", !isSixBands);
  
  // Obtenemos las pestañas
  const tab4 = document.getElementById("tab-btn-4");
  const tab5 = document.getElementById("tab-btn-5");
  const tab6 = document.getElementById("tab-btn-6");

  //Activamos las pestañas
  tab4.classList.toggle("active", mode === 4);
  tab4.setAttribute("aria-selected", String(mode === 4));
  tab5.classList.toggle("active", isFiveBands);
  tab5.setAttribute("aria-selected", String(isFiveBands));
  tab6.classList.toggle("active", isSixBands);
  tab6.setAttribute("aria-selected", String(isSixBands));

  calculateFromBands();
}

function populateSelects() {

  const m1 = document.getElementById("menu1");
  const m2 = document.getElementById("menu2");
  const mDigit3 = document.getElementById("menu-digit3");
  const m3 = document.getElementById("menu3");
  const m4 = document.getElementById("menu4");
  const mTempco = document.getElementById("menu-tempco");


  // =========================
  // CIFRAS SIGNIFICATIVAS
  // =========================

  band1And2Options.forEach((opt, index) => {

    // 1ª cifra
    m1.appendChild(
      createItem(opt.name, opt.value, opt, () => {

        selected1 = index;

        // NUEVO:
        // La banda 1 ya fue seleccionada
        bandSelected.band1 = true;

        document.getElementById("trigger1").innerText =
          opt.value;

        calculateFromBands();
      }),
    );


    // 2ª cifra
    m2.appendChild(
      createItem(opt.name, opt.value, opt, () => {

        selected2 = index;

        // NUEVO
        bandSelected.band2 = true;

        document.getElementById("trigger2").innerText =
          opt.value;

        calculateFromBands();
      }),
    );


    // 3ª cifra
    // Se utiliza en 5 y 6 bandas
    mDigit3.appendChild(
      createItem(opt.name, opt.value, opt, () => {

        selectedDigit3 = index;

        // NUEVO
        bandSelected.band3 = true;

        document.getElementById("trigger-digit3").innerText =
          opt.value;

        calculateFromBands();
      }),
    );
  });


  // =========================
  // MULTIPLICADOR
  // =========================

  multiplierOptions.forEach((opt, index) => {

    m3.appendChild(
      createItem(opt.name, opt.displayValue, opt, () => {

        selected3 = index;

        // NUEVO
        bandSelected.band4 = true;

        document.getElementById("trigger3").innerText =
          opt.displayValue;

        calculateFromBands();
      }),
    );
  });


  // =========================
  // TOLERANCIA
  // =========================

  toleranceOptions.forEach((opt, index) => {

    m4.appendChild(
      createItem(opt.name, opt.displayValue, opt, () => {

        selected4 = index;

        // NUEVO
        bandSelected.band5 = true;

        document.getElementById("trigger4").innerText =
          opt.displayValue;

        calculateFromBands();
      }),
    );
  });


  // =========================
  // COEFICIENTE TEMPERATURA
  // Solo para 6 bandas
  // =========================

  tempCoefficientOptions.forEach((opt, index) => {

    mTempco.appendChild(
      createItem(opt.name, opt.displayValue, opt, () => {

        selectedTempco = index;

        // NUEVO
        bandSelected.band6 = true;

        document.getElementById("trigger-tempco").innerText =
          opt.displayValue;

        calculateFromBands();
      }),
    );
  });


  // =========================
  // ABRIR DROPDOWNS
  // =========================

  setupToggle("trigger1", m1);
  setupToggle("trigger2", m2);
  setupToggle("trigger-digit3", mDigit3);
  setupToggle("trigger3", m3);
  setupToggle("trigger4", m4);
  setupToggle("trigger-tempco", mTempco);


  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener("click", () => {

    [m1, m2, mDigit3, m3, m4, mTempco].forEach((m) =>
      m.classList.remove("show")
    );

  });


  // =========================
  // CAMPO DE RESISTENCIA
  // =========================

  document
    .getElementById("num-input")
    .addEventListener("input", calculateFromInput);

  document
    .getElementById("unit-select")
    .addEventListener("change", calculateFromInput);


  // =========================
  // CÁLCULO DE POTENCIA
  // =========================

  [
    "power-voltage",
    "power-current",
    "current-unit-select",
    "use-calculated-r",
  ].forEach((id) => {

    const el = document.getElementById(id);

    if (!el) return;

    el.addEventListener("input", updatePower);
    el.addEventListener("change", updatePower);

  });


  // =========================
  // PESTAÑAS 4, 5 Y 6 BANDAS
  // =========================

  document
    .getElementById("tab-btn-4")
    .addEventListener("click", () => setBandMode(4));

  document
    .getElementById("tab-btn-5")
    .addEventListener("click", () => setBandMode(5));

  document
    .getElementById("tab-btn-6")
    .addEventListener("click", () => setBandMode(6));


  // =========================
  // BOTÓN REINICIAR
  // =========================

  document
    .getElementById("btn-reset")
    .addEventListener("click", resetCalculator);


  // =========================
  // MODAL
  // =========================

  const modal =
    document.getElementById("instruction-modal");

  const btnOpen =
    document.getElementById("btn-open-modal");

  const btnCloseX =
    document.getElementById("modal-close-x");

  const btnContinue =
    document.getElementById("modal-continue-btn");


  btnOpen.addEventListener("click", () => {
    modal.classList.add("open");
  });


  btnContinue.addEventListener("click", () => {
    modal.classList.remove("open");
  });


  btnCloseX.addEventListener("click", () => {
    modal.classList.remove("open");
  });


  window.addEventListener("click", (e) => {

    if (e.target === modal) {
      modal.classList.remove("open");
    }

  });


  // Cálculo inicial
  calculateFromBands();
}
function updateTempcoCalculation(totalOhms, tcrPpm) {
  const resultEl = document.getElementById("text-tempco-result");
  if (!resultEl) return;

  const tempInput = document.getElementById("temp-target");
  const targetTemp = parseFloat(tempInput.value);

  if (isNaN(targetTemp)) {
    resultEl.innerText = "";
    return;
  }

  const adjustedOhms = totalOhms * (1 + (tcrPpm * (targetTemp - 25)) / 1000000);
  resultEl.innerText = `A ${targetTemp}°C: ${formatOhms(adjustedOhms)}`;
}

// Se ramifica según currentBandMode para pintar/calcular
// la 3ª cifra y el coeficiente de temperatura solo cuando aplica (6 bandas).
function calculateFromBands() {

  if (isUpdatingFromInput) return;


  // =========================
  // OPCIONES SELECCIONADAS
  // =========================

  const opt1 =
    band1And2Options[selected1];

  const opt2 =
    band1And2Options[selected2];

  const optMult =
    multiplierOptions[selected3];

  const optTol =
    toleranceOptions[selected4];


  // 5 y 6 bandas utilizan 3 cifras
  const hasThreeDigits =
    currentBandMode === 5 ||
    currentBandMode === 6;


  // Solo 6 bandas tiene coeficiente
  // de temperatura
  const hasTempco =
    currentBandMode === 6;


  // Blanco casi transparente
  const colorInicial =
    "rgba(255, 255, 255, 0.25)";


  // =========================
  // PINTAR BANDAS COMUNES
  // =========================

  document.getElementById("band1").style.backgroundColor =
    bandSelected.band1
      ? opt1.color
      : colorInicial;


  document.getElementById("band2").style.backgroundColor =
    bandSelected.band2
      ? opt2.color
      : colorInicial;


  document.getElementById("band4").style.backgroundColor =
    bandSelected.band4
      ? optMult.color
      : colorInicial;


  document.getElementById("band5").style.backgroundColor =
    bandSelected.band5
      ? optTol.color
      : colorInicial;


  let totalOhms;


  // =========================
  // MODO 5 Y 6 BANDAS
  // =========================

  if (hasThreeDigits) {

    const opt3 =
      band1And2Options[selectedDigit3];


    // Pintar tercera cifra solamente
    // cuando haya sido seleccionada
    document.getElementById("band3").style.backgroundColor =
      bandSelected.band3
        ? opt3.color
        : colorInicial;


    const d1 =
      parseInt(opt1.value);

    const d2 =
      parseInt(opt2.value);

    const d3 =
      parseInt(opt3.value);


    totalOhms =
      (d1 * 100 + d2 * 10 + d3) *
      optMult.value;


  } else {

    // =========================
    // MODO 4 BANDAS
    // =========================

    const d1 =
      parseInt(opt1.value);

    const d2 =
      parseInt(opt2.value);


    totalOhms =
      (d1 * 10 + d2) *
      optMult.value;

  }


  // =========================
  // SOLO MODO 6 BANDAS
  // =========================

  if (hasTempco) {

    const optTempco =
      tempCoefficientOptions[selectedTempco];


    document.getElementById("band6").style.backgroundColor =
      bandSelected.band6
        ? optTempco.color
        : colorInicial;


    document.getElementById("text-tempco").innerText =
      `Coeficiente de temperatura: ${optTempco.displayValue}`;


    // IMPORTANTE:
    // Conservamos el cálculo por temperatura
    updateTempcoCalculation(
      totalOhms,
      optTempco.value
    );

  }


  // =========================
  // MOSTRAR RESULTADO
  // =========================

  document.getElementById("text-ohms").innerText =
    formatOhms(totalOhms);


  updateChispazoEquivalent(totalOhms);


  document.getElementById("text-tolerance").innerText =
    optTol.displayValue;


  // =========================
  // SINCRONIZAR INPUT
  // =========================

  const unitSelect =
    document.getElementById("unit-select");


  if (totalOhms >= 1000000000) {

    unitSelect.value = "1000000000";

    document.getElementById("num-input").value =
      totalOhms / 1000000000;


  } else if (totalOhms >= 1000000) {

    unitSelect.value = "1000000";

    document.getElementById("num-input").value =
      totalOhms / 1000000;


  } else if (totalOhms >= 1000) {

    unitSelect.value = "1000";

    document.getElementById("num-input").value =
      totalOhms / 1000;


  } else {

    unitSelect.value = "1";

    document.getElementById("num-input").value =
      totalOhms;

  }


  // Actualizar potencia
  updatePower();
}
// Tiene dos caminos según currentBandMode.
function calculateFromInput() {
  const inputVal = parseFloat(document.getElementById("num-input").value);
  const unitMult = parseFloat(document.getElementById("unit-select").value);

  if (isNaN(inputVal) || inputVal <= 0) return;

  isUpdatingFromInput = true;
  const targetOhms = inputVal * unitMult;

  let bestD1 = 0,
    bestD2 = 0,
    bestD3 = 0,
    bestMultIdx = 0;
  let minDiff = Infinity;

  const hasThreeDigits = currentBandMode === 5 || currentBandMode === 6;
  if (hasThreeDigits) {
    // Con 3 cifras significativas se necesita un
    // bucle extra (bestD3) para probar todas las combinaciones posibles.
    for (let i = 0; i < band1And2Options.length; i++) {
      for (let j = 0; j < band1And2Options.length; j++) {
        for (let k = 0; k < band1And2Options.length; k++) {
          for (let m = 0; m < multiplierOptions.length; m++) {
            const d1 = parseInt(band1And2Options[i].value);
            const d2 = parseInt(band1And2Options[j].value);
            const d3 = parseInt(band1And2Options[k].value);
            const mult = multiplierOptions[m].value;
            const currentCombinationOhms = (d1 * 100 + d2 * 10 + d3) * mult;

            const diff = Math.abs(targetOhms - currentCombinationOhms);
            if (diff < minDiff) {
              minDiff = diff;
              bestD1 = i;
              bestD2 = j;
              bestD3 = k;
              bestMultIdx = m;
            }
          }
        }
      }
    }

    selectedDigit3 = bestD3;
    document.getElementById("trigger-digit3").innerText =
      band1And2Options[selectedDigit3].value;
    document.getElementById("band3").style.backgroundColor =
      band1And2Options[selectedDigit3].color;
  } else {
    // Comportamiento original de 4 bandas (2 cifras significativas), sin cambios de lógica
    for (let i = 0; i < band1And2Options.length; i++) {
      for (let j = 0; j < band1And2Options.length; j++) {
        for (let m = 0; m < multiplierOptions.length; m++) {
          const d1 = parseInt(band1And2Options[i].value);
          const d2 = parseInt(band1And2Options[j].value);
          const mult = multiplierOptions[m].value;
          const currentCombinationOhms = (d1 * 10 + d2) * mult;

          const diff = Math.abs(targetOhms - currentCombinationOhms);
          if (diff < minDiff) {
            minDiff = diff;
            bestD1 = i;
            bestD2 = j;
            bestMultIdx = m;
          }
        }
      }
    }
  }

  selected1 = bestD1;
  selected2 = bestD2;
  selected3 = bestMultIdx;

  document.getElementById("trigger1").innerText = band1And2Options[selected1].value;
  document.getElementById("trigger2").innerText = band1And2Options[selected2].value;
  document.getElementById("trigger3").innerText = multiplierOptions[selected3].displayValue;

  document.getElementById("band1").style.backgroundColor = band1And2Options[selected1].color;
  document.getElementById("band2").style.backgroundColor = band1And2Options[selected2].color;
  document.getElementById("band4").style.backgroundColor = multiplierOptions[selected3].color;

  document.getElementById("text-ohms").innerText = formatOhms(targetOhms);
  updateChispazoEquivalent(targetOhms);
  isUpdatingFromInput = false;

  updatePower();
}

// NUEVO: reinicia la calculadora a sus valores por defecto (4 bandas, 120 kΩ 5%)
// Reinicia la calculadora conservando el modo actual
// Reinicia la calculadora
// conservando el módulo actual
function resetCalculator() {

  // =========================
  // RESTAURAR VALORES INTERNOS
  // =========================

  selected1 = 1;
  selected2 = 2;
  selectedDigit3 = 0;
  selected3 = 4;
  selected4 = 6;
  selectedTempco = 5;


  // =========================
  // RESTAURAR SELECTORES
  // =========================

  document.getElementById("trigger1").innerText =
    band1And2Options[selected1].value;

  document.getElementById("trigger2").innerText =
    band1And2Options[selected2].value;

  document.getElementById("trigger-digit3").innerText =
    band1And2Options[selectedDigit3].value;

  document.getElementById("trigger3").innerText =
    multiplierOptions[selected3].displayValue;

  document.getElementById("trigger4").innerText =
    toleranceOptions[selected4].displayValue;

  document.getElementById("trigger-tempco").innerText =
    tempCoefficientOptions[selectedTempco].displayValue;


  // =========================
  // LIMPIAR POTENCIA
  // =========================

  document.getElementById("power-voltage").value = "";

  document.getElementById("power-current").value = "";

  document.getElementById("current-unit-select").value =
    "0.001";

  document.getElementById("use-calculated-r").checked =
    true;

  document.getElementById("text-power").textContent =
    "--";

  document.getElementById("power-error").textContent =
    "";


  // =========================
  // RESTAURAR TEMPERATURA
  // =========================

  const tempInput =
    document.getElementById("temp-target");

  if (tempInput) {
    tempInput.value = "25";
  }


  const tempcoResult =
    document.getElementById(
      "text-tempco-result"
    );

  if (tempcoResult) {
    tempcoResult.innerText = "";
  }


  // =========================
  // CONSERVAR MÓDULO ACTUAL
  // =========================

  // Si estamos en 4 → permanece 4
  // Si estamos en 5 → permanece 5
  // Si estamos en 6 → permanece 6

  setBandMode(currentBandMode);


  // =========================
  // REINICIAR ESTADO VISUAL
  // =========================

  // Después de Reiniciar ninguna
  // banda se considera seleccionada.
  bandSelected = {
    band1: false,
    band2: false,
    band3: false,
    band4: false,
    band5: false,
    band6: false,
  };


  // Blanco casi transparente
  const colorInicial =
    "rgba(255, 255, 255, 0.25)";


  // Pintar todas las bandas
  // con el color inicial
  document
    .querySelectorAll(".band")
    .forEach((band) => {

      band.style.backgroundColor =
        colorInicial;

    });
}

// Se ejecuta cuando el HTML termina de cargarse
window.addEventListener("DOMContentLoaded", populateSelects);