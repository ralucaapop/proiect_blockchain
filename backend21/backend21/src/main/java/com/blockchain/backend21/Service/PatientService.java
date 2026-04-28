package com.blockchain.backend21.Service;

import com.blockchain.backend21.Dto.PatientDto;
import com.blockchain.backend21.Dto.PatientMedicalDto;
import com.blockchain.backend21.Dto.PatientUpdateDto;
import com.blockchain.backend21.Dto.RegisterPatientDto;
import com.blockchain.backend21.Model.Patient;
import com.blockchain.backend21.utils.AuthenticationResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface PatientService {

    List<Patient> getAllPatients();
    AuthenticationResponse registerPatient(@RequestBody RegisterPatientDto patientDto) throws BadRequestException;
    void updatePatient(String cnp, @RequestBody PatientUpdateDto patientUpdateDto);
    void updateMedicalInfo(String cnp, @RequestBody PatientMedicalDto patientMedicalDto);
    Patient getPatient(String cnp);
    void changePatientStatus(String cnp, String newStatus) throws BadRequestException;
}
