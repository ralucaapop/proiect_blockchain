package com.blockchain.backend21.Service;

import com.blockchain.backend21.Dto.ConsultatieDto;
import com.blockchain.backend21.Dto.ConsultatieUpdateDto;
import com.blockchain.backend21.Model.Consultatie;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface ConsultatieService {
    public Consultatie addConsultatie(ConsultatieDto dto);
    public List<Consultatie> getConsultatiiByCnp(String cnp);
    public void updateConsultatie( ConsultatieUpdateDto dto);
    public List<Consultatie> getConsultatiiByPeriod(LocalDateTime start, LocalDateTime end);
    public List<Consultatie> getConsultatiiByCnpAndPeriod(String cnp, LocalDateTime start, LocalDateTime end);
}
