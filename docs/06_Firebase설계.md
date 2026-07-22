# Tomato Market · Firebase 설계

> Auth만 사용. cart는 Redux+LocalStorage. 관련: [02](./02_데이터구조.md) · [08](./08_데모접속_사이트URL.md)

## 1. 범위

| 사용 | 미사용 |
|---|---|
| Firebase Authentication (Google, Email/Password) | Firestore 실구현 (설계만) |
| Web 클라이언트 설정 (`VITE_FIREBASE_*`) | Admin SDK / service account |
| `onAuthStateChanged` 단일 listener | 비밀번호·토큰을 레포에 저장 |

## 2. 코드 위치

| 파일 | 역할 |
|---|---|
| `src/services/firebase.ts` | `initializeApp`, `getAuth`, env 존재 여부 |
| `src/hooks/useAuth.ts` | login/signup/logout, status, 오류 매핑 |
| `src/context/AuthContext.tsx` | Provider |
| `src/pages/LoginPage.tsx` | 폼·Google 버튼·검증 UX |
| `src/components/Header.tsx` | 로딩·Login/Logout·이니셜 |

## 3. 인증 흐름

```text
앱 시작 → status=loading
→ onAuthStateChanged
→ authenticated | unauthenticated
→ (로그인 시도) 성공: / 이동 · 실패: 오류 배너
→ Logout → signOut → unauthenticated (cart 유지)
```

정책: **비로그인에서도** 상품 열람·장바구니 가능.

## 4. 환경 변수

로컬: `.env` (git 제외) ← `.env.example` 복사

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

배포(Vercel): Project Settings → Environment Variables에 동일 키 등록.  
클라이언트에 노출되는 **Web API 키**이므로 Vercel env 등록은 허용. **service account / Admin private key는 금지.**

## 5. Authorized domains

Firebase Console → Authentication → Settings → Authorized domains

- `localhost`
- `tomato-market-one.vercel.app` (배포 도메인)

미등록 시 Google 로그인 실패.

## 6. 보안·한계

| 항목 | 내용 |
|---|---|
| 커밋 금지 | `.env` 실값, service account JSON, Admin key |
| 화면 | uid·실사용자 이메일 전체 미노출 (이니셜·마스킹). Footer 주소는 브랜드 데모 문구 |
| 한계 | 클라이언트 키는 번들에 포함됨 → Domain·Auth 규칙으로 보호 |
| 노출 시 | Firebase에서 키 제한/재발급, Vercel env 교체 후 재배포 |

## 7. 알려진 경고

Google `signInWithPopup` 시 COOP/`window.closed` 콘솔 메시지가 날 수 있음.  
Header에 사용자 표시되면 **로그인 성공**. 상세: [09_트러블슈팅.md](./09_트러블슈팅.md) §4
