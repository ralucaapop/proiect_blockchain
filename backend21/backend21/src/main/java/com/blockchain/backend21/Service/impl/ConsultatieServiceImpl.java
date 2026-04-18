package com.blockchain.backend21.Service.impl;

import com.blockchain.backend21.Dto.ConsultatieDto;
import com.blockchain.backend21.Dto.ConsultatieUpdateDto;
import com.blockchain.backend21.Model.Consultatie;
import com.blockchain.backend21.Repository.ConsultatieRepository;
import com.blockchain.backend21.Repository.PatientRepository;
import com.blockchain.backend21.Service.ConsultatieService;
import com.blockchain.backend21.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsultatieServiceImpl implements ConsultatieService {

        private final ConsultatieRepository consultatieRepository;
        private final PatientRepository patientRepository;

        @Autowired
        public ConsultatieServiceImpl(ConsultatieRepository consultatieRepository, PatientRepository patientRepository) {
            this.consultatieRepository = consultatieRepository;
            this.patientRepository = patientRepository;
        }

        @Override
        public Consultatie addConsultatie(ConsultatieDto dto) {

            patientRepository.getPatientByCNP(dto.getCnp())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

            Consultatie consultatie = Consultatie.builder()
                    .cnp(dto.getCnp())
                    .dataConsultatie(LocalDateTime.now())
                    .simptome(dto.getSimptome())
                    .diagnostic(dto.getDiagnostic())
                    .tratament(dto.getTratament())
                    .alteDetalii(dto.getAlteDetalii())
                    .build();

            return consultatieRepository.save(consultatie);
        }

        @Override
        public List<Consultatie> getConsultatiiByCnp(String cnp) {
            return consultatieRepository.findByCnp(cnp);
        }


        @Override
        public void updateConsultatie( ConsultatieUpdateDto dto) {

            Consultatie consultatie = consultatieRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Consultatie not found with id: " + dto.getId()));

            if (dto.getSimptome() != null)
                consultatie.setSimptome(dto.getSimptome());

            if (dto.getDiagnostic() != null)
                consultatie.setDiagnostic(dto.getDiagnostic());

            if (dto.getTratament() != null)
                consultatie.setTratament(dto.getTratament());

            if (dto.getAlteDetalii() != null)
                consultatie.setAlteDetalii(dto.getAlteDetalii());

            consultatieRepository.save(consultatie);
        }


        @Override
            public List<Consultatie> getConsultatiiByPeriod(LocalDateTime start, LocalDateTime end) {
                return consultatieRepository.findByDataConsultatieBetween(start, end);
            }

            @Override
            public List<Consultatie> getConsultatiiByCnpAndPeriod(String cnp, LocalDateTime start, LocalDateTime end) {
                return consultatieRepository.findByCnpAndDataConsultatieBetween(cnp, start, end);
            }
}
