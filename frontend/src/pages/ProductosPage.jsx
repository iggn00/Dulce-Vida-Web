import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import ProductDetailModal from '../components/ProductDetailModal.jsx'
import { getProducts, getCategories } from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function ProductosPage() {
  const [products, setProducts] = useState([])
  const { addItem, items: cartItems } = useCart()
  const [category, setCategory] = useState('Todos')
  const [categories, setCategories] = useState(['Todos'])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    (async () => {
      const [cats, prods] = await Promise.all([
        getCategories(),
        getProducts()
      ])
      
      setCategories(['Todos', ...cats.map(c => c.nombre)])
      
      const mapped = prods
        .filter(p => p.estado === 'disponible' && Number(p.stock) > 0)
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
    if (!isAuthenticated) {
      nav('/login')
      return
    }
    addItem(p)
  }

  function isMaxed(p){
    const found = (cartItems||[]).find(i => i.id === p.id)
    const qty = Number(found?.cantidad || 0)
    return typeof p.stock === 'number' ? qty >= p.stock : false
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
          <ProductCard key={p.id} product={p} onAdd={handleAdd} onViewDetail={handleViewDetail} disabledAdd={isMaxed(p)} />
        ))}
      </div>

      <ProductDetailModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onAdd={handleAdd}
        disabledAdd={selectedProduct ? isMaxed(selectedProduct) : false}
      />
    </div>
  )
}