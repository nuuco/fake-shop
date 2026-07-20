import { MOCK_PRODUCTS } from './mockProducts'
import type { Product } from '../types/product'

const ENDPOINT = 'https://fakestoreapi.com/products'

type ApiProduct = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

export function mapApiProduct(raw: ApiProduct): Product {
  return {
    id: raw.id,
    title: raw.title,
    price: Number(raw.price),
    image: raw.image,
    category: raw.category,
    description: raw.description,
  }
}

export type FetchProductsResult = {
  products: Product[]
  fromMock: boolean
  errorMessage: string | null
}

export async function fetchProducts(): Promise<FetchProductsResult> {
  try {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 8000)
    const response = await fetch(ENDPOINT, { signal: controller.signal })
    window.clearTimeout(timeoutId)
    if (!response.ok) {
      throw new Error(`상품 API 응답 오류 (${response.status})`)
    }
    const data: unknown = await response.json()
    if (!Array.isArray(data) || data.length === 0) {
      return {
        products: [],
        fromMock: false,
        errorMessage: null,
      }
    }
    const products = data.map((item) => mapApiProduct(item as ApiProduct))
    return { products, fromMock: false, errorMessage: null }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.name === 'AbortError'
          ? '상품 API 요청 시간이 초과되었습니다.'
          : error.message
        : '상품 데이터를 불러오지 못했습니다.'
    return {
      products: MOCK_PRODUCTS,
      fromMock: true,
      errorMessage: message,
    }
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`${ENDPOINT}/${id}`)
    if (!response.ok) {
      const mock = MOCK_PRODUCTS.find((p) => p.id === id)
      return mock ?? null
    }
    const data = (await response.json()) as ApiProduct
    return mapApiProduct(data)
  } catch {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null
  }
}

export { ENDPOINT as PRODUCT_ENDPOINT }
