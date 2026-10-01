package org.chispazo.controller;

import org.chispazo.model.Categorias;
import org.chispazo.service.CategoriasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/categorias")
public class CategoriasController {

    private final CategoriasService categoriasService;

    @Autowired
    public CategoriasController(CategoriasService categoriasService) {
        this.categoriasService = categoriasService;
    }

    @GetMapping("/mostrar")
    public List<Categorias> mostrar() {
        return categoriasService.mostrar();
    }

    @PostMapping("/insertar")
    public Categorias insertar(@RequestBody Categorias categoria) {
        return categoriasService.insertar(categoria);
    }

    @DeleteMapping("/borrar/{id}")
    public void borrar(@PathVariable Long id) {
        categoriasService.borrar(id);
    }
}