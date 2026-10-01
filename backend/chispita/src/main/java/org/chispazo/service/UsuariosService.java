package org.chispazo.service;

import org.chispazo.exepciones.UsuarioNotFoundException;

import org.chispazo.model.Usuarios;
import org.chispazo.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuariosService {
    private final UsuariosRepository usuarioRepository;

    @Autowired
    public UsuariosService(UsuariosRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Mostrar usuario para pruebas
    public List<Usuarios> mostrarUsuario() {
        return usuarioRepository.findAll();

    }

    // Crear usuario
    public Usuarios crearUsuario(Usuarios nuevoUsuario) {
        return usuarioRepository.save(nuevoUsuario);
    }

    // Buscar por email
    public Usuarios buscarEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    // Buscar por id
    public Usuarios buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException(id));
    }

    // Actualizar usuario

    public Usuarios actualizarUsuario(Usuarios usuarios, Long id) {
        return usuarioRepository.findById(id)
                .map(data -> {
                    data.setNombre(usuarios.getNombre());
                    data.setApellidos(usuarios.getApellidos());
                    data.setEmail(usuarios.getEmail());
                    data.setPassword(usuarios.getPassword());
                    data.setTelefono(usuarios.getTelefono());
                    return usuarioRepository.save(data);
                })
                .orElseThrow(() -> new UsuarioNotFoundException(id));
    }

    // Validar
    public Usuarios validar(String email, String password) {
        Usuarios u = usuarioRepository.findByEmail(email);

        if (u == null || !u.getPassword().equals(password)) {
            throw new IllegalArgumentException("Email o password incorrectos");
        }
        return u;
    }

}
