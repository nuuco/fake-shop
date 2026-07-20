import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/productApi'
import type { Product } from '../types/product'
import { ProductList } from '../components/ProductList'
import './HomePage.css'

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fromMock, setFromMock] = useState(false)

  const load = async () => {
    setLoading(true)
    setErrorMessage(null)
    const result = await fetchProducts()
    setProducts(result.products)
    setFromMock(result.fromMock)
    setErrorMessage(result.errorMessage)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div className="home">
      <section className="home__hero">
        <p className="home__brand">NUUCO Market</p>
        <h1>일상 속 좋은 물건을 고르는 작은 마켓</h1>
        <p className="home__lead">
          Fake Store API 상품을 살펴보고, 전역 장바구니에 담아 예상 총액을 확인하세요.
        </p>
      </section>

      {loading && (
        <p className="state-message" role="status">
          상품을 불러오는 중입니다…
        </p>
      )}

      {!loading && errorMessage && (
        <div className="banner banner--warn" role="alert">
          <p>
            API 오류: {errorMessage}
            {fromMock ? ' — mock 데이터로 대체했습니다.' : ''}
          </p>
          <button type="button" className="btn btn--ghost" onClick={() => void load()}>
            다시 시도
          </button>
        </div>
      )}

      {!loading && !errorMessage && products.length === 0 && (
        <p className="state-message" role="status">
          표시할 상품이 없습니다.
        </p>
      )}

      {!loading && products.length > 0 && <ProductList products={products} />}
    </div>
  )
}
