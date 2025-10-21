export default function NosotrosPage() {
  return (
    <div className="mt-1">
      <section className="py-4">
        <div className="p-4 bg-light border rounded position-relative overflow-hidden">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <h1 className="display-5 fw-bold mb-3">Sobre Dulce Vida</h1>
              <p className="mb-4">
                Horneamos con amor para endulzar tus momentos más especiales. En Dulce Vida creemos en ingredientes nobles, procesos artesanales y detalles que marcan la diferencia.
              </p>
              <a href="/productos" className="btn btn-dorado btn-lg">Ver catálogo</a>
            </div>
            <div className="col-12 col-lg-6">
              <div className="bg-light border overflow-hidden rounded">
                <img src="/img/banner/bannerdulcevida.png" className="img-fluid w-100 hero-img" alt="Dulce Vida" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-6">
            <img src="/img/prod/foto4.jpg" className="img-fluid rounded shadow-sm" alt="Nuestra historia" />
          </div>
          <div className="col-12 col-md-6">
            <h2 className="h3 fw-bold mb-3">Nuestra historia</h2>
            <p>Nacimos como un pequeño taller familiar, donde cada receta se transmite de generación en generación. Hoy llevamos esa misma dedicación a un catálogo variado de tortas, pies y postres.</p>
            <p>Creemos en lo hecho a mano, el respeto por los tiempos de la repostería y la satisfacción de ofrecer sabores honestos.</p>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="row g-4">
          <div className="col-12">
            <h2 className="h3 fw-bold mb-4">Nuestros valores</h2>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-4 border rounded h-100">
              <h3 className="h5">Calidad</h3>
              <p className="mb-0">Ingredientes seleccionados y procesos cuidados para un resultado superior.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-4 border rounded h-100">
              <h3 className="h5">Cercanía</h3>
              <p className="mb-0">Atención personalizada y compromiso con cada pedido.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-4 border rounded h-100">
              <h3 className="h5">Creatividad</h3>
              <p className="mb-0">Diseños únicos y sabores que sorprenden sin perder lo clásico.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 text-center">
        <div className="p-4 border rounded bg-light">
          <h2 className="h4 mb-3">¿Listo para darte un gusto?</h2>
          <p className="mb-4">Explora nuestro catálogo y encuentra tu nuevo favorito.</p>
          <a href="/productos" className="btn btn-dorado btn-lg">Explorar productos</a>
        </div>
      </section>
    </div>
  )
}
