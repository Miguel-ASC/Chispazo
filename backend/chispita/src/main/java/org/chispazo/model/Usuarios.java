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
    









}


