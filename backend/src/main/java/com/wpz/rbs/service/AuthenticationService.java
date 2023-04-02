package com.wpz.rbs.service;

import com.wpz.rbs.model.Token;
import com.wpz.rbs.model.User;
import com.wpz.rbs.model.auth.AuthenticationRequest;
import com.wpz.rbs.model.auth.AuthenticationResponse;
import com.wpz.rbs.repository.TokenRepository;
import com.wpz.rbs.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository repository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;

    public AuthenticationService(UserRepository repository, JwtService jwtService, AuthenticationManager authenticationManager, TokenRepository tokenRepository) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.tokenRepository = tokenRepository;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(user);
        saveToken(jwtToken);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    private void saveToken(String jwtToken) {
        var token = Token.builder()
                .token(jwtToken)
                .build();
        tokenRepository.deleteAll();
        tokenRepository.save(token);
    }
}