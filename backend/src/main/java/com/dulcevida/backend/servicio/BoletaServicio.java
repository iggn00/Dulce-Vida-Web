package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.Boleta;
import com.dulcevida.backend.modelo.Pedido;
import com.dulcevida.backend.modelo.DetalleBoleta;
import com.dulcevida.backend.modelo.Producto;
import com.dulcevida.backend.repositorio.BoletaRepositorio;
import com.dulcevida.backend.repositorio.DetalleBoletaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class BoletaServicio {
    @Autowired
    private BoletaRepositorio boletaRepositorio;
    @Autowired
    private DetalleBoletaRepositorio detalleBoletaRepositorio;

    public Boleta generarBoleta(Pedido pedido, List<DetalleBoleta> detalles) {
        BigDecimal subtotal = detalles.stream()
            .map(DetalleBoleta::getTotalLinea)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal iva = subtotal.multiply(BigDecimal.valueOf(0.19));
        BigDecimal total = subtotal.add(iva);

        Boleta boleta = new Boleta();
        boleta.setPedido(pedido);
        boleta.setSubtotal(subtotal);
        boleta.setIva(iva);
        boleta.setTotal(total);
        boleta = boletaRepositorio.save(boleta);

        for (DetalleBoleta detalle : detalles) {
            detalle.setBoleta(boleta);
            detalleBoletaRepositorio.save(detalle);
        }
        return boleta;
    }

    public List<Boleta> obtenerTodasBoletas() {
        return boletaRepositorio.findAll();
    }
}
