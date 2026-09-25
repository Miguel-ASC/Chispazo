package org.chispazo.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "detalles_pedidos")
public class DetallesPedidos {

    @Id
    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedidos pedidos;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Productos producto;  // ← se llama "productos"

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private Float precioUnitario;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private Float subtotal;

    public DetallesPedidos() {
    }

    // Getter & Setter

    public Float getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Float subtotal) {
        this.subtotal = subtotal;
    }

    public Float getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Float precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Productos getProductos() {
        return producto;
    }

    public void setProductos(Productos productos) {
        this.producto = productos;
    }

    public Pedidos getPedidos() {
        return pedidos;
    }

    public void setPedidos(Pedidos pedidos) {
        this.pedidos = pedidos;
    }
}

