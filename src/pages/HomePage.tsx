import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchProducts } from '../services/productApi'
import type { Product } from '../types/product'
import { ProductList } from '../components/ProductList'
import { BRAND_NAME } from '../constants/brand'
import './HomePage.css'

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fromMock, setFromMock] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const load = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setErrorMessage(null)

    try {
      const result = await fetchProducts({ signal: controller.signal })
      if (controller.signal.aborted) return
      setProducts(result.products)
      setFromMock(result.fromMock)
      setErrorMessage(result.errorMessage)
      setLoading(false)
    } catch {
      if (controller.signal.aborted) return
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    return () => {
      abortRef.current?.abort()
    }
  }, [load])

  return (
    <div className="home">
      <section className="home__hero page-container">
        <p className="home__eyebrow">{BRAND_NAME}</p>
        <h1>All Products</h1>
      </section>

      <div className="home__catalog page-container">
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
            <button type="button" className="btn btn--ghost btn--small" onClick={() => void load()}>
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
    </div>
  )
}
