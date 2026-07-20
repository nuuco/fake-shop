import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { useAppDispatch } from '../store/hooks'
import { addItem } from '../store/cartSlice'
import { formatPrice } from '../utils/format'
import { handleImageError } from '../utils/image'
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
          alt={product.title}
          loading="lazy"
          onError={(event) => handleImageError(event, 320)}
        />
      </Link>
      <div className="product-card__body">
        <h2 className="product-card__title">
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h2>
        <p className="product-card__price">{formatPrice(product.price)}</p>
        <button
          type="button"
          className="product-card__add"
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
