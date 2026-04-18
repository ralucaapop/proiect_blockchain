package com.blockchain.backend21.Repository;

import com.blockchain.backend21.Model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> getPatientByEmail(String email);
    Optional<Patient> getPatientByCNP(String CNP);
}
