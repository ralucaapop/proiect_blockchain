package com.blockchain.backend21.Dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ConsultatieUpdateDto {
    private Integer id;
    private String simptome;
    private String diagnostic;
    private String tratament;
    private String alteDetalii;
}
