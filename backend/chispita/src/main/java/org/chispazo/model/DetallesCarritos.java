package org.chispazo.model;


import jakarta.persistence.*;

@Entity
@Table(name = "detalles_carritos")
public class DetallesCarritos {

    @Id
    @ManyToOne
    @JoinColumn(name = "id_carriro", nullable = false)
    private Carritos carritos;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Productos producto;  // ← debe ser "producto", no "productos"

    @Column (name = "cantidad", nullable = false)
    private  int cantidad;

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
