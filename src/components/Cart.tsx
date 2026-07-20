import { Link } from 'react-router-dom'
import {
  clearCart,
  decrease,
  increase,
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
} from '../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { formatPrice } from '../utils/format'
import { handleImageError } from '../utils/image'
import './Cart.css'

export function Cart() {
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const count = useAppSelector(selectCartCount)
  const dispatch = useAppDispatch()

  if (items.length === 0) {
    return (
      <section className="cart cart--empty">
        <header className="cart__header">
          <h1>Cart</h1>
          <p className="cart__meta">0 items</p>
        </header>
        <div className="cart__empty-body">
          <p className="cart__empty-lead">장바구니가 비어 있습니다.</p>
          <p className="cart__empty-copy">마음에 드는 상품을 담아 보세요.</p>
          <Link to="/" className="cart__continue">
            Continue shopping →
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="cart">
      <header className="cart__header">
        <h1>Cart</h1>
        <p className="cart__meta">
          {count} {count === 1 ? 'item' : 'items'}
        </p>
      </header>

      <div className="cart__columns" aria-hidden="true">
        <span>Product</span>
        <span>Qty</span>
        <span>Total</span>
        <span />
      </div>

      <ul className="cart__list">
        {items.map((item) => (
          <li key={item.productId} className="cart__item">
            <Link to={`/product/${item.productId}`} className="cart__thumb-link">
              <img
                src={item.image}
                alt=""
                className="cart__thumb"
                onError={(event) => handleImageError(event, 112)}
              />
            </Link>
            <div className="cart__info">
              <Link to={`/product/${item.productId}`}>{item.title}</Link>
              <p className="cart__unit">{formatPrice(item.price)}</p>
            </div>
            <div className="cart__qty" aria-label="수량 조절">
              <button
                type="button"
                className="cart__qty-btn"
                onClick={() => dispatch(decrease(item.productId))}
                aria-label="수량 감소"
              >
                −
              </button>
              <span className="cart__qty-value" aria-live="polite">
                {item.quantity}
              </span>
              <button
                type="button"
                className="cart__qty-btn"
                onClick={() => dispatch(increase(item.productId))}
                aria-label="수량 증가"
              >
                +
              </button>
            </div>
            <p className="cart__line">{formatPrice(item.price * item.quantity)}</p>
            <button
              type="button"
              className="cart__remove"
              onClick={() => dispatch(removeItem(item.productId))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart__summary">
        <div className="cart__summary-row">
          <span>Subtotal</span>
          <strong className="cart__total">{formatPrice(total)}</strong>
        </div>
        <p className="cart__summary-note">
          이 장바구니는 브라우저에 저장되며, 실제 결제 기능은 포함되지 않습니다.
        </p>
        <div className="cart__summary-actions">
          <button
            type="button"
            className="btn btn--primary cart__checkout"
            onClick={() => dispatch(clearCart())}
          >
            계산하기
          </button>
          <Link to="/" className="cart__continue">
            ← Continue shopping
          </Link>
        </div>
      </div>
    </section>
  )
}
