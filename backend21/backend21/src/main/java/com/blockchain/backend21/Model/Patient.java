package com.blockchain.backend21.Model;


import com.blockchain.backend21.enums.PatientStatus;
import com.blockchain.backend21.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@ToString
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "Pacienti")
public class Patient implements UserDetails {

    // DATE PERSONALE
    @Id
    @Column(length = 13)
    private String CNP;

    private String firstName;
    private String lastName;

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
    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    @Enumerated(EnumType.STRING)
    private PatientStatus patientStatus;

    public Patient(String email, String password) {
        this.email = email;
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(userRole.name()));
    }

    @Override
    public String getUsername() {
        return CNP;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
