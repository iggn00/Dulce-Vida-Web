package com.dulcevida.backend.modelo;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Refresh_Token")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_refresh")
    private Long idRefresh;

    @Column(name = "token", unique = true, nullable = false, length = 200)
    private String token;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "expira_en", nullable = false)
    private Instant expiraEn;

    @Column(name = "revocado", nullable = false)
    private boolean revocado = false;
}
