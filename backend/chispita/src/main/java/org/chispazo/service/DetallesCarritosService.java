package org.chispazo.service;

import org.chispazo.model.Carritos;
import org.chispazo.model.DetallesCarritos;
import org.chispazo.model.Productos;
import org.chispazo.repository.DetallesCarritosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetallesCarritosService {

    private final DetallesCarritosRepository detallesCarritosRepository;

    @Autowired
    public DetallesCarritosService(DetallesCarritosRepository detallesCarritosRepository) {
        this.detallesCarritosRepository = detallesCarritosRepository;
    }

    public List<DetallesCarritos> mostrar() {
        return detallesCarritosRepository.findAll();
    }

    public List<DetallesCarritos> buscarPorCarrito(Carritos carrito) {
        return detallesCarritosRepository.findByCarritos(carrito);
    }

    public List<DetallesCarritos> buscarPorProducto(Productos producto) {
        return detallesCarritosRepository.findByProducto(producto);
    }

    public Optional<DetallesCarritos> buscarPorCarritoYProducto(Carritos carrito, Productos producto) {
        return detallesCarritosRepository.findByCarritosAndProducto(carrito, producto);
    }

    public DetallesCarritos guardar(DetallesCarritos detalle) {
        return detallesCarritosRepository.save(detalle);
    }

    public DetallesCarritos actualizarCantidad(Carritos carrito, Productos producto, int cantidad) {
        DetallesCarritos detalle = detallesCarritosRepository.findByCarritosAndProducto(carrito, producto)
                .orElseThrow(() -> new IllegalArgumentException("El producto no existe en el carrito"));

        detalle.setCantidad(cantidad);
        return detallesCarritosRepository.save(detalle);
    }

    public void eliminar(Carritos carrito, Productos producto) {
        DetallesCarritos detalle = detallesCarritosRepository.findByCarritosAndProducto(carrito, producto)
                .orElseThrow(() -> new IllegalArgumentException("El producto no existe en el carrito"));

        detallesCarritosRepository.delete(detalle);
    }
}