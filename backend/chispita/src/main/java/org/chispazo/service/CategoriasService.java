package org.chispazo.service;

import org.chispazo.model.Categorias;
import org.chispazo.repository.CategoriasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriasService {
    private final CategoriasRepository categoriasRepository;

    @Autowired
    public CategoriasService(CategoriasRepository categoriasRepository) {
        this.categoriasRepository = categoriasRepository;
    }

    public List<Categorias> mostrar() {
        return categoriasRepository.findAll();
    }

    public Categorias insertar(Categorias categoria) {
        return categoriasRepository.save(categoria);
    }

    public void borrar(Long id) {
        categoriasRepository.deleteById(id);
    }
}