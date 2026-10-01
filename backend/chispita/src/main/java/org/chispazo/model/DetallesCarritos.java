package org.chispazo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "detalles_carritos")
@IdClass(DetallesCarritosId.class)
public class DetallesCarritos {

    @Id
    @ManyToOne
    @JoinColumn(name = "id_carriro", nullable = false)
    @JsonIgnore
    private Carritos carritos;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    @JsonIgnoreProperties({ "detalleCarritos", "categoria" })
    private Productos producto; // ← debe ser "producto", no "productos"

    @Column(name = "cantidad", nullable = false)
    private int cantidad;

    public DetallesCarritos() {
    }

    public DetallesCarritos(int cantidad) {
        this.cantidad = cantidad;
    }

    public Carritos getCarritos() {
        return carritos;
    }

    public void setCarritos(Carritos carritos) {
        this.carritos = carritos;
    }

    public Productos getProducto() {
        return producto;
    }

    public void setProducto(Productos producto) {
        this.producto = producto;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    @Override
    public String toString() {
        return "DetallesCarritos{" +
                "cantidad=" + cantidad +
                '}';
    }
}
