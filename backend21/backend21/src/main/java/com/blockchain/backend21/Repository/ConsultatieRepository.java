package com.blockchain.backend21.Repository;

import com.blockchain.backend21.Model.Consultatie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsultatieRepository extends JpaRepository<Consultatie, Integer> {

    List<Consultatie> findByCnp(String cnp);

    List<Consultatie> findByDataConsultatieBetween(LocalDateTime start, LocalDateTime end);

    List<Consultatie> findByCnpAndDataConsultatieBetween(String cnp, LocalDateTime start, LocalDateTime end);
}
