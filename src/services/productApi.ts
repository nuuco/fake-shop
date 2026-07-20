import { MOCK_PRODUCTS } from './mockProducts'
import type { Product } from '../types/product'

const ENDPOINT = 'https://fakestoreapi.com/products'
const REQUEST_TIMEOUT_MS = 8000

type ApiProduct = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

function isApiProduct(value: unknown): value is ApiProduct {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'number' &&
    typeof item.title === 'string' &&
    (typeof item.price === 'number' || typeof item.price === 'string') &&
    typeof item.image === 'string' &&
    typeof item.category === 'string' &&
    typeof item.description === 'string'
  )
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

type FetchOptions = {
  signal?: AbortSignal
}

function createTimeoutSignal(timeoutMs: number, external?: AbortSignal) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort('timeout'), timeoutMs)

  const onExternalAbort = () => controller.abort(external?.reason)
  if (external) {
    if (external.aborted) {
      controller.abort(external.reason)
    } else {
      external.addEventListener('abort', onExternalAbort, { once: true })
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timeoutId)
      external?.removeEventListener('abort', onExternalAbort)
    },
    wasTimeout: () => controller.signal.reason === 'timeout',
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === 'AbortError'
    : error instanceof Error && error.name === 'AbortError'
}

export async function fetchProducts(options: FetchOptions = {}): Promise<FetchProductsResult> {
  const timeout = createTimeoutSignal(REQUEST_TIMEOUT_MS, options.signal)

  try {
    const response = await fetch(ENDPOINT, { signal: timeout.signal })
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
    const products = data.filter(isApiProduct).map(mapApiProduct)
    return { products, fromMock: false, errorMessage: null }
  } catch (error) {
    if (options.signal?.aborted && !timeout.wasTimeout()) {
      throw error instanceof Error ? error : new Error('요청이 취소되었습니다.')
    }
    const message =
      isAbortError(error) || timeout.wasTimeout()
        ? '상품 API 요청 시간이 초과되었습니다.'
        : error instanceof Error
          ? error.message
          : '상품 데이터를 불러오지 못했습니다.'
    return {
      products: MOCK_PRODUCTS,
      fromMock: true,
      errorMessage: message,
    }
  } finally {
    timeout.cleanup()
  }
}

export async function fetchProductById(
  id: number,
  options: FetchOptions = {},
): Promise<Product | null> {
  const timeout = createTimeoutSignal(REQUEST_TIMEOUT_MS, options.signal)

  try {
    const response = await fetch(`${ENDPOINT}/${id}`, { signal: timeout.signal })
    if (!response.ok) {
      return MOCK_PRODUCTS.find((p) => p.id === id) ?? null
    }
    const data: unknown = await response.json()
    if (!isApiProduct(data)) {
      return MOCK_PRODUCTS.find((p) => p.id === id) ?? null
    }
    return mapApiProduct(data)
  } catch (error) {
    if (options.signal?.aborted && !timeout.wasTimeout()) {
      throw error instanceof Error ? error : new Error('요청이 취소되었습니다.')
    }
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null
  } finally {
    timeout.cleanup()
  }
}
