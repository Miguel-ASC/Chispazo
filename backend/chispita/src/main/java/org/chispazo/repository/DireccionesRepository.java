package org.chispazo.repository;

import org.chispazo.model.Direcciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DireccionesRepository extends JpaRepository<Direcciones, Long> {
}
