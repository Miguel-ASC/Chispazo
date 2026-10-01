package org.chispazo.controller;

import org.chispazo.exepciones.UsuarioNotFoundException;

import org.chispazo.model.Usuarios;
import org.chispazo.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuariosController {

    private final UsuariosService usuariosService;

    @Autowired
    public UsuariosController(UsuariosService usuariosService) {
        this.usuariosService = usuariosService;
    }

    // Lista de usuarios
    @GetMapping("/mostrar-usuarios")
    public List<Usuarios> mostrar() {
        return usuariosService.mostrarUsuario();
    }

    // Mapear usuarios creados/crear usuarios
    @PostMapping("/nuevo-usuario")
    public ResponseEntity<Usuarios> crearUsuario(@RequestBody Usuarios nuevoUsuario) {
        if (nuevoUsuario.getRol() == null) {
            nuevoUsuario.setRol(Usuarios.Rol.user);
        }
        Usuarios usuariosEmail = usuariosService.buscarEmail(nuevoUsuario.getEmail());

        if (usuariosEmail != null) {
            return new ResponseEntity<>((HttpStatus.CONFLICT));
        } else {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(usuariosService.crearUsuario(nuevoUsuario));
        }
    }

    // Mapear el id
    @GetMapping("usuario/{id}")
    public ResponseEntity<Usuarios> buscarUsuario(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuariosService.buscarUsuario(id));
        } catch (UsuarioNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Mapear actualizar usuario
    @PutMapping("/actualizar-usuario/{id}")
    public ResponseEntity<Usuarios> actualizarUsuario(@RequestBody Usuarios usuarios, @PathVariable Long id) {
        try {
            usuariosService.actualizarUsuario(usuarios, id);
            return ResponseEntity.noContent().build();
        } catch (UsuarioNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Validar las credenciales recibidas por el formulario de perfil.
    @PostMapping("/login")
    public ResponseEntity<Usuarios> login(@RequestBody Map<String, String> credenciales) {
        try {
            Usuarios usuario = usuariosService.validar(
                    credenciales.get("email"),
                    credenciales.get("password"));
            return ResponseEntity.ok(usuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
