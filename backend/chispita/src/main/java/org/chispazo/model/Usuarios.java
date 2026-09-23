package org.chispazo.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "id_usuario")
    private Long idUsuario ;

    @Column(name = "nombre", nullable = false, length = 67)
    private String  nombre ;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos ;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private  String email ;

    @Column(name = "password", nullable = false, length = 30)
    private  String password ;

    @Column(name = "telefono",unique = true , nullable = false, length = 10)
    private String telefono ;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol;

    public enum Rol {
        admin, user
    }

    @OneToMany(mappedBy = "usuarios", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Carritos> carritos = new ArrayList<>();

    @OneToMany(mappedBy = "usuarios", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Direcciones> direcciones = new ArrayList<>();

    @OneToMany(mappedBy = "usuarios", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedidos> pedidos= new ArrayList<>();

    public Usuarios() {
    }

    public Usuarios(Long idUsuario, String nombre, String email, String apellidos, String password, String telefono, Rol rol) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.email = email;
        this.apellidos = apellidos;
        this.password = password;
        this.telefono = telefono;
        this.rol = rol;



    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public List<Carritos> getCarritos() {
        return carritos;
    }

    public void setCarritos(List<Carritos> carritos) {
        this.carritos = carritos;
    }

    public List<Direcciones> getDirecciones() {
        return direcciones;
    }

    public void setDirecciones(List<Direcciones> direcciones) {
        this.direcciones = direcciones;
    }

    public List<Pedidos> getPedidos() {
        return pedidos;
    }

    public void setPedidos(List<Pedidos> pedidos) {
        this.pedidos = pedidos;
    }

    @Override
    public String toString() {
        return "Usuarios{" +
                "idUsuario=" + idUsuario +
                ", nombre='" + nombre + '\'' +
                ", apellidos='" + apellidos + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", telefono='" + telefono + '\'' +
                ", rol=" + rol +
                '}';
    }
}




