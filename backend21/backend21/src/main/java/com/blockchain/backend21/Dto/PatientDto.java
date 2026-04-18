package com.blockchain.backend21.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PatientDto {

    // DATE PERSONALE
    private String firstName;
    private String lastName;
    private String cnp;
    private String email;
    private String phone;
    private String address;
    private String dateOfBirth;

    // SECURITY
    private String password;

    // DATE MEDICALE
    private String bloodGroupRh;
    private Double height;
    private Double weight;

    private String currentMedication;
    private String allergies;
    private String chronicDiseases;
    private String vaccines;
    private String familyHistory;

    // ROLE + STATUS
    private String userRole;
    private String patientStatus;
}
