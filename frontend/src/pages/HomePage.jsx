import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div>
      <section id="hero" className="py-4">
        <div className="p-4 bg-light border rounded">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <h1 className="display-5 fw-bold mb-3">TIENDA ONLINE</h1>
              <p className="mb-4">
                Nuestros guías de campo te ofrecen tips para identificar aves en todas las regiones.
                Descárgalos y conoce más de nuestra colección.
              </p>
              <Link to="/productos" className="btn btn-light border border-2 border-dark btn-lg">
                <span aria-hidden="true">🛒</span>
                <span className="ms-2">ver productos</span>
              </Link>
            </div>
            <div className="col-12 col-lg-6">
              <div className="bg-light border overflow-hidden rounded">
                <picture>
                  <source srcSet="/img/banner/Bannerinv.png" media="(max-width: 576px)" />
                  <img src="/img/banner/bannerdulcevida.png" className="img-fluid w-100 hero-img" alt="Banner Dulce Vida" />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="carrusel" className="py-4">
        <div id="carruselPasteles" className="carousel slide rounded overflow-hidden border" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carruselPasteles" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carruselPasteles" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carruselPasteles" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <Link to="/productos" className="d-block">
                <img src="/img/prod/tortadech.png" className="d-block w-100" alt="Torta de chocolate" style={{maxHeight: 460, objectFit: 'cover'}} />
              </Link>
              <div className="carousel-caption d-none d-md-block">
                <div className="bg-dark bg-opacity-50 rounded px-3 py-2">
                  <h2 className="h3 mb-2">Explora nuestras opciones deliciosas</h2>
                  <p className="mb-2">Pasteles, tartas y postres artesanales para cada ocasión.</p>
                  <Link to="/productos" className="btn btn-dorado btn-sm">Ver catálogo</Link>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <Link to="/productos" className="d-block">
                <img src="/img/prod/piedelimon.png" className="d-block w-100" alt="Pie de limón" style={{maxHeight: 460, objectFit: 'cover'}} />
              </Link>
              <div className="carousel-caption d-none d-md-block">
                <div className="bg-dark bg-opacity-50 rounded px-3 py-2">
                  <h2 className="h3 mb-2">Sabor que enamora</h2>
                  <p className="mb-2">Recetas clásicas con un toque dulce de casa.</p>
                  <Link to="/productos" className="btn btn-dorado btn-sm">Ver catálogo</Link>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <Link to="/productos" className="d-block">
                <img src="/img/prod/pastelch.png" className="d-block w-100" alt="Pastel de chocolate" style={{maxHeight: 460, objectFit: 'cover'}} />
              </Link>
              <div className="carousel-caption d-none d-md-block">
                <div className="bg-dark bg-opacity-50 rounded px-3 py-2">
                  <h2 className="h3 mb-2">Endulza tu día</h2>
                  <p className="mb-2">Elige tu favorito y recíbelo en tu puerta.</p>
                  <Link to="/productos" className="btn btn-dorado btn-sm">Ver catálogo</Link>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carruselPasteles" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carruselPasteles" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </section>
    </div>
  )
}
