import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { useAppDispatch } from '../store/hooks'
import { addItem } from '../store/cartSlice'
import { formatPrice } from '../utils/format'
import './ProductCard.css'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__media">
        <img
          src={product.image}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src =
              'data:image/svg+xml,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><rect fill="#d9e2ec" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#486581" font-family="sans-serif" font-size="16">Image unavailable</text></svg>`,
              )
          }}
        />
      </Link>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h2 className="product-card__title">
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h2>
        <p className="product-card__price">{formatPrice(product.price)}</p>
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
          담기
        </button>
      </div>
    </article>
  )
}
