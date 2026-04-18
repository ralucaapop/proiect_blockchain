package com.blockchain.backend21.Service;


import com.blockchain.backend21.Dto.LoginDto;
import com.blockchain.backend21.Model.Patient;
import org.apache.coyote.BadRequestException;

public interface AuthService {
    Patient login(LoginDto loginDto) throws BadRequestException;
}
