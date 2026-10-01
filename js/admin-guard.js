(function () {
  let sesion;

  try {
    sesion = JSON.parse(localStorage.getItem("chispazo_session") || "null");
  } catch (error) {
    sesion = null;
  }

  const rol = String(sesion?.rol || "").toLowerCase();
  if (!sesion || rol !== "admin") {
    window.location.replace("../index.html");
  }
})();
