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
   * @param {string} img
   * @param {string} createdAt
   * @param {string} categoria - usada más adelante por el segmentador/filtros,
   *                             no se muestra en la card
   * @param {boolean} activo - true por defecto; false = producto "eliminado"
   * @returns {object} el producto recién creado
   */
  addProduct(name, description, precio, img, createdAt, categoria, activo = true) {
    this.currentId++;

    const newProduct = {
      id: this.currentId,
      name: name,
      description: description,
      precio: precio,
      img: img,
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
   * El panel admin usa deactivateProduct(); este método queda disponible
   * por si en algún momento necesitas un borrado real.
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
