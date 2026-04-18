package com.blockchain.backend21.Dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ConsultatieDto {

    private String cnp;
    private String simptome;
    private String diagnostic;
    private String tratament;
    private String alteDetalii;
}
