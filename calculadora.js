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
  {
    name: "Negro",
    value: 1,
    color: "#000000",
    displayValue: "×1 Ω",
    textColor: "#ffffff",
  },
  {
    name: "Marrón",
    value: 10,
    color: "#3d2314",
    displayValue: "×10 Ω",
    textColor: "#ffffff",
  },
  {
    name: "Rojo",
    value: 100,
    color: "#ff0000",
    displayValue: "×100 Ω",
    textColor: "#ffffff",
  },
  {
    name: "Naranja",
    value: 1000,
    color: "#e67e22",
    displayValue: "×1 kΩ",
    textColor: "#ffffff",
  },
  {
    name: "Amarillo",
    value: 10000,
    color: "#f1c40f",
    displayValue: "×10 kΩ",
    textColor: "#000000",
  },
  {
    name: "Verde",
    value: 100000,
    color: "#27ae60",
    displayValue: "×100 kΩ",
    textColor: "#ffffff",
  },
  {
    name: "Azul",
    value: 1000000,
    color: "#2980b9",
    displayValue: "×1 MΩ",
    textColor: "#ffffff",
  },
  {
    name: "Violeta",
    value: 10000000,
    color: "#9b59b6",
    displayValue: "×10 MΩ",
    textColor: "#ffffff",
  },
  {
    name: "Gris",
    value: 100000000,
    color: "#7f8c8d",
    displayValue: "×100 MΩ",
    textColor: "#ffffff",
  },
  {
    name: "Blanco",
    value: 1000000000,
    color: "#ffffff",
    displayValue: "×1 GΩ",
    textColor: "#000000",
  },
  {
    name: "Oro",
    value: 0.1,
    color: "#b8860b",
    displayValue: "×0.1 Ω",
    textColor: "#ffffff",
  },
  {
    name: "Plata",
    value: 0.01,
    color: "#c0c0c0",
    displayValue: "×0.01 Ω",
    textColor: "#ffffff",
  },
];

