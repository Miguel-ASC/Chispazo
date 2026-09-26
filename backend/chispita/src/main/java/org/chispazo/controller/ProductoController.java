package org.chispazo.controller;


import org.chispazo.exepciones.ProductosNotFoundExeption;
import org.chispazo.model.Productos;
import org.chispazo.service.ProductosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductosService productosService ;

@Autowired
    public ProductoController(ProductosService productosService) {
        this.productosService = productosService;
    }

    //mapeo de emostrat

    @GetMapping("/mostrar")
    public List<Productos> mostrar (){
    return productosService.mostrar();
    }



    //mapeo de insertar
    @PostMapping("/insertar")
    public ResponseEntity<Productos> insertar (@RequestBody Productos newProducto){
    Productos productoBynombre = productosService.busquedaProductos(newProducto.getNombre());
    if (productoBynombre != null) {
    return new ResponseEntity<>(HttpStatus.CONFLICT);
    }
    else {
    return ResponseEntity.status(HttpStatus.CREATED)
            .body(productosService.insertarProductos(newProducto));

    }
    }

//mapeo de busqueda nombre
@GetMapping("/{nombre}")
    public ResponseEntity<Productos> findByNombre  (@RequestParam  String nombre){
    Productos productosByNombre = productosService.busquedaProductos(nombre);
    if (productosByNombre == null){
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(productosByNombre);
}
    //mapeo de actualizar
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Productos> actualizarProducto (@RequestBody Productos productos, @PathVariable Long id){
        try {//204
            productosService.actualizarProductos(productos, id);
            return ResponseEntity.noContent().build();
        }catch (ProductosNotFoundExeption e){//404
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //mapear borrar
    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id){
        try {//204
            productosService.deleteProducto(id);
            return ResponseEntity.noContent().build();
        }catch (ProductosNotFoundExeption e){//404
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
