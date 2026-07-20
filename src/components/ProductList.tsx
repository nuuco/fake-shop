import { useMemo, useState } from 'react'
import type { Product } from '../types/product'
import { ProductCard } from './ProductCard'
import './ProductList.css'

type ProductListProps = {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['all', ...Array.from(set).sort()]
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchCategory = category === 'all' || product.category === category
      const matchQuery = !q || product.title.toLowerCase().includes(q)
      return matchCategory && matchQuery
    })
  }, [products, query, category])

  const queryValid = query.trim().length === 0 || query.trim().length >= 1

  return (
    <section className="product-list">
      <div className="product-list__filters">
        <label className="field">
          <span className="field__label">상품 검색</span>
          <div className={`field__control ${queryValid ? 'field__control--ok' : 'field__control--error'}`}>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="상품명으로 검색"
              aria-invalid={!queryValid}
            />
            {queryValid && query.trim().length > 0 && (
              <span className="field__icon" aria-hidden="true">
                ✓
              </span>
            )}
          </div>
        </label>
        <label className="field">
          <span className="field__label">카테고리</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? '전체' : c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="state-message" role="status">
          조건에 맞는 상품이 없습니다.
        </p>
      ) : (
        <div className="product-list__grid">
          {filtered.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
