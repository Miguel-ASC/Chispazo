/**
 * ProductsController
 * -------------------
 * Clase encargada de administrar la lista de productos de la tienda
 * (equivalente al "ItemsController" de la guía del reto, mtc)
 *
 * Ahora persiste los productos en localStorage, para que sobrevivan
 * a un refresh de página o al cerrar el navegador.
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
   * @returns {object} el producto recién creado
   */
  addProduct(name, description, precio, img, createdAt, categoria) {
    this.currentId++;

    const newProduct = {
      id: this.currentId,
      name: name,
      description: description,
      precio: precio,
      img: img,
      createdAt: createdAt,
      categoria: categoria,
    };

    this.items.push(newProduct);
    this.saveToStorage();

    return newProduct;
  }

  /**
   * Elimina un producto por id y actualiza localStorage
   * @param {number} id
   */
  removeProduct(id) {
    this.items = this.items.filter((product) => product.id !== id);
    this.saveToStorage();
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