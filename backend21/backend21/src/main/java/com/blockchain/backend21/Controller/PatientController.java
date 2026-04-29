package com.blockchain.backend21.Controller;

import com.blockchain.backend21.Dto.PatientMedicalDto;
import com.blockchain.backend21.Dto.PatientStatusDto;
import com.blockchain.backend21.Dto.PatientUpdateDto;
import com.blockchain.backend21.Dto.RegisterPatientDto;
import com.blockchain.backend21.Model.Patient;
import com.blockchain.backend21.Service.PatientService;
import com.blockchain.backend21.utils.ApiResponse;
import com.blockchain.backend21.utils.AuthenticationResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping(path ="/api")
public class PatientController {

    private final PatientService patientService;

    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/auth/register")
    @PreAuthorize("hasAnyAuthority('DOCTOR')")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterPatientDto registerDto) throws BadRequestException {
        patientService.registerPatient(registerDto);
        return ResponseEntity.ok(ApiResponse.success("Patient registered successfully", null));
    }

    @GetMapping("/patients")
    @PreAuthorize("hasAnyAuthority('DOCTOR')")
    public ResponseEntity<ApiResponse>getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(ApiResponse.success("Patients list", patients));
    }

    @GetMapping("/patient/{patientCnp}")
    public ResponseEntity<ApiResponse> getPatient(@PathVariable String patientCnp){
        Patient patient = patientService.getPatient(patientCnp);
        return ResponseEntity.ok(ApiResponse.success("Patient info", patient));
    }

    @PutMapping("/patient")
    public ResponseEntity<ApiResponse> updatePatient(@RequestBody PatientUpdateDto patientUpdateDto){
        patientService.updatePatient(patientUpdateDto.getCnp(), patientUpdateDto);
        return ResponseEntity.ok(ApiResponse.success("Edit done", null));
    }

    @PutMapping("/patient_medical_info")
    @PreAuthorize("hasAnyAuthority('DOCTOR')")
    public ResponseEntity<ApiResponse> updatePatientMedicalInformation( @RequestBody PatientMedicalDto patientUpdateDto){
        patientService.updateMedicalInfo(patientUpdateDto.getCnpPatient(), patientUpdateDto);
        return ResponseEntity.ok(ApiResponse.success("Medical info changed successfully", null));
    }

    @PutMapping("/patient_status")
    @PreAuthorize("hasAnyAuthority('DOCTOR')")
    public ResponseEntity<ApiResponse> changePatientStatus(@RequestBody PatientStatusDto patientStatusDto) throws BadRequestException {
        patientService.changePatientStatus(patientStatusDto.cnpPatient, patientStatusDto.newStatus);
        return ResponseEntity.ok(ApiResponse.success("Patient status changed successfully", null));
    }

}
