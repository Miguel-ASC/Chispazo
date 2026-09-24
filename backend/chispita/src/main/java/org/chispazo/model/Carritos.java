package org.chispazo.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carritos")
public class Carritos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carrito")
    private Long idCarritos;

    @Column(name = "fecha_creacion", nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime fecha;

    @ManyToOne
    @JoinColumn(name = "carritos_id_user")
    private Usuarios usuarios;


    @OneToMany(mappedBy = "carritos", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallesCarritos> detallesCarritos = new ArrayList<>();

    public Carritos() {
    }

    public Carritos(Long idCarritos, LocalDateTime fecha) {
        this.idCarritos = idCarritos;
        this.fecha = fecha;
    }

    public Long getIdCarritos() {
        return idCarritos;
    }

    public void setIdCarritos(Long idCarritos) {
        this.idCarritos = idCarritos;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Usuarios getUsuario() {
        return usuarios;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuarios = usuario;
    }

    public List<DetallesCarritos> getDetalleCarritos() {
        return detallesCarritos;
    }

    public void setDetalleCarritos(List<DetallesCarritos> detallesCarritos) {
        this.detallesCarritos = detallesCarritos;
    }

    @Override
    public String toString() {
        return "Carritos{" +
                "idCarritos=" + idCarritos +
                ", fecha=" + fecha +
                ", usuario=" + usuarios +
                ", detalleCarritos=" + detallesCarritos +
                '}';
    }

}


