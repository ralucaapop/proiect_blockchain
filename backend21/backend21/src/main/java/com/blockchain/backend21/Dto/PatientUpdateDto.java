package com.blockchain.backend21.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PatientUpdateDto {

    private String cnp;
    private String firstName;
    private String lastName;

    private String email;
    private String phone;
    private String address;

    private String dateOfBirth;

    private Double height;
    private Double weight;

    private String currentMedication;
    private String allergies;
    private String chronicDiseases;
    private String vaccines;
    private String familyHistory;
    private String patientStatus;
    private String bloodGroupRh;

}
