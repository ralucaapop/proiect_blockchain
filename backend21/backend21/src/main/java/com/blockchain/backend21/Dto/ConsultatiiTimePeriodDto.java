package com.blockchain.backend21.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ConsultatiiTimePeriodDto {
    public LocalDateTime startTime;
    public LocalDateTime endTime;
}
