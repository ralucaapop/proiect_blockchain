package com.blockchain.backend21.config;


import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers("/api/auth/login").permitAll()

                        .requestMatchers("/api/auth/register").hasAuthority("DOCTOR")
                        .requestMatchers("/api/consult/add/**").hasAuthority("DOCTOR")
                        .requestMatchers("/api/consult/date/**").hasAuthority("DOCTOR")
                        .requestMatchers("/api/consult/date/**").hasAuthority("DOCTOR")
                        .requestMatchers("/api/consult/patient_date/**").permitAll()
                        .requestMatchers("/api/consult/patient/**").permitAll()
                        .requestMatchers("/api/patients/**").hasAuthority("DOCTOR")
                        .requestMatchers("/api/patients/**").hasAuthority("DOCTOR")
                        .requestMatchers("/api/patient/**").permitAll()
                        .requestMatchers("/api/patient_medical_info/**").hasAuthority("DOCTOR")
                        .requestMatchers("/api/patient_status/**").hasAuthority("DOCTOR")
                        .anyRequest().authenticated()
                )
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
