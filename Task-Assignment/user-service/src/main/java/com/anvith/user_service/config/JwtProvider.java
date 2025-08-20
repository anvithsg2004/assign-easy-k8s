package com.anvith.user_service.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtProvider {

    public String generateToken(Authentication authentication) {
        String email = authentication.getName();
        String authorities = populateAuthorities(authentication.getAuthorities());
        SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .claim("email", email)
                .claim("authorities", authorities)
                .signWith(key, SignatureAlgorithm.HS384)
                .compact();
    }

    public String getEmailFromJwtToken(String jwt) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();
            return String.valueOf(claims.get("email"));
        } catch (Exception e) {
            System.err.println("Error parsing JWT: " + e.getMessage()); // Debug log
            throw new IllegalArgumentException("Invalid JWT token", e);
        }
    }

    private String populateAuthorities(java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {
        return String.join(",", authorities.stream().map(Object::toString).toList());
    }
}
