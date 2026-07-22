package com.booking.config;

import com.booking.security.JwtAuthenticationFilter;
import com.booking.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/providers/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                // Public: view a specific provider's availability schedule
                .requestMatchers(HttpMethod.GET, "/api/provider/availability/*").permitAll()
                // Public: view available time slots for a provider on a date
                .requestMatchers(HttpMethod.GET, "/api/slots/**").permitAll()
                // Provider-only: manage availability and generate slots
                .requestMatchers(HttpMethod.PUT, "/api/provider/availability").hasRole("PROVIDER")
                .requestMatchers(HttpMethod.POST, "/api/provider/slots/generate").hasRole("PROVIDER")
                // Provider-only: view and manage their bookings
                .requestMatchers(HttpMethod.GET, "/api/provider/bookings").hasRole("PROVIDER")
                .requestMatchers(HttpMethod.PATCH, "/api/provider/bookings/*/complete").hasRole("PROVIDER")
                .requestMatchers(HttpMethod.DELETE, "/api/provider/bookings/*").hasRole("PROVIDER")
                // Client-only: create a booking
                .requestMatchers(HttpMethod.POST, "/api/bookings").hasRole("CLIENT")
                // Authenticated: view and cancel own bookings
                .requestMatchers(HttpMethod.GET, "/api/bookings/my").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/bookings/*").authenticated()
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
