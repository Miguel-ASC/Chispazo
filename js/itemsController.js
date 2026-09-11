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
 *
 * El campo "img" puede ser una ruta (img/producto.jpg) o un Data URL en
 * base64 generado al subir un archivo desde el panel admin.
 */
class ProductsController {
  static STORAGE_KEY = "products";

  constructor(currentId = 0) {
    const storedData = this.loadFromStorage();

    if (storedData) {
      this.items = storedData.items;
      this.currentId = storedData.currentId;
    } else {
      this.items = [];
      this.currentId = currentId;
    }
  }

  /**
   * Agrega un nuevo producto al arreglo this.items y lo guarda en localStorage
   * Se agrega el parámetro datasheet antes de activo.
   */
  addProduct(name, description, precio, img, createdAt, categoria, datasheet = "", activo = true) {
    this.currentId++;

    const newProduct = {
      id: this.currentId,
      name: name,
      description: description,
      precio: precio,
      img: img,
      createdAt: createdAt,
      categoria: categoria,
      datasheet: datasheet, // <-- Guardamos la URL del datasheet
      activo: activo,
    };

    this.items.push(newProduct);
    this.saveToStorage();

    return newProduct;
  }

  getProductById(id) {
    return this.items.find((product) => product.id === Number(id));
  }

  updateProduct(id, updatedFields) {
    const product = this.getProductById(id);
    if (!product) return null;

    Object.assign(product, updatedFields);
    this.saveToStorage();

    return product;
  }

  deactivateProduct(id) {
    return this.updateProduct(id, { activo: false });
  }

  activateProduct(id) {
    return this.updateProduct(id, { activo: true });
  }

  removeProduct(id) {
    this.items = this.items.filter((product) => product.id !== Number(id));
    this.saveToStorage();
  }

  getActiveProducts() {
    return this.items.filter((product) => product.activo);
  }

  saveToStorage() {
    const dataToStore = {
      items: this.items,
      currentId: this.currentId,
    };

    try {
      localStorage.setItem(ProductsController.STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      // Si localStorage se llena (por ejemplo, muchas imágenes en base64),
      // lo capturamos aquí para no romper la app; ver aviso en admin.js
      console.error("No se pudo guardar en localStorage:", error);
      throw error;
    }
  }

  loadFromStorage() {
    const raw = localStorage.getItem(ProductsController.STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  clearStorage() {
    localStorage.removeItem(ProductsController.STORAGE_KEY);
    this.items = [];
    this.currentId = 0;
  }

  /**
   * Normaliza un texto removiendo acentos y convirtiéndolo a minúsculas
   * para comparaciones insensibles a mayúsculas, minúsculas y tildes.
   * @param {string} text
   * @returns {string}
   */
  normalizeText(text) {
    if (!text) return "";
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  /**
   * Retorna los productos activos filtrados por categoría.
   * Si no se pasa categoría, retorna todos los productos activos.
   * @param {string|null} category
   * @returns {object[]}
   */
  getProductsByCategory(category = null) {
    const activeProducts = this.getActiveProducts();

    if (!category) {
      return activeProducts;
    }

    const cleanCategory = this.normalizeText(category);

    return activeProducts.filter(
      (product) => this.normalizeText(product.categoria) === cleanCategory
    );
  }

  /**
   * Carga tarjetas/productos iniciales en localStorage si la tienda está completamente vacía.
   * @param {object[]} initialProducts - Arreglo con los objetos de prueba iniciales
   */
  seedInitialData(initialProducts = []) {
    if (this.items.length === 0 && initialProducts.length > 0) {
      initialProducts.forEach((item) => {
        this.addProduct(
          item.name,
          item.description,
          item.precio,
          item.img,
          item.createdAt || new Date().toISOString(),
          item.categoria,
          item.datasheet || "", // <-- Pasa el datasheet inicial si existe
          item.activo !== undefined ? item.activo : true
        );
      });
    }
  }
}