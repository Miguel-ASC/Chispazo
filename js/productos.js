function normalizarImagenProducto(ruta) {
  if (!ruta || ruta.startsWith("data:") || /^https?:\/\//.test(ruta)) {
    return ruta;
  }
  const nombreArchivo = ruta.replace(/^.*(?:\/|^)img\//, "");
  return new URL(`../img/${nombreArchivo}`, document.baseURI).href;
}

function seedProductosIniciales(productsController) {
  if (productsController.items.length > 0) return;

  const seed = [
    ["Resistencias", "Valores disponibles: (10W a 1MW). Alta precisión para control de corriente en circuitos.", "15.00", "../img/Resistencias.jpg", "2024-05-01", "Resistencias", "https://www.alldatasheet.com/datasheet-pdf/pdf/2273728/TEC/RESISTOR%20FOR.html"],
    ["Capacitores", "Valores disponibles: (10pF–100nF). Filtrado de señal y desacople en fuentes de poder.", "25.00", "../img/Capacitores.jpg", "2024-05-01", "Capacitores", "https://www.alldatasheet.com/datasheet-pdf/pdf/1488521/ATGBICS/CPAC-TR-10LR-C.html"],
    ["Diodos rectificadores", "Valores disponibles: 1N4001–1N4007. Diodos rectificadores de propósito general.", "30.00", "../img/Diodos.jpg", "2024-05-02", "Semiconductores", "https://www.alldatasheet.com/datasheet-pdf/pdf/1976242/TI/1N4007.html"],
    ["Bobinas e Inductores", "Valores disponibles: (10uH–10mH). Almacenamiento de energía en campos magnéticos.", "45.00", "../img/Bobinas.jpg", "2024-05-02", "Bobinas e inductores", "https://www.alldatasheet.com/datasheet-pdf/pdf/1368729/SPARKFUN/BOB-00716.html"],
    ["Conectores y Cables", "Valores disponibles: 2.54mm (macho/hembra). Cables Dupont para prototipado rápido.", "35.00", "../img/Conectores.jpg", "2024-05-03", "Conectores y cables", "https://www.alldatasheet.com/datasheet-pdf/pdf/1333583/MAXIM/CABLE.html"],
    ["Módulo ESP32", "Wi-Fi & Bluetooth dual core con antenas integradas.", "145.00", "../img/esp32_esp8266.jpg", "2024-05-03", "Módulos y placas", "https://www.alldatasheet.com/datasheet-pdf/pdf/576132/HAMMOND/ECP.html"],
    ["Sensor de gas MQ-2", "Valores disponibles: (MQ-2, MQ-3, MQ-7, MQ-135). Detección analógica y digital.", "85.00", "../img/sensor-de-gas-y-aire-MQ-2.jpg", "2024-05-04", "Sensores", "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html"],
    ["Válvula solenoide", "Valores disponibles: (12V, 24V). Control de flujo magnético en sistemas neumáticos o de agua.", "190.00", "../img/valvulas_solenoides24v.jpg", "2024-05-04", "Actuadores", "https://www.alldatasheet.com/manufacture/view_manu_link.jsp?idx=3284379&p=ACT00AB-B-EL41P&f=TE+Connectivity"],
    ["Baterías recargables", "Valores disponibles: (LiPo, Li-ion 18650, alcalinas). Soluciones portátiles de energía.", "120.00", "../img/Baterías (LiPo, Li-ion 18650, alcalinas).jpg", "2024-05-05", "Alimentación", "https://www.alldatasheet.com/datasheet-pdf/pdf/272427/GAMEWELL-FCI/BAT-12120.html"],
    ["Pantalla táctil", "Pantallas táctiles resistivas y capacitivas para proyectos con interacción de usuario.", "120.00", "../img/pantalla tactil resistiva-capacitiva.jpg", "2024-05-05", "Interfaz y entrada", "https://www.alldatasheet.com/datasheet-pdf/pdf/2183094/AXIOMTEK/MODULE%20KIT.html"],
  ];

  seed.forEach(([name, description, precio, img, createdAt, categoria, datasheet]) => {
    productsController.addProduct(name, description, precio, normalizarImagenProducto(img), createdAt, categoria, datasheet);
  });
}

function backfillDatasheetsExistentes(productsController) {
  const datasheetsPorNombre = {
    "Resistencias": "https://www.alldatasheet.com/datasheet-pdf/pdf/2273728/TEC/RESISTOR%20FOR.html",
    "Capacitores": "https://www.alldatasheet.com/datasheet-pdf/pdf/1488521/ATGBICS/CPAC-TR-10LR-C.html",
    "Diodos rectificadores": "https://www.alldatasheet.com/datasheet-pdf/pdf/1976242/TI/1N4007.html",
    "Bobinas e Inductores": "https://www.alldatasheet.com/datasheet-pdf/pdf/1368729/SPARKFUN/BOB-00716.html",
    "Conectores y Cables": "https://www.alldatasheet.com/datasheet-pdf/pdf/1333583/MAXIM/CABLE.html",
    "Módulo ESP32": "https://www.alldatasheet.com/datasheet-pdf/pdf/576132/HAMMOND/ECP.html",
    "Sensor de gas MQ-2": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html",
    "Válvula solenoide": "https://www.alldatasheet.com/manufacture/view_manu_link.jsp?idx=3284379&p=ACT00AB-B-EL41P&f=TE+Connectivity",
    "Baterías recargables": "https://www.alldatasheet.com/datasheet-pdf/pdf/272427/GAMEWELL-FCI/BAT-12120.html",
    "Pantalla táctil": "https://www.alldatasheet.com/datasheet-pdf/pdf/2183094/AXIOMTEK/MODULE%20KIT.html",
    "Semiconductores": "https://www.alldatasheet.com/datasheet-pdf/pdf/15021/PHILIPS/1N4148.html",
    "Conectores y cables": "https://www.alldatasheet.com/datasheet-pdf/pdf/1333583/MAXIM/CABLE.html",
    "Módulos y placas": "https://www.alldatasheet.com/datasheet-pdf/pdf/1424860/ETC/ARDUINO-NANO.html",
    "Sensores": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html",
    "Actuadores": "https://www.alldatasheet.com/manufacture/view_manu_link.jsp?idx=3284379&p=ACT00AB-B-EL41P&f=TE+Connectivity",
    "Interfaz y entrada": "https://www.alldatasheet.com/datasheet-pdf/pdf/2183094/AXIOMTEK/MODULE%20KIT.html",
    "Automatización": "https://www.alldatasheet.com/datasheet-pdf/pdf/2183094/AXIOMTEK/MODULE%20KIT.html",
    "IOT y Domótica": "https://www.alldatasheet.com/datasheet-pdf/pdf/1444708/MURATA1/ENC-03J.html",
    "Soldadura": "https://www.alldatasheet.com/datasheet-pdf/pdf/1085906/TAIYO-YUDEN/EST0645T100MDGA.html",
    "Redes y conectividad": "https://www.alldatasheet.com/datasheet-pdf/pdf/2293536/SEMTECH/ANTENNA-2-IN-1-DOME.html",
    "Instrumentación.": "https://www.alldatasheet.com/datasheet-pdf/pdf/2327471/WAVELENGTH/MULTI-HTSK.html",
    "Bobinas e inductores": "https://www.alldatasheet.com/datasheet-pdf/pdf/1368729/SPARKFUN/BOB-00716.html",
    "Kits": "https://www.alldatasheet.com/datasheet-pdf/pdf/2308939/CLARKE/KIT%201000.html",
    "Alimentación": "https://www.alldatasheet.com/datasheet-pdf/pdf/727348/MERITEK/MOC.html",
    "220 Ω": "https://www.alldatasheet.com/datasheet-pdf/pdf/2273728/TEC/RESISTOR%20FOR.html",
    "330 Ω": "https://www.alldatasheet.com/datasheet-pdf/pdf/2273728/TEC/RESISTOR%20FOR.html",
    "100 Ω": "https://www.alldatasheet.com/datasheet-pdf/pdf/2273728/TEC/RESISTOR%20FOR.html",
    "10 KΩ": "https://www.alldatasheet.com/datasheet-pdf/pdf/2273728/TEC/RESISTOR%20FOR.html",
    "4.7 KΩ": "https://www.alldatasheet.com/datasheet-pdf/pdf/2273728/TEC/RESISTOR%20FOR.html",
    "100 KΩ": "https://www.alldatasheet.com/datasheet-pdf/pdf/2273728/TEC/RESISTOR%20FOR.html",
    "µF,V": "https://www.alldatasheet.com/datasheet-pdf/pdf/1488521/ATGBICS/CPAC-TR-10LR-C.html",
    "nF": "https://www.alldatasheet.com/datasheet-pdf/pdf/612033/MORNSUN/FILTER2.html",
    "1N4148": "https://www.alldatasheet.com/datasheet-pdf/pdf/15021/PHILIPS/1N4148.html",
    "LED Rojo": "https://www.alldatasheet.com/datasheet-pdf/pdf/1507654/ETC/LED-051.html",
    "LED RGB": "https://www.alldatasheet.com/datasheet-pdf/pdf/1507654/ETC/LED-051.html",
    "2N2222": "https://www.alldatasheet.com/datasheet-pdf/pdf/15067/PHILIPS/2N2222.html",
    "BC547": "https://www.alldatasheet.com/datasheet-pdf/pdf/336701/CAMBION/555-0402.html",
    "555 Temporizador": "https://www.alldatasheet.com/datasheet-pdf/pdf/336701/CAMBION/555-0402.html",
    "LM358": "https://www.alldatasheet.com/api/api_ele14.jsp?p=LM%202N%203.5%2F8&f=WEIDMULLER",
    "ATmega328": "http://api.supplyframe.com/v1/t?d=d539fa1p3&p=ATMEGA328P-ANR&s=AT+MEGA+328&h=7OOAyrXz_WwDk0lobnnkeg&currency=&h_crc=e54f977d686c92389281e48dbb92e903",
    "1N4007": "https://www.alldatasheet.com/datasheet-pdf/pdf/1976242/TI/1N4007.html",
    "IRF540": "https://www.alldatasheet.com/datasheet-pdf/pdf/17799/PHILIPS/IRF540.html",
    "Hembra (M-H)": "https://www.alldatasheet.com/datasheet-pdf/pdf/1333583/MAXIM/CABLE.html",
    "2.54mm 40 pines": "https://www.alldatasheet.com/datasheet-pdf/pdf/2062565/AGELECTRONICA/HEADER-1.html",
    "USB-C": "https://www.alldatasheet.com/datasheet-pdf/pdf/2191150/AXIOMTEK/USB%20CABLE.html",
    "Conectores DC": "https://www.alldatasheet.com/datasheet-pdf/pdf/2063495/AGELECTRONICA/CONECTOR-USBMICRO-SMD.html",
    "Arduino UNO": "https://www.alldatasheet.com/datasheet-pdf/pdf/1424860/ETC/ARDUINO-NANO.html",
    "ESP32": "https://www.alldatasheet.com/datasheet-pdf/pdf/576132/HAMMOND/ECP.html",
    "Protoboard": "https://www.alldatasheet.com/datasheet-pdf/pdf/1894635/ETC/PROTO-SHIELD.html",
    "Arduino Mega": "https://www.alldatasheet.com/datasheet-pdf/pdf/1424860/ETC/ARDUINO-NANO.html",
    "Módulo relé 4 canales": "https://www.alldatasheet.com/datasheet-pdf/pdf/2183094/AXIOMTEK/MODULE%20KIT.html",
    "Regulador step-down": "https://www.alldatasheet.com/datasheet-pdf/pdf/85122/TI/REG101.html",
    "DHT11": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html",
    "DS18B20 sumergible": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123252/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-24V.html",
    "LDR": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html",
    "HC-SR04": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html",
    "MQ-135": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html",
    "MPU6050": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html",
    "ESP32-CAM": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html",
    "Servo SG90": "https://www.alldatasheet.com/manufacture/view_manu_link.jsp?idx=3284379&p=ACT00AB-B-EL41P&f=TE+Connectivity",
    "Paso a paso NEMA 17": "https://www.alldatasheet.com/manufacture/view_manu_link.jsp?idx=3284379&p=ACT00AB-B-EL41P&f=TE+Connectivity",
    "Optoacoplador": "https://www.alldatasheet.com/datasheet-pdf/pdf/1722831/IPDPOWER/REL-110.html",
    "Buzzer activo": "https://www.alldatasheet.com/datasheet-pdf/pdf/1722831/IPDPOWER/REL-110.html",
    "Display OLED": "https://www.alldatasheet.com/datasheet-pdf/pdf/1441849/RAYEX/LUZ-12.html",
    "Teclado matricial 4x4": "https://www.alldatasheet.com/datasheet-pdf/pdf/2183094/AXIOMTEK/MODULE%20KIT.html",
    "Joystick analógico": "https://www.alldatasheet.com/datasheet-pdf/pdf/2183094/AXIOMTEK/MODULE%20KIT.html",
    "Encoder rotativo": "https://www.alldatasheet.com/datasheet-pdf/pdf/2183094/AXIOMTEK/MODULE%20KIT.html",
    "Botón pulsador": "https://www.alldatasheet.com/datasheet-pdf/pdf/2183094/AXIOMTEK/MODULE%20KIT.html",
    "Módulo HMI pequeño": "https://www.alldatasheet.com/datasheet-pdf/pdf/2183094/AXIOMTEK/MODULE%20KIT.html",
    "Sensor PT100": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html",
    "Sensor inductivo industrial": "https://www.alldatasheet.com/datasheet-pdf/pdf/2123251/AGELECTRONICA/SENSOR-ESP-ONSLASHOFFSLASHDIM-12V.html",
    "Contactor 12A": "https://www.alldatasheet.com/datasheet-pdf/pdf/525502/MICREL/ContactFactory.html",
    "Guardamotor": "https://www.alldatasheet.com/datasheet-pdf/pdf/2217616/ELMA/GUARDBOX-33.html",
    "Enchufe inteligente WiFi": "https://www.alldatasheet.com/datasheet-pdf/pdf/1444708/MURATA1/ENC-03J.html",
    "Sensor puerta/ventana WiFi": "https://www.alldatasheet.com/datasheet-pdf/pdf/1444708/MURATA1/ENC-03J.html",
    "Relé WiFi 1-4 canales": "https://www.alldatasheet.com/datasheet-pdf/pdf/1444708/MURATA1/ENC-03J.html",
    "Cerradura inteligente": "https://www.alldatasheet.com/datasheet-pdf/pdf/831760/CTS/CER0001A.html",
    "Sensor de movimiento WiFi": "https://www.alldatasheet.com/datasheet-pdf/pdf/831760/CTS/CER0001A.html",
    "Estación de soldadura 60-80W": "https://www.alldatasheet.com/datasheet-pdf/pdf/1085906/TAIYO-YUDEN/EST0645T100MDGA.html",
    "Cautín de precisión": "https://www.alldatasheet.com/datasheet-pdf/pdf/1085906/TAIYO-YUDEN/EST0645T100MDGA.html",
    "Estación aire caliente SMD": "https://www.alldatasheet.com/datasheet-pdf/pdf/1085906/TAIYO-YUDEN/EST0645T100MDGA.html",
    "Estaño 0.8mm": "https://www.alldatasheet.com/datasheet-pdf/pdf/1085906/TAIYO-YUDEN/EST0645T100MDGA.html",
    "Flux líquido/gel": "https://www.alldatasheet.com/datasheet-pdf/pdf/491011/SLPOWER/FLUX-50.html",
    "Antena WiFi 2.4GHz/5GHz": "https://www.alldatasheet.com/datasheet-pdf/pdf/2293536/SEMTECH/ANTENNA-2-IN-1-DOME.html",
    "Cable UTP Cat5e/6": "https://www.alldatasheet.com/datasheet-pdf/pdf/2293536/SEMTECH/ANTENNA-2-IN-1-DOME.html",
    "Conector RJ45": "https://www.alldatasheet.com/datasheet-pdf/pdf/2293536/SEMTECH/ANTENNA-2-IN-1-DOME.html",
    "Convertidor RS485-USB": "https://www.alldatasheet.com/datasheet-pdf/pdf/2293536/SEMTECH/ANTENNA-2-IN-1-DOME.html",
    "Switch de red 5 puertos": "https://www.alldatasheet.com/datasheet-pdf/pdf/2293536/SEMTECH/ANTENNA-2-IN-1-DOME.html",
    "Multímetro True RMS": "https://www.alldatasheet.com/datasheet-pdf/pdf/2327471/WAVELENGTH/MULTI-HTSK.html",
    "Pinza amperimétrica AC/DC": "https://www.alldatasheet.com/datasheet-pdf/pdf/2122111/AGELECTRONICA/PINZAEXTR8610.html",
    "Osciloscopio digital portátil 2 canales": "https://www.alldatasheet.com/datasheet-pdf/pdf/2122111/AGELECTRONICA/PINZAEXTR8610.html",
    "10µH": "https://www.alldatasheet.com/datasheet-pdf/pdf/1368729/SPARKFUN/BOB-00716.html",
    "100µH": "https://www.alldatasheet.com/datasheet-pdf/pdf/1368729/SPARKFUN/BOB-00716.html",
    "1mH": "https://www.alldatasheet.com/datasheet-pdf/pdf/1368729/SPARKFUN/BOB-00716.html",
    "10mH": "https://www.alldatasheet.com/datasheet-pdf/pdf/1368729/SPARKFUN/BOB-00716.html",
    "Kit mi primer Arduino": "https://www.alldatasheet.com/datasheet-pdf/pdf/2308939/CLARKE/KIT%201000.html",
    "Kit de sensores": "https://www.alldatasheet.com/datasheet-pdf/pdf/2308939/CLARKE/KIT%201000.html",
    "Kit de robótica básica": "https://www.alldatasheet.com/datasheet-pdf/pdf/2308939/CLARKE/KIT%201000.html",
    "Kit IoT para principiantes": "https://www.alldatasheet.com/datasheet-pdf/pdf/2308939/CLARKE/KIT%201000.html",
    "Módulo de carga TP4056": "https://www.alldatasheet.com/datasheet-pdf/pdf/727348/MERITEK/MOC.html",
    "Batería Li-ion 18650": "https://www.alldatasheet.com/datasheet-pdf/pdf/272427/GAMEWELL-FCI/BAT-12120.html",
    "Regulador MT3608 step-up": "https://www.alldatasheet.com/datasheet-pdf/pdf/85122/TI/REG101.html",
    "Kits para principiantes": "https://www.alldatasheet.com/datasheet-pdf/pdf/2308939/CLARKE/KIT%201000.html",
    "Kits de manos robóticas": "https://www.alldatasheet.com/datasheet-pdf/pdf/2308939/CLARKE/KIT%201000.html",
    "Automatización Industrial": "https://www.alldatasheet.com/datasheet-pdf/pdf/1722831/IPDPOWER/REL-110.html",
    "Compuertas lógicas": "https://www.alldatasheet.com/datasheet-pdf/pdf/2308402/SENNHEISER/CI%201-N.htm",
  };

  function normalizarNombre(texto) {
    return (texto || "")
      .trim()
      .replace(/\.$/, "")
      .toLowerCase();
  }

  const datasheetsNormalizados = {};
  Object.entries(datasheetsPorNombre).forEach(([nombre, url]) => {
    datasheetsNormalizados[normalizarNombre(nombre)] = url;
  });

  let huboCambios = false;
  productsController.items.forEach((product) => {
    const datasheetSugerido = datasheetsNormalizados[normalizarNombre(product.name)];
    if (datasheetSugerido && !product.datasheet) {
      product.datasheet = datasheetSugerido;
      huboCambios = true;
    }
  });

  if (huboCambios) {
    productsController.saveToStorage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. GESTIÓN Y RENDERIZADO DEL CATÁLOGO
  // ==========================================
  const productsController = new ProductsController();

  seedProductosIniciales(productsController);
  backfillDatasheetsExistentes(productsController);

  const urlParams = new URLSearchParams(window.location.search);
  const categoriaURL = urlParams.get("categoria");

  let categoriaBusqueda = categoriaURL;
  if (categoriaURL) {
    if (
      categoriaURL.toLowerCase() === "conectores e cables" ||
      categoriaURL.toLowerCase() === "conectores y cables"
    ) {
      categoriaBusqueda = "Conectores y cables";
    }
  }

  // Actualizar el título principal de la página
  const tituloCatalogo = document.getElementById("titulo-catalogo");
  if (tituloCatalogo) {
    tituloCatalogo.textContent = categoriaBusqueda
      ? `CATÁLOGO DE ${categoriaBusqueda.toUpperCase()}`
      : "CATÁLOGO DE PRODUCTOS";
  }

  const productosAMostrar = productsController.getProductsByCategory(categoriaBusqueda);

  const container = document.getElementById("productos-grid");

  if (container) {
    container.innerHTML = "";

    if (!productosAMostrar || productosAMostrar.length === 0) {
      const mensaje = categoriaBusqueda
        ? `No se encontraron productos en la categoría "${categoriaBusqueda}".`
        : "Aún no hay productos disponibles.";
      container.innerHTML = `
        <div class="col-12 text-center my-5 text-white">
          <h3>${mensaje}</h3>
        </div>`;
    } else {
      const cardsHTML = productosAMostrar.map((product) => {
        const precioNumero = parseFloat(product.precio || product.price || 0);
        const precioFormateado = isNaN(precioNumero) ? "0.00" : precioNumero.toFixed(2);
        const imgSrc = normalizarImagenProducto(product.img || product.image) || "../img/default.jpg";

        return `
          <div class="col-md-4 mb-4">
            <div class="card h-100 tarjeta-custom border-0 rounded-3 overflow-hidden">
              <div class="tarjeta-custom__img-container text-center p-2">
                <img src="${imgSrc}" class="img-fluid" alt="${product.name}" style="max-height: 200px; object-fit: contain;">
              </div>
              <div class="card-body card-body-custom d-flex flex-column">
                <h5 class="card-title-custom mb-2">${product.name}</h5>
                <p class="descripcion-producto mb-3">${product.description}</p>
                ${
                  product.datasheet
                    ? `<a href="${product.datasheet}" target="_blank" rel="noopener noreferrer" class="btn-datasheet">
                        <i class="bi bi-file-earmark-pdf-fill"></i> Ver Datasheet
                      </a>`
                    : ""
                }
                <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                  <span class="precio-custom">$${precioFormateado} MXN</span>
                  <button class="btn btn-carrito-custom d-flex align-items-center justify-content-center" aria-label="Agregar al carrito" data-id="${product.id}">
                    <i class="bi bi-cart-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
      }).join("");

      container.innerHTML = cardsHTML;
    }
  }
});