package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.*;
import com.dulcevida.backend.repositorio.*;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @Autowired
    private BoletaRepositorio boletaRepositorio;
    @Autowired
    private DetalleBoletaRepositorio detalleBoletaRepositorio;

    private Optional<Usuario> usuarioActual(HttpSession session) {
        // Primero intentar obtener desde el contexto de seguridad JWT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getName() != null) {
            return usuarioServicio.buscarPorEmail(auth.getName());
        }
        // Fallback a sesión (establecida en login para compatibilidad)
        Object id = session.getAttribute("usuarioId");
        if (id != null) {
            return usuarioServicio.buscarPorId((Integer) id);
        }
        return Optional.empty();
    }

    private String guestEmail(HttpSession session) {
        
        String sid = session.getId();
        return "guest-" + sid + "@guest.local";
    }

    private Cliente clienteDeSesion(HttpSession session) {
        
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
            
            detallePedidoRepositorio.deleteById(idDetalle);
            return obtenerCarrito(session);
        }
        DetallePedido det = detallePedidoRepositorio.findById(idDetalle).orElseThrow();
        
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
        
        BigDecimal total = detalles.stream()
                .map(d -> d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        pedido.setTotal(total);
        
        String paymentId = UUID.randomUUID().toString();
        String paymentMethod = "simulado";
        String status = "aprobado";
        
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
        
        pedido.setEstado("confirmado");
        pedidoRepositorio.save(pedido);

        // Generar boleta correlativa
        BigDecimal subtotal = total;
        BigDecimal iva = subtotal.multiply(new BigDecimal("0.19"));
        BigDecimal totalConIva = subtotal.add(iva);
        Long numero = 1L;
        Boleta ultima = boletaRepositorio.findFirstByOrderByNumeroDesc();
        if (ultima != null && ultima.getNumero() != null) {
            numero = ultima.getNumero() + 1;
        }
        Boleta boleta = new Boleta();
        boleta.setNumero(numero);
        boleta.setPedido(pedido);
        boleta.setSubtotal(subtotal);
        boleta.setIva(iva);
        boleta.setTotal(totalConIva);
        boletaRepositorio.save(boleta);

        for (DetallePedido d : detalles) {
            DetalleBoleta db = new DetalleBoleta();
            db.setBoleta(boleta);
            db.setProducto(d.getProducto());
            db.setCantidad(d.getCantidad());
            db.setPrecioUnitario(d.getPrecioUnitario());
            BigDecimal linea = d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad()));
            db.setTotalLinea(linea);
            detalleBoletaRepositorio.save(db);
        }

        
        
        Map<String, Object> pago = new HashMap<>();
        pago.put("paymentId", paymentId);
        pago.put("status", status);
        pago.put("method", paymentMethod);
        pago.put("paidAt", new Date());

        return Map.of(
            "pedidoId", pedido.getIdPedido(),
            "estado", pedido.getEstado(),
            "subtotal", subtotal,
            "iva", iva,
            "total", totalConIva,
            "boletaNumero", boleta.getNumero(),
            "items", detalles.size(),
            "pago", pago);
    }
}
