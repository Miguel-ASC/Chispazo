package org.chispazo.controller;

import org.chispazo.model.Carritos;
import org.chispazo.service.CarritosService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/carritos")
@CrossOrigin(origins = "*")
public class CarritosController {
    private final CarritosService carritosService;

    public CarritosController(CarritosService carritosService) {
        this.carritosService = carritosService;
    }

    @PostMapping("/guardar")
    public ResponseEntity<Carritos> guardar(@RequestBody Carritos request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carritosService.guardar(request));
    }

    @GetMapping("/mostrar")
    public List<Carritos> listar() {
        return carritosService.listar();
    }
}