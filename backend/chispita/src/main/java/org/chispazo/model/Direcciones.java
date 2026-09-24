package org.chispazo.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "direcciones")
public class Direcciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Long idDireccion;

    @Column(name = "estado", length = 100, nullable = false)
    private String estado;

    @Column(name = "colonia", length = 100, nullable = false)
    private String colonia;

    @Column(name = "calle", length = 150, nullable = false)
    private String calle;

    @Column(name = "numero", length = 20, nullable = false)
    private String numero;

    @Column(name = "cp", length = 10, nullable = false)
    private String cp;

    // Relación con usuarios (muchas direcciones pueden pertenecer a un usuario)
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuarios usuarios;

    // Relación con pedidos (una dirección puede tener varios pedidos asociados)
    @OneToMany(mappedBy = "direccion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedidos> pedidos = new ArrayList<>();

    public Direcciones() {
    }

    public Direcciones(Long idDireccion, String estado, String colonia, String calle, String numero, String cp) {
        this.idDireccion = idDireccion;
        this.estado = estado;
        this.colonia = colonia;
        this.calle = calle;
        this.numero = numero;
        this.cp = cp;
    }

    public Long getIdDireccion() {
        return idDireccion;
    }

    public void setIdDireccion(Long idDireccion) {
        this.idDireccion = idDireccion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getColonia() {
        return colonia;
    }

    public void setColonia(String colonia) {
        this.colonia = colonia;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getCp() {
        return cp;
    }

    public void setCp(String cp) {
        this.cp = cp;
    }

    public Usuarios getUsuario() {
        return usuarios;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuarios = usuario;
    }

    public List<Pedidos> getPedidos() {
        return pedidos;
    }

    public void setPedidos(List<Pedidos> pedidos) {
        this.pedidos = pedidos;
    }

    @Override
    public String toString() {
        return "Direcciones{" +
                "idDireccion=" + idDireccion +
                ", estado='" + estado + '\'' +
                ", colonia='" + colonia + '\'' +
                ", calle='" + calle + '\'' +
                ", numero='" + numero + '\'' +
                ", cp='" + cp + '\'' +
                ", usuario=" + usuarios +
                '}';
    }
}
