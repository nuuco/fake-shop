import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '../services/productApi'
import type { Product } from '../types/product'
import { useAppDispatch } from '../store/hooks'
import { addItem } from '../store/cartSlice'
import { formatPrice } from '../utils/format'
import { handleImageError } from '../utils/image'
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

    const controller = new AbortController()
    setLoading(true)

    void fetchProductById(productId, { signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return
        setProduct(result)
        setLoading(false)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setProduct(null)
        setLoading(false)
      })

    return () => controller.abort()
  }, [id])

  if (loading) {
    return (
      <div className="page-container page-container--padded">
        <p className="state-message" role="status">
          상품 정보를 불러오는 중입니다…
        </p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page-container page-container--padded">
        <section className="detail">
          <p className="state-message" role="status">
            상품을 찾을 수 없습니다.
          </p>
          <Link to="/" className="btn btn--primary">
            목록으로
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="page-container page-container--padded">
      <article className="detail">
        <Link to="/" className="detail__back">
          ← 목록
        </Link>
        <div className="detail__layout">
          <div className="detail__media">
            <img
              src={product.image}
              alt={product.title}
              onError={(event) => handleImageError(event, 480)}
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
    </div>
  )
}
