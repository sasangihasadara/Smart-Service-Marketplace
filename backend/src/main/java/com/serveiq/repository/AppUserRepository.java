package com.serveiq.repository;

import java.util.List;
import java.util.Optional;

import com.serveiq.entity.AppUser;
import com.serveiq.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    long countByRole(UserRole role);
    long countByRoleAndStatus(UserRole role, com.serveiq.entity.AccountStatus status);
    List<AppUser> findTop5ByOrderByCreatedAtDesc();
    List<AppUser> findTop5ByRoleOrderByCreatedAtDesc(UserRole role);
    List<AppUser> findByRoleOrderByCreatedAtDesc(UserRole role);
}
