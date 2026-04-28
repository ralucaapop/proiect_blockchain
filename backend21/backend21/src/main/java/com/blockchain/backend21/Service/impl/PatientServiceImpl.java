package com.blockchain.backend21.Service.impl;

import com.blockchain.backend21.Dto.PatientDto;
import com.blockchain.backend21.Dto.PatientMedicalDto;
import com.blockchain.backend21.Dto.PatientUpdateDto;
import com.blockchain.backend21.Dto.RegisterPatientDto;
import com.blockchain.backend21.Model.Patient;
import com.blockchain.backend21.Repository.PatientRepository;
import com.blockchain.backend21.Service.PatientService;
import com.blockchain.backend21.config.JwtService;
import com.blockchain.backend21.enums.PatientStatus;
import com.blockchain.backend21.enums.UserRole;
import com.blockchain.backend21.exceptions.ResourceNotFoundException;
import com.blockchain.backend21.utils.AuthenticationResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class PatientServiceImpl implements PatientService {


    private final PatientRepository patientRepository;
    private final JwtService jwtService;

    @Autowired
    public PatientServiceImpl(PatientRepository patientRepository, JwtService jwtService) {
        this.patientRepository = patientRepository;
        this.jwtService = jwtService;
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public AuthenticationResponse registerPatient(@RequestBody RegisterPatientDto dto) throws BadRequestException {

        if (patientRepository.getPatientByCNP(dto.getCnp()).isPresent()) {
            throw new BadRequestException("CNP already exists");
        }

        Patient patient = new Patient();

        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setCNP(dto.getCnp());

        patient.setEmail(null);

        String password = BCrypt.hashpw(dto.getPassword(), BCrypt.gensalt());
        patient.setPassword(password);

        patient.setUserRole(UserRole.PACIENT);
        patient.setPatientStatus(PatientStatus.ACTIVE);

        patientRepository.save(patient);
        var jwtToken = jwtService.generateToken(patient);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    @Override
    public void updatePatient(String cnp, @RequestBody PatientUpdateDto dto) {

        Patient patient = patientRepository.getPatientByCNP(cnp)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with CNP: " + cnp));

        // DATE PERSONALE
        if (dto.getFirstName() != null)
            patient.setFirstName(dto.getFirstName());

        if (dto.getLastName() != null)
            patient.setLastName(dto.getLastName());

        if (dto.getEmail() != null)
            patient.setEmail(dto.getEmail());

        if (dto.getPhone() != null)
            patient.setPhone(dto.getPhone());

        if (dto.getAddress() != null)
            patient.setAddress(dto.getAddress());

        if (dto.getDateOfBirth() != null)
            patient.setDateOfBirth(dto.getDateOfBirth());

        // DATE MEDICALE
        if (dto.getBloodGroupRh() != null)
            patient.setBloodGroupRh(dto.getBloodGroupRh());

        if (dto.getHeight() != null)
            patient.setHeight(dto.getHeight());

        if (dto.getWeight() != null)
            patient.setWeight(dto.getWeight());

        if (dto.getCurrentMedication() != null)
            patient.setCurrentMedication(dto.getCurrentMedication());

        if (dto.getAllergies() != null)
            patient.setAllergies(dto.getAllergies());

        if (dto.getChronicDiseases() != null)
            patient.setChronicDiseases(dto.getChronicDiseases());

        if (dto.getVaccines() != null)
            patient.setVaccines(dto.getVaccines());

        if (dto.getFamilyHistory() != null)
            patient.setFamilyHistory(dto.getFamilyHistory());

        // STATUS (optional update)
        if (dto.getPatientStatus() != null) {
            patient.setPatientStatus(PatientStatus.valueOf(dto.getPatientStatus()));
        }

        patientRepository.save(patient);
    }

    @Override
    public void updateMedicalInfo(String cnp, PatientMedicalDto dto) {
        Patient patient = patientRepository.getPatientByCNP(cnp)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with CNP: " + cnp));

        if (dto.getBloodGroupRh() != null)
            patient.setBloodGroupRh(dto.getBloodGroupRh());

        if (dto.getCurrentMedication() != null)
            patient.setCurrentMedication(dto.getCurrentMedication());

        if (dto.getAllergies() != null)
            patient.setAllergies(dto.getAllergies());

        if (dto.getChronicDiseases() != null)
            patient.setChronicDiseases(dto.getChronicDiseases());

        if (dto.getVaccines() != null)
            patient.setVaccines(dto.getVaccines());

        if (dto.getFamilyHistory() != null)
            patient.setFamilyHistory(dto.getFamilyHistory());

        patientRepository.save(patient);
    }

    @Override
    public Patient getPatient(String cnp){
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(cnp);
        Patient patient = new Patient();
        if(optionalPatient.isPresent()){
            patient = optionalPatient.get();
        }
        return patient;
    }

    @Override
    public void changePatientStatus(String cnp, String newStatus) throws BadRequestException {

        Patient patient = patientRepository.getPatientByCNP(cnp)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with CNP: " + cnp));

        try {
            PatientStatus status = PatientStatus.valueOf(newStatus.toUpperCase());
            patient.setPatientStatus(status);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid patient status");
        }
        patientRepository.save(patient);
    }

}
