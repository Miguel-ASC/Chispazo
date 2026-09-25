package org.chispazo.repository;

import org.chispazo.model.DetallesCarritos;
import org.chispazo.model.DetallesCarritosId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallesCarritosRepository extends JpaRepository<DetallesCarritos, DetallesCarritosId> {

}