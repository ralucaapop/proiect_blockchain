package com.blockchain.backend21.Dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PatientMedicalDto {
    private String currentMedication;
    private String allergies;
    private String chronicDiseases;
    private String vaccines;
    private String familyHistory;
    private String patientStatus;
    private String bloodGroupRh;
}
