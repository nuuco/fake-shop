# Tomato Market · PROMPT_LOG

> 바이브 코딩 상세 로그. 인덱스: [03_프롬프트기록.md](./03_프롬프트기록.md)

## 원칙

1. **사람이 먼저** `product` / `cartItem` / `authUser`와 정책을 정한다.
2. AI에는 **기능 단위**로 프롬프트를 주고, 결과를 검토·수정한다.
3. 결과 예시 UI·문구 **복제 금지**. 기능·데이터·상태·인증 흐름 우선.

---

## 1. 과제 파악 (코드 금지)

```text
React 쇼핑몰 과제를 시작합니다.
공식 요구사항: React, Redux Toolkit, Firebase Authentication, Fake Store API, TypeScript 선택
제외: 결제·주문·배송·회원 등급·실제 개인정보
요청: 필수·권장·도전 구분, 데이터·상태·인증·API·UI 순서, 아직 코드 작성 금지
```

**결정:** Google Auth 채택, 게스트 cart 허용, Firestore cart는 설계만. (이후 이메일/비밀번호 로그인·가입 추가)

---

## 2. 저장 계층 정리 후 구현 위임

**질문 요지:** 「Redux는 DB인가?」

**정리 결과**

| 계층 | 역할 |
|---|---|
| Redux | 런타임 전역 cart |
| LocalStorage | 새로고침 유지 |
| Firestore | 사용자별 sync (미구현·설계만) |

```text
확정한 장바구니 설계를 Redux Toolkit으로 기능 단위 구현해줘.
순서: store → Provider → cart slice → add → selectors → 수량·삭제
조건: 단계별 변경, total은 selector, LocalStorage 동기화, 전체 재작성 금지
```

**적용:** `src/store/cartSlice.ts`, `src/store/index.ts`, `selectCartTotal = price × quantity`

---

## 3. 브랜드 — 설계 승인 후 코딩

```text
nuuco 쓰지 말고… 아직 코드 수정하지 말고 어떻게 할지 알려줘
```

| 안 | 결과 |
|---|---|
| NUUCO | ❌ 기각 |
| Forma Market | ➖ 중간안 |
| Tomato Market + 유어마인드형 | ✅ 채택 |
| Toss 블루 / 카톡 귀여움 | ❌ 기각 |

---

## 4. 결과 예시 동작 명세

Drive 링크는 열지 못하고, 자연어로 명세:

- 상세 담기 → 문구 변경·장바구니 이동
- 헤더 담기 미리보기
- 계산하기 = `clearCart`

**적용:** `ProductDetailPage`, `Header`, `Cart`

---

## 5. 배포·피드백 docs

- Vercel 배포 후 `/cart`·`/login` 새로고침 404 → `vercel.json` rewrite ([09](./09_트러블슈팅.md))
- 피드백: 구조→AI→검증 증거 부족 → docs/01~09 체계 구축

---

## 채택 / 기각 요약

| 구분 | 내용 |
|---|---|
| 채택 | RTK cart, Context auth, mock fallback, Tomato Market, 이메일+Google Auth |
| 기각 | 결과 예시 UI 복제, Firestore 실구현, 결제, Toss/카톡 톤 |
| 사람 수정 | 게스트 cart 유지, `.env` 미설정 UX, 순환 import 제거, SPA rewrite |
