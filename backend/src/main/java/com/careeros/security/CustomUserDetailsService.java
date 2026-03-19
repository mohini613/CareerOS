package com.careeros.security;

import com.careeros.model.User;
import com.careeros.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new CustomUserDetails(user);
    }

    public static class CustomUserDetails implements UserDetails {
        private final Long userId;
        private final String email;
        private final String password;
        private final boolean active;

        public CustomUserDetails(User user) {
            this.userId = user.getId();
            this.email = user.getEmail();
            this.password = user.getPasswordHash();  // matches your User model
            this.active = user.isActive();
        }

        public Long getUserId() { return userId; }

        @Override public String getUsername() { return email; }
        @Override public String getPassword() { return password; }
        @Override public Collection<? extends GrantedAuthority> getAuthorities() { return new ArrayList<>(); }
        @Override public boolean isAccountNonExpired() { return true; }
        @Override public boolean isAccountNonLocked() { return true; }
        @Override public boolean isCredentialsNonExpired() { return true; }
        @Override public boolean isEnabled() { return active; }
    }
}