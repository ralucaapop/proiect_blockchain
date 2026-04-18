package com.blockchain.backend21.Service.impl;

import com.blockchain.backend21.Dto.LoginDto;
import com.blockchain.backend21.Model.Patient;
import com.blockchain.backend21.Repository.PatientRepository;
import com.blockchain.backend21.Service.AuthService;
import com.blockchain.backend21.exceptions.ResourceNotFoundException;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final PatientRepository patientRepository;

    @Autowired
    public AuthServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }


    @Override
    public Patient login(@RequestBody LoginDto loginDto) throws BadRequestException {
        if (loginDto.getCnp() == null || loginDto.getCnp().isBlank()) {
            throw new BadRequestException("The cnp is not valid");
        }
        System.out.println("da");
        if (loginDto.getPassword() == null || loginDto.getPassword().isBlank()) {
            throw new BadRequestException("The cnp is not valid");
        }
        Optional<Patient> patientOptional = patientRepository.getPatientByCNP(loginDto.getCnp());
        patientOptional.orElseThrow(() ->
                new ResourceNotFoundException("The cnp is not registered"));

        boolean isMatch = BCrypt.checkpw(loginDto.getPassword(), patientOptional.get().getPassword());
        if (!isMatch) {
            throw new BadRequestException("Wrong password");
        }
        System.out.println("pa");
        return patientOptional.get();
    }

}
