package org.chispazo.exepciones;

public class UsuarioNotFoundException extends RuntimeException {
    public UsuarioNotFoundException(Long id) {
        super("Not found user with id: " + id);
    }
}
