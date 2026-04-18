package com.blockchain.backend21.Controller;

import com.blockchain.backend21.Dto.RegisterPatientDto;
import com.blockchain.backend21.Service.PatientService;
import com.blockchain.backend21.utils.ApiResponse;
import com.blockchain.backend21.utils.AuthenticationResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping(path ="/api/auth")
public class PatientController {

    private final PatientService patientService;

    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/register")
    public AuthenticationResponse register(@RequestBody RegisterPatientDto registerDto) throws BadRequestException {
        return patientService.registerPatient(registerDto);
    }

}
