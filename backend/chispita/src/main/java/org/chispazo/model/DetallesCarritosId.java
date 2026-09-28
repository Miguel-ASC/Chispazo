package org.chispazo.model;

import java.io.Serializable;
import java.util.Objects;

public class DetallesCarritosId implements Serializable {
    private Long carritos;   // debe coincidir con el nombre del campo @Id en la entidad
    private Long producto;   // igual aquí

    public DetallesCarritosId() {}

    public DetallesCarritosId(Long carritos, Long producto) {
        this.carritos = carritos;
        this.producto = producto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DetallesCarritosId)) return false;
        DetallesCarritosId that = (DetallesCarritosId) o;
        return Objects.equals(carritos, that.carritos) &&
                Objects.equals(producto, that.producto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(carritos, producto);
    }
}