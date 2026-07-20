import { useMemo, useState } from 'react'
import type { Product } from '../types/product'
import { ProductCard } from './ProductCard'
import './ProductList.css'

type ProductListProps = {
  products: Product[]
}

function formatCategoryLabel(category: string): string {
  if (category === 'all') return 'All'
  return category
}

export function ProductList({ products }: ProductListProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['all', ...Array.from(set).sort()]
  }, [products])

  const trimmedQuery = query.trim()
  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase()
    return products.filter((product) => {
      const matchCategory = category === 'all' || product.category === category
      const matchQuery = !q || product.title.toLowerCase().includes(q)
      return matchCategory && matchQuery
    })
  }, [products, trimmedQuery, category])

  return (
    <section className="product-list">
      <div className="product-list__toolbar">
        <div className="product-list__search">
          <label className="visually-hidden" htmlFor="product-search">
            상품 검색
          </label>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
          />
          {trimmedQuery.length > 0 && (
            <button
              type="button"
              className="product-list__clear"
              onClick={() => setQuery('')}
              aria-label="검색어 지우기"
            >
              Clear
            </button>
          )}
        </div>
        <p className="product-list__count">{filtered.length} items</p>
      </div>

      <div className="product-list__chips" role="group" aria-label="카테고리 필터">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`product-list__chip ${category === c ? 'is-active' : ''}`}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {formatCategoryLabel(c)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="state-message" role="status">
          조건에 맞는 상품이 없습니다.
        </p>
      ) : (
        <div className="product-list__grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
