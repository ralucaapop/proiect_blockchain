package com.blockchain.backend21.Dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RegisterPatientDto {
    private String firstName;
    private String lastName;
    private String cnp;
    private String password;
}
