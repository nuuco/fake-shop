import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '../services/productApi'
import type { Product } from '../types/product'
import { useAppDispatch } from '../store/hooks'
import { addItem } from '../store/cartSlice'
import { formatPrice } from '../utils/format'
import './ProductDetailPage.css'

export function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const productId = Number(id)
    if (!Number.isFinite(productId)) {
      setProduct(null)
      setLoading(false)
      return
    }
    setLoading(true)
    void fetchProductById(productId).then((result) => {
      setProduct(result)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <p className="state-message" role="status">
        상품 정보를 불러오는 중입니다…
      </p>
    )
  }

  if (!product) {
    return (
      <section className="detail">
        <p className="state-message" role="status">
          상품을 찾을 수 없습니다.
        </p>
        <Link to="/" className="btn btn--primary">
          목록으로
        </Link>
      </section>
    )
  }

  return (
    <article className="detail">
      <Link to="/" className="detail__back">
        ← 목록
      </Link>
      <div className="detail__layout">
        <div className="detail__media">
          <img
            src={product.image}
            alt=""
            onError={(event) => {
              event.currentTarget.src =
                'data:image/svg+xml,' +
                encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480"><rect fill="#d9e2ec" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#486581" font-family="sans-serif" font-size="18">Image unavailable</text></svg>`,
                )
            }}
          />
        </div>
        <div className="detail__body">
          <p className="detail__category">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="detail__price">{formatPrice(product.price)}</p>
          <p className="detail__desc">{product.description}</p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() =>
              dispatch(
                addItem({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                }),
              )
            }
          >
            장바구니 담기
          </button>
        </div>
      </div>
    </article>
  )
}
