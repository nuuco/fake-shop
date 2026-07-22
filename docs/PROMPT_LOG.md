# AI 프롬프트 사용 기록

과제 제출용 AI 활용 로그입니다.  
도구는 Cursor(Composer)입니다. 사람이 `product` / `cartItem` / `authUser`와 정책을 먼저 정한 뒤, 기능 단위로 요청했습니다.

---

## 기본 구현 프롬프트

### 프롬프트 1: 장바구니 Redux 기능 단위 구현

**요청 내용:**

```
확정한 장바구니 설계를 Redux Toolkit으로 기능 단위 구현해.
순서: store → Provider → cart slice → add → selectors → 수량·삭제.
total은 selector로 계산해. LocalStorage 동기화해.
전체 재작성 금지. 단계별 변경해.
```

**적용 결과:**
- `cartSlice` · `configureStore` · `selectCartTotal`(price × quantity)
- `addItem` / `increase` / `decrease` / `removeItem` / `clearCart`

---

### 프롬프트 2: API · Auth · 화면 통합

**요청 내용:**
- Fake Store API 연동해. 실패·timeout 시 mock으로 대체하고 loading/error/empty·재시도 처리해.
- Firebase Google 로그인·초기 loading·오류·로그아웃 붙여.
- 홈·상세·cart·login 라우팅과 Header 배지까지 연결해.

**적용 결과:**
- `productApi` 8초 Abort + `MOCK_PRODUCTS`
- `useAuth` + `AuthContext` + Login/Header
- 필수·권장·도전 골격 완료

---

## 추가 개선 프롬프트

---

- 프롬프트:

```
Firebase .env 연결해. Google 로그인 실사용 가이드 적어.
콘솔에 COOP / window.closed 경고가 뜨는데 치명인지 알려줘.
```

> 의도/반영: `VITE_FIREBASE_*` · Authorized domains. popup COOP는 치명 아님, Header 표시로 성공 판별. 상세는 docs/09 §4.

---

- 프롬프트:

```
사이드이펙트 리팩토링해. fetch abort, LocalStorage 안전화, auth status, dead code 정리해.
```

> 의도/반영: unmount abort, cart 참조 변경 시에만 persist+try/catch, `onAuthStateChanged`만 status 갱신. docs/09 §3.

---

- 프롬프트:

```
Tomato Market으로 가고, 흰 배경·큰 타이포·무카드 그리드로 맞춰.
과한 포인트 컬러나 귀여운 톤은 빼.
```

> 의도/반영: Inter+Noto Sans KR, 글라스 헤더, 모바일 아이콘 내비. 장식적 톤 기각.

---

- 프롬프트:

```
Vercel에 배포해. /cart·/login 새로고침하면 404 나. 고쳐.
```

> 의도/반영: `vercel.json` rewrite → `index.html`. 배포 URL `tomato-market-one.vercel.app`. docs/09 §5.

---

- 프롬프트:

```
결과 예시처럼 동작하게 해.
상세에서 담으면 문구 바꾸고 장바구니로 가게 해.
헤더에 담기 미리보기 넣어.
계산하기는 cart 비우기로 해.
```

> 의도/반영: `ProductDetailPage` 담기 상태, `Header` lastAdded, `Cart` `clearCart`.

---

- 프롬프트:

```
이메일·비밀번호 로그인·회원가입도 추가해.
입력 검증은 틀리면 빨간 안내, 맞으면 연두 체크 보여줘.
```

> 의도/반영: Firebase email/password + LoginPage 폼 검증 UX.

---

- 프롬프트:

```
README 템플릿 §1~17 채워. 스크린샷 최신 UI로 맞춰.
```

> 의도/반영: README 제출면 작성, `screenshots/` 4장 연결.

---

- 프롬프트:

```
피드백 기준으로 보완해. 구조 설계·AI 협업·오류·보안 증거를 docs로 나눠 적어.
트러블슈팅은 문서 하나로 이슈를 다 넣어.
```

> 의도/반영: `docs/01~09`·`PROMPT_LOG` 신설, README 링크, `.env.*` gitignore.

---

## 채택 / 기각 요약

| 구분 | 내용 |
|---|---|
| 채택 | RTK cart, Context auth, API+mock fallback, Tomato Market, Google+이메일 Auth |
| 기각 | 결과 예시 UI 복제, Firestore 실구현, 결제, 장식적·귀여운 UI 톤 |
| 사람 확정 | 게스트 cart 유지, total은 selector, SPA rewrite, docs 체계 |
