package org.chispazo.repository;

import org.chispazo.model.DetallesPedidos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallesPedidosRepository extends JpaRepository<DetallesPedidos, Long> {
}
