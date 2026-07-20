import { Link } from 'react-router-dom'
import { BRAND_NAME } from '../constants/brand'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner page-container">
        <div className="site-footer__top">
          <p className="site-footer__brand">{BRAND_NAME}</p>
          <nav className="site-footer__links" aria-label="푸터 메뉴">
            <Link to="/">Shop</Link>
            <Link to="/cart">Cart</Link>
            <span>이용약관</span>
            <span>개인정보처리방침</span>
          </nav>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__meta">
            <p>서울특별시 마포구 연희로 00, 302호</p>
            <p>오후 1시–8시 · 070-0000-0000</p>
            <p>hello@tomato-market.example</p>
          </div>
          <div className="site-footer__meta">
            <p>사업자번호 000-00-00000</p>
            <p>통신판매업 2024-서울마포-0000</p>
            <p>대표 김토망 · 호스팅 제공자 Tomato Hosting</p>
          </div>
        </div>

        <p className="site-footer__copy">
          Copyright © Tomato Market. Demo store for study — no real checkout.
        </p>
      </div>
    </footer>
  )
}
