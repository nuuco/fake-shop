# Tomato Market · 데모 접속

> 채점자용 한 페이지. 제출 갭: [07](./07_과제제출체크.md)

## 사이트 URL

| 항목 | URL |
|---|---|
| 배포 | https://tomato-market-one.vercel.app/ |
| 레포 | https://github.com/nuuco/fake-shop |

## 접속 안내

1. 배포 URL 접속 → 상품 목록(또는 mock 배너) 확인
2. 상품 담기 → Header 배지·미리보기
3. `/cart`에서 수량·총액·계산하기
4. `/login`에서 Google 또는 이메일 로그인 (Firebase 설정·Authorized domains 필요)
5. Logout 후 cart가 비지 않는지 확인(게스트 유지 정책)

## SPA 라우팅

`/cart`, `/login`, `/product/:id` 직접 진입·새로고침은 `vercel.json` rewrite로 처리.  
이슈 기록: [09_트러블슈팅.md](./09_트러블슈팅.md) §5

## 캡처

원본: 레포 `screenshots/`

| 화면 | 파일 |
|---|---|
| 상품 목록 | `screenshots/products.png` |
| 로그인 | `screenshots/auth.png` |
| 장바구니 | `screenshots/cart.png` |
| 빈 장바구니 | `screenshots/error-empty.png` (파일명은 유지, 내용은 빈 cart UI) |

## 로컬 실행

```bash
npm install
cp .env.example .env   # Firebase 값 입력
npm run dev
```

환경 변수·보안: [06](./06_Firebase설계.md)
