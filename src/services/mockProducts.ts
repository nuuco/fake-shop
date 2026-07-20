import type { Product } from '../types/product'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    title: 'Canvas Weekend Tote',
    price: 39.99,
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
    category: "men's clothing",
    description: '가벼운 주말용 캔버스 토트. 실습용 mock 상품입니다.',
  },
  {
    id: 102,
    title: 'Soft Knit Cardigan',
    price: 54.5,
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
    category: "women's clothing",
    description: '부드러운 니트 가디건. API 장애 시 대체 데이터입니다.',
  },
  {
    id: 103,
    title: 'Everyday Backpack',
    price: 72,
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
    category: "men's clothing",
    description: '일상용 백팩. Fake Store 스키마와 동일한 내부 구조입니다.',
  },
  {
    id: 104,
    title: 'Studio Desk Lamp',
    price: 28.75,
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png',
    category: 'electronics',
    description: '작업용 데스크 램프 mock 상품입니다.',
  },
]
