package org.chispazo.service;

import org.chispazo.model.Carritos;
import org.chispazo.model.DetallesCarritos;
import org.chispazo.model.Productos;
import org.chispazo.model.Usuarios;
import org.chispazo.repository.CarritosRepository;
import org.chispazo.repository.ProductosRepository;
import org.chispazo.repository.UsuariosRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class CarritosService {
    private final CarritosRepository carritosRepository;
    private final ProductosRepository productosRepository;
    private final UsuariosRepository usuariosRepository;

    public CarritosService(
            CarritosRepository carritosRepository,
            ProductosRepository productosRepository,
            UsuariosRepository usuariosRepository) {
        this.carritosRepository = carritosRepository;
        this.productosRepository = productosRepository;
        this.usuariosRepository = usuariosRepository;
    }

    @Transactional
    public Carritos guardar(Carritos carrito) {
        if (carrito == null || carrito.getDetalleCarritos() == null || carrito.getDetalleCarritos().isEmpty()) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,
                    "El pedido debe incluir productos");
        }

        Usuarios usuario = carrito.getUsuario();
        if (usuario != null && usuario.getIdUsuario() != null) {
            usuario = usuariosRepository.findById(usuario.getIdUsuario())
                    .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND,
                            "Usuario no encontrado"));
        }

        carrito.setFecha(LocalDateTime.now());
        carrito.setUsuario(usuario);

        Map<Long, Integer> cantidadesPorProducto = new LinkedHashMap<>();
        Map<Long, Productos> productosPorId = new LinkedHashMap<>();

        for (DetallesCarritos detalle : carrito.getDetalleCarritos()) {
            if (detalle == null || detalle.getProducto() == null
                    || detalle.getProducto().getIdProducto() == null || detalle.getCantidad() <= 0) {
                throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,
                        "Producto o cantidad inválidos");
            }

            Productos producto = productosRepository.findById(detalle.getProducto().getIdProducto())
                    .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND,
                            "Producto no encontrado"));
            long productoId = producto.getIdProducto();
            cantidadesPorProducto.merge(productoId, detalle.getCantidad(), Integer::sum);
            productosPorId.put(productoId, producto);
            detalle.setCarritos(carrito);
            detalle.setProducto(producto);
        }

        List<String> productosSinStock = new ArrayList<>();
        for (Map.Entry<Long, Integer> entrada : cantidadesPorProducto.entrySet()) {
            Productos producto = productosPorId.get(entrada.getKey());
            int stockActual = producto.getStock() == null ? 0 : producto.getStock();
            if (stockActual < entrada.getValue()) {
                productosSinStock.add(producto.getNombre());
                continue;
            }
            producto.setStock(stockActual - entrada.getValue());
        }

        if (!productosSinStock.isEmpty()) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT,
                    "No disponemos de: " + String.join(", ", productosSinStock) + ".");
        }

        return carritosRepository.save(carrito);
    }

    @Transactional(readOnly = true)
    public List<Carritos> listar() {
        return carritosRepository.findAll();
    }
}