package com.dulcevida.backend.dto;

import com.dulcevida.backend.modelo.Usuario;

public final class UsuarioMapper {
    private UsuarioMapper() {}

    public static UsuarioDTO toDTO(Usuario u) {
        if (u == null) return null;
        return new UsuarioDTO(
                u.getIdUsuario(),
                u.getNombre(),
                u.getEmail(),
                u.getRol(),
                u.getEstado(),
                u.getRut(),
                u.getDv(),
                u.getRegion(),
                u.getComuna()
        );
    }
}
