package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.*;
import com.dulcevida.backend.repositorio.*;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CarritoServicio {

    @Autowired private ClienteRepositorio clienteRepositorio;
    @Autowired private PedidoRepositorio pedidoRepositorio;
    @Autowired private DetallePedidoRepositorio detallePedidoRepositorio;
    @Autowired private ProductoRepositorio productoRepositorio;
    @Autowired private UsuarioServicio usuarioServicio;

    private Optional<Usuario> usuarioActual(HttpSession session){
        Object id = session.getAttribute("usuarioId");
        if (id == null) return Optional.empty();
        return usuarioServicio.buscarPorId((Integer) id);
    }

    private Cliente clienteDeSesion(HttpSession session){
        return usuarioActual(session).map(u ->
            clienteRepositorio.findByEmail(u.getEmail()).orElseGet(() -> {
                Cliente c = new Cliente();
                c.setNombre(u.getNombre());
                c.setEmail(u.getEmail());
                c.setTelefono(null);
                return clienteRepositorio.save(c);
            })
        ).orElseThrow(() -> new IllegalStateException("No autenticado"));
    }

    private Pedido carritoDe(Cliente c){
        return pedidoRepositorio.findFirstByClienteAndEstado(c, "pendiente")
                .orElseGet(() -> {
                    Pedido p = new Pedido();
                    p.setCliente(c);
                    p.setEstado("pendiente");
                    p.setDireccionEntrega("");
                    p.setTotal(BigDecimal.ZERO);
                    return pedidoRepositorio.save(p);
                });
    }

    public Map<String,Object> obtenerCarrito(HttpSession session){
        Cliente cli = clienteDeSesion(session);
        Pedido pedido = carritoDe(cli);
        List<DetallePedido> detalles = detallePedidoRepositorio.findByPedido(pedido);
        BigDecimal total = detalles.stream()
                .map(d -> d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        pedido.setTotal(total);
        pedidoRepositorio.save(pedido);

        List<Map<String,Object>> items = new ArrayList<>();
        for (DetallePedido d : detalles){
            Producto p = d.getProducto();
            Map<String,Object> it = new HashMap<>();
            it.put("idDetalle", d.getIdDetalle());
            it.put("cantidad", d.getCantidad());
            it.put("precioUnitario", d.getPrecioUnitario());
            it.put("producto", Map.of(
                    "idProducto", p.getIdProducto(),
                    "nombre", p.getNombre(),
                    "descripcion", p.getDescripcion(),
                    "imagenUrl", p.getImagenUrl(),
                    "precio", p.getPrecio()
            ));
            items.add(it);
        }
        return Map.of("pedidoId", pedido.getIdPedido(), "items", items, "total", total);
    }

    public Map<String,Object> agregar(HttpSession session, Integer idProducto, Integer cantidad){
        if (cantidad == null || cantidad <= 0) cantidad = 1;
        Cliente cli = clienteDeSesion(session);
        Pedido pedido = carritoDe(cli);
        Producto prod = productoRepositorio.findById(idProducto).orElseThrow();
        DetallePedido det = detallePedidoRepositorio.findByPedidoAndProducto(pedido, prod)
                .orElseGet(() -> {
                    DetallePedido d = new DetallePedido();
                    d.setPedido(pedido);
                    d.setProducto(prod);
                    d.setCantidad(0);
                    d.setPrecioUnitario(prod.getPrecio());
                    return d;
                });
        det.setCantidad(det.getCantidad() + cantidad);
        detallePedidoRepositorio.save(det);
        return obtenerCarrito(session);
    }

    public Map<String,Object> quitar(HttpSession session, Integer idDetalle){
        detallePedidoRepositorio.deleteById(idDetalle);
        return obtenerCarrito(session);
    }

    public Map<String,Object> limpiar(HttpSession session){
        Cliente cli = clienteDeSesion(session);
        Pedido pedido = carritoDe(cli);
        List<DetallePedido> detalles = detallePedidoRepositorio.findByPedido(pedido);
        detallePedidoRepositorio.deleteAll(detalles);
        return obtenerCarrito(session);
    }

    public Map<String, Object> finalizar(HttpSession session) {
        Cliente cli = clienteDeSesion(session);
        Pedido pedido = carritoDe(cli);
        List<DetallePedido> detalles = detallePedidoRepositorio.findByPedido(pedido);
        if (detalles.isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacío");
        }
        // Recalcular total por seguridad
        BigDecimal total = detalles.stream()
                .map(d -> d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        pedido.setTotal(total);
        pedido.setEstado("en_preparacion");
        pedidoRepositorio.save(pedido);

        // Al consultar nuevamente el carrito se creará uno nuevo (pendiente) si se necesita
        return Map.of(
                "pedidoId", pedido.getIdPedido(),
                "estado", pedido.getEstado(),
                "total", total,
                "items", detalles.size()
        );
    }
}
