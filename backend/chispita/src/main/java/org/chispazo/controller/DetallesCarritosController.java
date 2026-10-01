package org.chispazo.controller;

import org.chispazo.model.Carritos;
import org.chispazo.model.DetallesCarritos;
import org.chispazo.model.Productos;
import org.chispazo.service.DetallesCarritosService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/detalles-carritos")
@CrossOrigin(origins = "*")
public class DetallesCarritosController {

    private final DetallesCarritosService detallesCarritosService;

    public DetallesCarritosController(DetallesCarritosService detallesCarritosService) {
        this.detallesCarritosService = detallesCarritosService;
    }

    @GetMapping("/mostrar")
    public List<DetallesCarritos> mostrar() {
        return detallesCarritosService.mostrar();
    }

    @GetMapping("/carrito/{idCarrito}")
    public List<DetallesCarritos> buscarPorCarrito(@PathVariable Long idCarrito) {
        return detallesCarritosService.buscarPorCarrito(carritoConId(idCarrito));
    }

    @GetMapping("/producto/{idProducto}")
    public List<DetallesCarritos> buscarPorProducto(@PathVariable Long idProducto) {
        return detallesCarritosService.buscarPorProducto(productoConId(idProducto));
    }

    @GetMapping("/carrito/{idCarrito}/producto/{idProducto}")
    public ResponseEntity<DetallesCarritos> buscarPorCarritoYProducto(
            @PathVariable Long idCarrito,
            @PathVariable Long idProducto) {
        return detallesCarritosService
                .buscarPorCarritoYProducto(carritoConId(idCarrito), productoConId(idProducto))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/guardar")
    public ResponseEntity<DetallesCarritos> guardar(@RequestBody DetallesCarritos detalle) {
        if (detalle.getCarritos() == null || detalle.getProducto() == null || detalle.getCantidad() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(detallesCarritosService.guardar(detalle));
    }

    @PutMapping("/actualizar/{idCarrito}/{idProducto}")
    public ResponseEntity<DetallesCarritos> actualizarCantidad(
            @PathVariable Long idCarrito,
            @PathVariable Long idProducto,
            @RequestParam int cantidad) {
        if (cantidad <= 0) {
            return ResponseEntity.badRequest().build();
        }

        try {
            return ResponseEntity.ok(detallesCarritosService.actualizarCantidad(
                    carritoConId(idCarrito), productoConId(idProducto), cantidad));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/eliminar/{idCarrito}/{idProducto}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long idCarrito,
            @PathVariable Long idProducto) {
        try {
            detallesCarritosService.eliminar(carritoConId(idCarrito), productoConId(idProducto));
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.notFound().build();
        }
    }

    private Carritos carritoConId(Long idCarrito) {
        Carritos carrito = new Carritos();
        carrito.setIdCarritos(idCarrito);
        return carrito;
    }

    private Productos productoConId(Long idProducto) {
        Productos producto = new Productos();
        producto.setIdProducto(idProducto);
        return producto;
    }
}