package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.*;
import com.dulcevida.backend.repositorio.*;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CarritoServicio {

    @Autowired
    private ClienteRepositorio clienteRepositorio;
    @Autowired
    private PedidoRepositorio pedidoRepositorio;
    @Autowired
    private DetallePedidoRepositorio detallePedidoRepositorio;
    @Autowired
    private ProductoRepositorio productoRepositorio;
    @Autowired
    private UsuarioServicio usuarioServicio;

    private Optional<Usuario> usuarioActual(HttpSession session) {
        Object id = session.getAttribute("usuarioId");
        if (id == null)
            return Optional.empty();
        return usuarioServicio.buscarPorId((Integer) id);
    }

    private String guestEmail(HttpSession session) {
        // Genera un email único por sesión para clientes invitados
        String sid = session.getId();
        return "guest-" + sid + "@guest.local";
    }

    private Cliente clienteDeSesion(HttpSession session) {
        // Si hay usuario autenticado, usar/crear su Cliente
        Optional<Usuario> uopt = usuarioActual(session);
        if (uopt.isPresent()) {
            Usuario u = uopt.get();
            return clienteRepositorio.findByEmail(u.getEmail()).orElseGet(() -> {
                Cliente c = new Cliente();
                c.setNombre(u.getNombre());
                c.setEmail(u.getEmail());
                c.setTelefono(null);
                return clienteRepositorio.save(c);
            });
        }
        // Invitado: usar/crear un cliente basado en la sesión
        String gEmail = guestEmail(session);
        return clienteRepositorio.findByEmail(gEmail).orElseGet(() -> {
            Cliente c = new Cliente();
            c.setNombre("Invitado");
            c.setEmail(gEmail);
            c.setTelefono(null);
            return clienteRepositorio.save(c);
        });
    }

    private Pedido carritoDe(Cliente c) {
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

    public Map<String, Object> obtenerCarrito(HttpSession session) {
        Cliente cli = clienteDeSesion(session);
        Pedido pedido = carritoDe(cli);
        List<DetallePedido> detalles = detallePedidoRepositorio.findByPedido(pedido);
        BigDecimal total = detalles.stream()
                .map(d -> d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        pedido.setTotal(total);
        pedidoRepositorio.save(pedido);

        List<Map<String, Object>> items = new ArrayList<>();
        int cantidadTotal = 0;
        for (DetallePedido d : detalles) {
            Producto p = d.getProducto();
            Map<String, Object> it = new HashMap<>();
            it.put("idDetalle", d.getIdDetalle());
            it.put("cantidad", d.getCantidad());
            it.put("precioUnitario", d.getPrecioUnitario());
            // Map.of no admite valores null; usamos HashMap para permitir imagenUrl/descripcion nulos
            Map<String, Object> pMap = new HashMap<>();
            if (p != null) {
                pMap.put("idProducto", p.getIdProducto());
                pMap.put("nombre", p.getNombre());
                pMap.put("descripcion", p.getDescripcion());
                pMap.put("imagenUrl", p.getImagenUrl());
                pMap.put("precio", p.getPrecio());
                pMap.put("stock", Optional.ofNullable(p.getStock()).orElse(0));
            }
            it.put("producto", pMap);
            items.add(it);
            cantidadTotal += Optional.ofNullable(d.getCantidad()).orElse(0);
        }
        return Map.of(
                "pedidoId", pedido.getIdPedido(),
                "items", items,
                "total", total,
                "count", cantidadTotal);
    }

    public Map<String, Object> agregar(HttpSession session, Integer idProducto, Integer cantidad) {
        if (cantidad == null || cantidad <= 0)
            cantidad = 1;
        Cliente cli = clienteDeSesion(session);
        Pedido pedido = carritoDe(cli);
        Producto prod = productoRepositorio.findById(Objects.requireNonNull(idProducto)).orElseThrow();
        Integer stock = Optional.ofNullable(prod.getStock()).orElse(0);
        if ("agotado".equalsIgnoreCase(Optional.ofNullable(prod.getEstado()).orElse("")) || stock <= 0) {
            throw new IllegalArgumentException("Producto sin stock disponible");
        }
        DetallePedido det = detallePedidoRepositorio.findByPedidoAndProducto(pedido, prod)
                .orElseGet(() -> {
                    DetallePedido d = new DetallePedido();
                    d.setPedido(pedido);
                    d.setProducto(prod);
                    d.setCantidad(0);
                    d.setPrecioUnitario(prod.getPrecio());
                    return d;
                });
        int actual = Optional.ofNullable(det.getCantidad()).orElse(0);
        int nuevo = actual + cantidad;
        // Capear por stock disponible
        if (stock >= 0)
            nuevo = Math.min(nuevo, stock);
        det.setCantidad(nuevo);
        detallePedidoRepositorio.save(det);
        return obtenerCarrito(session);
    }

    public Map<String, Object> quitar(HttpSession session, Integer idDetalle) {
        detallePedidoRepositorio.deleteById(Objects.requireNonNull(idDetalle));
        return obtenerCarrito(session);
    }

    public Map<String, Object> limpiar(HttpSession session) {
        Cliente cli = clienteDeSesion(session);
        Pedido pedido = carritoDe(cli);
        List<DetallePedido> detalles = detallePedidoRepositorio.findByPedido(pedido);
        detallePedidoRepositorio.deleteAll(Objects.requireNonNull(detalles));
        return obtenerCarrito(session);
    }

    @Transactional
    public Map<String, Object> actualizarCantidad(HttpSession session, Integer idDetalle, Integer cantidad) {
        Objects.requireNonNull(idDetalle);
        if (cantidad == null || cantidad <= 0) {
            // Si la cantidad es 0 o inválida, eliminar el ítem
            detallePedidoRepositorio.deleteById(idDetalle);
            return obtenerCarrito(session);
        }
        DetallePedido det = detallePedidoRepositorio.findById(idDetalle).orElseThrow();
        // Opcional: limitar por stock disponible si existe
        Producto p = det.getProducto();
        Integer stock = p != null ? p.getStock() : null;
        int finalQty = cantidad;
        if (stock != null && stock >= 0) {
            finalQty = Math.min(finalQty, stock);
        }
        det.setCantidad(finalQty);
        detallePedidoRepositorio.save(det);
        detallePedidoRepositorio.flush();
        return obtenerCarrito(session);
    }

    @Transactional
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
        // Simulación de pago
        String paymentId = UUID.randomUUID().toString();
        String paymentMethod = "simulado";
        String status = "aprobado";
        // Actualizar stock de cada producto y estado si se agota
        for (DetallePedido d : detalles) {
            Producto prod = d.getProducto();
            if (prod != null) {
                Integer stockActual = prod.getStock() == null ? 0 : prod.getStock();
                int nuevoStock = stockActual - Optional.ofNullable(d.getCantidad()).orElse(0);
                if (nuevoStock < 0)
                    nuevoStock = 0;
                prod.setStock(nuevoStock);
                if (nuevoStock <= 0) {
                    prod.setEstado("agotado");
                }
                productoRepositorio.save(prod);
            }
        }
        // Confirmar pedido
        pedido.setEstado("confirmado");
        pedidoRepositorio.save(pedido);

        // Al consultar nuevamente el carrito se creará uno nuevo (pendiente) si se
        // necesita
        Map<String, Object> pago = new HashMap<>();
        pago.put("paymentId", paymentId);
        pago.put("status", status);
        pago.put("method", paymentMethod);
        pago.put("paidAt", new Date());

        return Map.of(
                "pedidoId", pedido.getIdPedido(),
                "estado", pedido.getEstado(),
                "total", total,
                "items", detalles.size(),
                "pago", pago);
    }
}
