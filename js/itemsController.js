/**
 * ProductsController
 * -------------------
 * Clase encargada de administrar la lista de productos de la tienda
 * (equivalente al "ItemsController" de la guía del reto, mtc)
 *
 * Persiste los productos en localStorage (no hay base de datos todavía),
 * para que sobrevivan a un refresh de página o al cerrar el navegador.
 *
 * Cada producto tiene un campo "activo" (true/false). Eliminar un producto
 * desde el panel administrativo NO lo borra del arreglo: solo pone
 * activo = false (baja lógica), para poder recuperarlo después.
 */
class ProductsController {
  // Clave usada para guardar los datos en localStorage
  static STORAGE_KEY = "products";

  /**
   * @param {number} currentId - id inicial desde el que se empieza a contar
   *                             (solo se usa si NO hay nada guardado en localStorage)
   */
  constructor(currentId = 0) {
    const storedData = this.loadFromStorage();

    if (storedData) {
      // Si ya había productos guardados, los recuperamos
      this.items = storedData.items;
      this.currentId = storedData.currentId;
    } else {
      // Si es la primera vez, arrancamos vacío
      this.items = [];
      this.currentId = currentId;
    }
  }

  /**
   * Agrega un nuevo producto al arreglo this.items y lo guarda en localStorage
   * @param {string} name
   * @param {string} description
   * @param {string} precio
   * @param {string} img - URL o ruta de la imagen (ubicadas en ./img/)
   * @param {string} createdAt
   * @param {string} categoria - usada por el segmentador/filtros
   * @param {boolean} activo - true por defecto; false = producto "eliminado"
   * @returns {object} el producto recién creado
   */
  addProduct(name, description, precio, img, createdAt, categoria, activo = true) {
    this.currentId++;

    // Si no trae ruta completa ni es URL externa, nos aseguramos de anteponer 'img/'
    let imagePath = img;
    if (imagePath && !imagePath.startsWith("http") && !imagePath.startsWith("img/") && !imagePath.startsWith("./img/")) {
      imagePath = `img/${imagePath}`;
    }

    const newProduct = {
      id: this.currentId,
      name: name,
      description: description,
      precio: precio,
      img: imagePath,
      createdAt: createdAt,
      categoria: categoria,
      activo: activo,
    };

    this.items.push(newProduct);
    this.saveToStorage();

    return newProduct;
  }

  /**
   * Busca un producto por id
   * @param {number} id
   * @returns {object|undefined}
   */
  getProductById(id) {
    return this.items.find((product) => product.id === Number(id));
  }

  /**
   * Actualiza los campos de un producto existente (edición desde el panel admin)
   * @param {number} id
   * @param {object} updatedFields - campos a sobrescribir, ej. { name, description, precio, img, categoria }
   * @returns {object|null} el producto actualizado, o null si no existe
   */
  updateProduct(id, updatedFields) {
    const product = this.getProductById(id);

    if (!product) {
      return null;
    }

    // Normalizar la ruta de la imagen en caso de actualizarla
    if (updatedFields.img && !updatedFields.img.startsWith("http") && !updatedFields.img.startsWith("img/") && !updatedFields.img.startsWith("./img/")) {
      updatedFields.img = `img/${updatedFields.img}`;
    }

    Object.assign(product, updatedFields);
    this.saveToStorage();

    return product;
  }

  /**
   * Baja lógica: pone activo = false. El producto sigue en this.items,
   * pero deja de mostrarse en el catálogo público.
   * @param {number} id
   */
  deactivateProduct(id) {
    return this.updateProduct(id, { activo: false });
  }

  /**
   * Reactiva un producto previamente eliminado (activo = true)
   * @param {number} id
   */
  activateProduct(id) {
    return this.updateProduct(id, { activo: true });
  }

  /**
   * Elimina un producto DEFINITIVAMENTE del arreglo (borrado físico).
   * @param {number} id
   */
  removeProduct(id) {
    this.items = this.items.filter((product) => product.id !== Number(id));
    this.saveToStorage();
  }

  /**
   * @returns {object[]} solo los productos con activo === true
   */
  getActiveProducts() {
    return this.items.filter((product) => product.activo);
  }

  /**
   * Obtiene los productos activos filtrados por categoría (ignorando mayúsculas/minúsculas)
   * @param {string} categoryName
   * @returns {object[]}
   */
  getProductsByCategory(categoryName) {
    if (!categoryName) return this.getActiveProducts();

    return this.getActiveProducts().filter((product) => {
      if (!product.categoria) return false;
      return product.categoria.trim().toLowerCase() === categoryName.trim().toLowerCase();
    });
  }

  /**
   * Guarda this.items y this.currentId en localStorage
   */
  saveToStorage() {
    const dataToStore = {
      items: this.items,
      currentId: this.currentId,
    };
    localStorage.setItem(ProductsController.STORAGE_KEY, JSON.stringify(dataToStore));
  }

  /**
   * Lee los datos guardados en localStorage (si existen)
   * @returns {object|null}
   */
  loadFromStorage() {
    const raw = localStorage.getItem(ProductsController.STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /**
   * Borra todos los productos guardados (útil para pruebas)
   */
  clearStorage() {
    localStorage.removeItem(ProductsController.STORAGE_KEY);
    this.items = [];
    this.currentId = 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productos-grid");
  const titulo = document.getElementById("titulo-catalogo");

  // Obtener parámetro de categoría desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get("categoria");

  function renderProducts() {
    let items = itemsController.getItems().filter((item) => item.active);

    if (selectedCategory) {
      titulo.textContent = `CATÁLOGO: ${selectedCategory.toUpperCase()}`;
      items = items.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    } else {
      titulo.textContent = "CATÁLOGO DE PRODUCTOS";
    }

    grid.innerHTML = "";

    if (items.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center text-muted"><p>No se encontraron productos disponibles en esta categoría.</p></div>`;
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "col-6 col-md-4 col-lg-3";
      card.innerHTML = `
        <div class="card h-100 bg-dark text-white border-secondary">
          <img src="${item.img}" class="card-img-top p-3" alt="${item.name}" style="height: 180px; object-fit: contain;">
          <div class="card-body d-flex flex-column">
            <span class="badge bg-success mb-2 align-self-start">${item.category}</span>
            <h5 class="card-title text-truncate">${item.name}</h5>
            <p class="card-text text-secondary small flex-grow-1">${item.description}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="fw-bold fs-5">$${Number(item.price).toFixed(2)}</span>
              <button class="btn btn-sm btn-outline-light"><i class="bi bi-cart-plus"></i></button>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  renderProducts();
});