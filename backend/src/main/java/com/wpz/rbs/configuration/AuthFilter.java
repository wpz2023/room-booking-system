package com.wpz.rbs.configuration;

import com.wpz.rbs.model.ApiUser;
import com.wpz.rbs.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Component
public class AuthFilter extends OncePerRequestFilter {
    @Autowired
    UserRepository userRepository;

    @Autowired
    ConfigurationHelpers configurationHelpers;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws IOException {
        try {
            String token = request.getHeader("Authorization");
            if (token.startsWith("Bearer")) token = token.substring(7);
            Claims claims = Jwts.parserBuilder().setSigningKey(Decoders.BASE64.decode(configurationHelpers.getJwtKey())).build().parseClaimsJws(token).getBody();
            UUID userId = UUID.fromString((String) claims.get("userId"));
            Optional<ApiUser> user = userRepository.findById(userId);
            if (user.isEmpty() || user.get().getExpDate().compareTo(new Date()) <= 0) throw new ServletException();
            request.setAttribute("user", user.get());

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.sendError(401, "W celu wykonania akcji należy się zalogować");
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return Arrays.stream(new String[]{"/auth/", "/swagger-ui", "/api-docs"}).anyMatch(request.getRequestURI()::contains);
    }
}
