package com.dulcevida.backend.dto;

public class UsuarioDTO {
    private Integer idUsuario;
    private String nombre;
    private String email;
    private String rol;
    private String estado;
    private String rut;
    private String dv;
    private String region;
    private String comuna;

    public UsuarioDTO() {}

    public UsuarioDTO(Integer idUsuario, String nombre, String email, String rol, String estado,
                       String rut, String dv, String region, String comuna) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.estado = estado;
        this.rut = rut;
        this.dv = dv;
        this.region = region;
        this.comuna = comuna;
    }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getRut() { return rut; }
    public void setRut(String rut) { this.rut = rut; }
    public String getDv() { return dv; }
    public void setDv(String dv) { this.dv = dv; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
}
