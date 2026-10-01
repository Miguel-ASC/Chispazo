package org.chispazo.repository;

import org.chispazo.model.DetallesCarritos;
import org.chispazo.model.DetallesCarritosId;
import org.chispazo.model.Carritos;
import org.chispazo.model.Productos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetallesCarritosRepository extends JpaRepository<DetallesCarritos, DetallesCarritosId> {

	List<DetallesCarritos> findByCarritos(Carritos carritos);

	List<DetallesCarritos> findByProducto(Productos producto);

	Optional<DetallesCarritos> findByCarritosAndProducto(Carritos carritos, Productos producto);
}