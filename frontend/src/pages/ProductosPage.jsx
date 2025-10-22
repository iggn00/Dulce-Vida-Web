import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import ProductDetailModal from '../components/ProductDetailModal.jsx'
import { getProducts, getCategories } from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductosPage() {
  const [products, setProducts] = useState([])
  const { addItem } = useCart()
  const [category, setCategory] = useState('Todos')
  const [categories, setCategories] = useState(['Todos'])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const [cats, prods] = await Promise.all([
        getCategories(),
        getProducts()
      ])
      // cats: [{idCategoria, nombre}]
      setCategories(['Todos', ...cats.map(c => c.nombre)])
      // prods: [{idProducto, nombre, descripcion, precio, stock, imagenUrl, estado, categoria:{...}, ingredientes}]
      const mapped = prods
        .filter(p => p.estado === 'disponible')
        .map(p => ({
          id: p.idProducto,
          title: p.nombre,
          attributes: p.descripcion,
          price: Number(p.precio),
          stock: p.stock,
          image: p.imagenUrl ? ((import.meta.env.VITE_API_URL || 'http://localhost:8080') + p.imagenUrl) : undefined,
          category: p.categoria?.nombre || 'Otros',
          ingredientes: p.ingredientes
        }))
      setProducts(mapped)
    })()
  }, [])

  const availableCategories = useMemo(() => {
    const set = new Set(categories)
    products.forEach(p => set.add(p.category || 'Otros'))
    return Array.from(set)
  }, [products, categories])

  const shown = useMemo(() => {
    if (category === 'Todos') return products
    return products.filter(p => (p.category || 'Otros') === category)
  }, [products, category])

  function handleAdd(p) {
    addItem(p)
  }

  function handleViewDetail(product) {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <div>
      <h1 className="h4 mb-3">Nuestros productos</h1>
      <p className="text-muted mb-3">Explora toda nuestra carta. Filtra por categoría.</p>

      <div className="d-flex flex-wrap gap-2 mb-3" aria-label="Filtros de categoría">
        {availableCategories.map(cat => (
          <button key={cat} type="button" className={`btn btn-sm ${cat===category? 'btn-dorado':'btn-outline-secondary'}`} onClick={()=>setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        {shown.map(p => (
          <ProductCard key={p.id} product={p} onAdd={handleAdd} onViewDetail={handleViewDetail} />
        ))}
      </div>

      <ProductDetailModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onAdd={handleAdd}
      />
    </div>
  )
}