const toleranceOptions = [
  {
    name: "Gris",
    value: 0.05,
    color: "#7f8c8d",
    displayValue: "0.05%",
    textColor: "#ffffff",
  },
  {
    name: "Violeta",
    value: 0.1,
    color: "#9b59b6",
    displayValue: "0.1%",
    textColor: "#ffffff",
  },
  {
    name: "Azul",
    value: 0.25,
    color: "#2980b9",
    displayValue: "0.25%",
    textColor: "#ffffff",
  },
  {
    name: "Verde",
    value: 0.5,
    color: "#27ae60",
    displayValue: "0.5%",
    textColor: "#ffffff",
  },
  {
    name: "Marrón",
    value: 1,
    color: "#3d2314",
    displayValue: "1%",
    textColor: "#ffffff",
  },
  {
    name: "Rojo",
    value: 2,
    color: "#ff0000",
    displayValue: "2%",
    textColor: "#ffffff",
  },
  {
    name: "Oro",
    value: 5,
    color: "#b8860b",
    displayValue: "5%",
    textColor: "#ffffff",
  },
  {
    name: "Plata",
    value: 10,
    color: "#c0c0c0",
    displayValue: "10%",
    textColor: "#ffffff",
  },
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

function getCurrentResistanceOhms() {
  const d1 = parseInt(band1And2Options[selected1].value);
  const d2 = parseInt(band1And2Options[selected2].value);
  const mult = multiplierOptions[selected3].value;
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

let selected1 = 1;
let selected2 = 2;
let selected3 = 4;
let selected4 = 6;

let isUpdatingFromInput = false;

function populateSelects() {
  const m1 = document.getElementById("menu1");
  const m2 = document.getElementById("menu2");
  const m3 = document.getElementById("menu3");
  const m4 = document.getElementById("menu4");

  band1And2Options.forEach((opt, index) => {
    m1.appendChild(
      createItem(opt.name, opt.value, opt, () => {
        selected1 = index;
        document.getElementById("trigger1").innerText = opt.value;
        calculateFromBands();
      }),
    );
    m2.appendChild(
      createItem(opt.name, opt.value, opt, () => {
        selected2 = index;
        document.getElementById("trigger2").innerText = opt.value;
        calculateFromBands();
      }),
    );
  });

  multiplierOptions.forEach((opt, index) => {
    m3.appendChild(
      createItem(opt.name, opt.displayValue, opt, () => {
        selected3 = index;
        document.getElementById("trigger3").innerText = opt.displayValue;
        calculateFromBands();
      }),
    );
  });

  toleranceOptions.forEach((opt, index) => {
    m4.appendChild(
      createItem(opt.name, opt.displayValue, opt, () => {
        selected4 = index;
        document.getElementById("trigger4").innerText = opt.displayValue;
        calculateFromBands();
      }),
    );
  });

  setupToggle("trigger1", m1);
  setupToggle("trigger2", m2);
  setupToggle("trigger3", m3);
  setupToggle("trigger4", m4);

  document.addEventListener("click", () => {
    [m1, m2, m3, m4].forEach((m) => m.classList.remove("show"));
  });

  document
    .getElementById("num-input")
    .addEventListener("input", calculateFromInput);
  document
    .getElementById("unit-select")
    .addEventListener("change", calculateFromInput);
  
    ["power-voltage", "power-current", "current-unit-select", "use-calculated-r"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", updatePower);
      el.addEventListener("change", updatePower);
    }
  );

  const modal = document.getElementById("instruction-modal");
  const btnOpen = document.getElementById("btn-open-modal");
  const btnCloseX = document.getElementById("modal-close-x");
  const btnContinue = document.getElementById("modal-continue-btn");

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

  calculateFromBands();
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

function calculateFromBands() {
  if (isUpdatingFromInput) return;

  const opt1 = band1And2Options[selected1];
  const opt2 = band1And2Options[selected2];
  const opt3 = multiplierOptions[selected3];
  const opt4 = toleranceOptions[selected4];

  document.getElementById("band1").style.backgroundColor = opt1.color;
  document.getElementById("band2").style.backgroundColor = opt2.color;
  document.getElementById("band3").style.backgroundColor = opt3.color;
  document.getElementById("band4").style.backgroundColor = opt4.color;

  const d1 = parseInt(opt1.value);
  const d2 = parseInt(opt2.value);
  const mult = opt3.value;

  const totalOhms = (d1 * 10 + d2) * mult;

  document.getElementById("text-ohms").innerText = formatOhms(totalOhms);
  updateChispazoEquivalent(totalOhms);
  document.getElementById("text-tolerance").innerText = opt4.displayValue;

  const unitSelect = document.getElementById("unit-select");
  if (totalOhms >= 1000000000) {
    unitSelect.value = "1000000000";
    document.getElementById("num-input").value = totalOhms / 1000000000;
  } else if (totalOhms >= 1000000) {
    unitSelect.value = "1000000";
    document.getElementById("num-input").value = totalOhms / 1000000;
  } else if (totalOhms >= 1000) {
    unitSelect.value = "1000";
    document.getElementById("num-input").value = totalOhms / 1000;
  } else {
    unitSelect.value = "1";
    document.getElementById("num-input").value = totalOhms;
  }
  updatePower();
}


function calculateFromInput() {
  const inputVal = parseFloat(document.getElementById("num-input").value);
  const unitMult = parseFloat(document.getElementById("unit-select").value);

  if (isNaN(inputVal) || inputVal <= 0) return;

  isUpdatingFromInput = true;
  const targetOhms = inputVal * unitMult;

  let bestD1 = 0,
    bestD2 = 0,
    bestMultIdx = 0;
  let minDiff = Infinity;

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

  selected1 = bestD1;
  selected2 = bestD2;
  selected3 = bestMultIdx;

  document.getElementById("trigger1").innerText =
    band1And2Options[selected1].value;
  document.getElementById("trigger2").innerText =
    band1And2Options[selected2].value;
  document.getElementById("trigger3").innerText =
    multiplierOptions[selected3].displayValue;

  document.getElementById("band1").style.backgroundColor =
    band1And2Options[selected1].color;
  document.getElementById("band2").style.backgroundColor =
    band1And2Options[selected2].color;
  document.getElementById("band3").style.backgroundColor =
    multiplierOptions[selected3].color;

  document.getElementById("text-ohms").innerText = formatOhms(targetOhms);
  updateChispazoEquivalent(targetOhms);
  isUpdatingFromInput = false;

  updatePower();
}


window.addEventListener("DOMContentLoaded", populateSelects);
