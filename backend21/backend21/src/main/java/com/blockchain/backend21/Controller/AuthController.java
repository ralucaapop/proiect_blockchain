package com.blockchain.backend21.Controller;


import com.blockchain.backend21.Dto.LoginDto;
import com.blockchain.backend21.Model.Patient;
import com.blockchain.backend21.Service.AuthService;
import com.blockchain.backend21.config.JwtService;
import com.blockchain.backend21.utils.AuthenticationResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping(path ="/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(AuthService authService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody LoginDto loginDto) throws BadRequestException {
        Patient patient = authService.login(loginDto);
        String token = jwtService.generateToken(patient);
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getCnp(),
                        loginDto.getPassword()
                )
        );
        return AuthenticationResponse.builder()
                .token(token)
                .build();
        //return ResponseEntity.ok( .success("Welcome " + patient.getFirstName(), patient));
    }


}
