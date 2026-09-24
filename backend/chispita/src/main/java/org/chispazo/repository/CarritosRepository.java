package org.chispazo.repository;

import org.chispazo.model.Carritos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarritosRepository extends JpaRepository<Carritos, Long> {

}
