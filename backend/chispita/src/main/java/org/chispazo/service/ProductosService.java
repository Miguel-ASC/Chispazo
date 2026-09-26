package org.chispazo.service;

import org.chispazo.model.Productos;
import org.chispazo.repository.ProductosRepository;
import org.chispazo.exepciones.ProductosNotFoundExeption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductosService {
    private final ProductosRepository productosRepository;

    @Autowired
    public ProductosService(ProductosRepository productosRepository) {
        this.productosRepository = productosRepository;
    }

    // metodo para visualizar todos los productos
    public List<Productos> mostrar() {
        return productosRepository.findAll();

    }

    // metodo insertar producto
    public Productos insertarProductos(Productos newProductos) {
        return productosRepository.save(newProductos);
    }

    // buscar por nombre
    public Productos busquedaProductos(String nombre) {
        return productosRepository.findByNombre(nombre);
    }

    // actualizar
    public Productos actualizarProductos(Productos productos, Long id) {
        return productosRepository.findById(id)
                .map(data -> {
                    data.setNombre(productos.getNombre());
                    data.setDescripcion(productos.getDescripcion());
                    data.setPrecio(productos.getPrecio());
                    data.setStock(productos.getStock());
                    data.setImagenUrl(productos.getImagenUrl());
                    data.setCategoria(productos.getCategoria());
                    return productosRepository.save(data);
                })
                .orElseThrow(() -> new ProductosNotFoundExeption(id));
    }

    // eliminar
    public void deleteProducto(Long id) {
        if (productosRepository.existsById(id)) {
            productosRepository.deleteById(id);
        } else {
            throw new ProductosNotFoundExeption(id);
        }
    }

}
