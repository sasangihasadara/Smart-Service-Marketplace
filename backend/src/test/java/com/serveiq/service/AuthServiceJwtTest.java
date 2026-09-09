package com.serveiq.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import com.serveiq.dto.LoginRequest;
import com.serveiq.entity.AccountStatus;
import com.serveiq.entity.AppUser;
import com.serveiq.entity.UserRole;
import com.serveiq.repository.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

class AuthServiceJwtTest {

    @Test
    void loginShouldReturnAJwtTokenForSuccessfulAuthentication() {
        AppUserRepository repository = mock(AppUserRepository.class);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        AppUser user = new AppUser();
        user.setId(1L);
        user.setFirstName("Nimali");
        user.setLastName("Ratnayake");
        user.setEmail("nimali@serveiq.com");
        user.setPhoneNumber("0767890123");
        user.setRole(UserRole.CUSTOMER);
        user.setServiceCategory("Customer");
        user.setStatus(AccountStatus.ACTIVE);
        user.setPasswordHash(passwordEncoder.encode("1234"));

        when(repository.findByEmailIgnoreCase("nimali@serveiq.com")).thenReturn(Optional.of(user));

        AuthService authService = new AuthService(repository, passwordEncoder, "client-id");

        Map<String, Object> response = authService.login(new LoginRequest("nimali@serveiq.com", "1234", "customer"));

        assertThat(response)
                .containsKey("token")
                .extractingByKey("token")
                .isInstanceOf(String.class)
                .isNotBlank();
    }
}
