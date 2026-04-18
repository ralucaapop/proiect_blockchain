package com.blockchain.backend21.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "Consultatii")
public class Consultatie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 13, nullable = false)
    private String cnp;

    private LocalDateTime dataConsultatie;

    private String simptome;

    private String diagnostic;

    private String tratament;

    private String alteDetalii;
}
