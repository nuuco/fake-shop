import { Link } from 'react-router-dom'
import {
  decrease,
  increase,
  removeItem,
  selectCartItems,
  selectCartTotal,
} from '../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { formatPrice } from '../utils/format'
import './Cart.css'

export function Cart() {
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const dispatch = useAppDispatch()

  if (items.length === 0) {
    return (
      <section className="cart cart--empty">
        <h1>장바구니</h1>
        <p className="state-message" role="status">
          장바구니가 비어 있습니다. 상품을 담아 보세요.
        </p>
        <p className="cart__total">총액 {formatPrice(0)}</p>
        <Link to="/" className="btn btn--primary">
          상품 보러 가기
        </Link>
      </section>
    )
  }

  return (
    <section className="cart">
      <h1>장바구니</h1>
      <ul className="cart__list">
        {items.map((item) => (
          <li key={item.productId} className="cart__item">
            <img
              src={item.image}
              alt=""
              className="cart__thumb"
              onError={(event) => {
                event.currentTarget.src =
                  'data:image/svg+xml,' +
                  encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="#d9e2ec" width="100%" height="100%"/></svg>`,
                  )
              }}
            />
            <div className="cart__info">
              <Link to={`/product/${item.productId}`}>{item.title}</Link>
              <p>{formatPrice(item.price)}</p>
            </div>
            <div className="cart__qty" aria-label="수량 조절">
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => dispatch(decrease(item.productId))}
                aria-label="수량 감소"
              >
                −
              </button>
              <span aria-live="polite">{item.quantity}</span>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => dispatch(increase(item.productId))}
                aria-label="수량 증가"
              >
                +
              </button>
            </div>
            <p className="cart__line">{formatPrice(item.price * item.quantity)}</p>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => dispatch(removeItem(item.productId))}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      <div className="cart__summary">
        <p className="cart__total">총액 {formatPrice(total)}</p>
      </div>
    </section>
  )
}
