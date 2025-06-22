# Business Canvas 프론트엔드 과제

## 주요 기능

- 회원 목록 조회 및 테이블 형태로 표시
- 새 회원 추가 및 기존 회원 정보 수정
- 회원 정보 삭제
- 다양한 필드 타입(텍스트, 날짜, 선택, 체크박스) 지원
- 필드별 유효성 검사
- 다양한 스토리지 방식 지원 (로컬 스토리지, 인메모리)

## 기술 스택

- **Frontend**: React 18, TypeScript
- **UI 라이브러리**: Ant Design v5.26.1
- **빌드 도구**: Vite
- **상태 관리**: 커스텀 훅 (useRecords, useFields)
- **날짜 처리**: dayjs

## 프로젝트 구조

```
src/
├── components/            # UI 컴포넌트
│   ├── FormFields/        # 폼 필드 관련 컴포넌트
│   │   ├── index.tsx      # FormField 컴포넌트
│   │   ├── FieldInput.tsx # 필드 타입별 입력 컴포넌트
│   │   └── styles.css     # 폼 필드 스타일
│   ├── MemberForm.tsx     # 회원 정보 입력/수정 폼
│   ├── MemberForm.css     # 회원 폼 스타일
│   └── MemberTable.tsx    # 회원 목록 테이블
├── constants/             # 상수 정의
│   └── fields.ts          # 기본 필드 정의
├── hooks/                 # 커스텀 훅
│   ├── useFields.ts       # 필드 관리 훅
│   └── useRecords.ts      # 레코드(회원) 관리 훅
├── services/              # 서비스 레이어
│   ├── storage.ts         # 스토리지 서비스
│   └── storageAdapter.ts  # 스토리지 어댑터 패턴 구현
├── types/                 # 타입 정의
│   └── index.ts           # 공통 타입 정의
├── utils/                 # 유틸리티 함수
│   └── validation.ts      # 유효성 검사 로직
├── App.tsx                # 메인 애플리케이션 컴포넌트
└── main.tsx               # 애플리케이션 진입점
```

## 설치 및 실행

### 필수 조건

- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

## 환경 변수

`.env` 파일에서 다음 환경 변수를 설정할 수 있습니다:

- `VITE_STORAGE`: 스토리지 방식 설정 (`local-storage` 또는 `in-memory`)

## 아키텍처 및 설계 원칙

### 컴포넌트 구조

- **컴포넌트 분리**: 관심사 분리 원칙에 따라 컴포넌트를 작은 단위로 분리
- **재사용 가능한 컴포넌트**: FormField, FieldInput 등의 재사용 가능한 컴포넌트 설계

### 상태 관리

- **커스텀 훅**: useRecords, useFields 훅을 통한 상태 관리 로직 캡슐화
- **데이터 흐름**: 단방향 데이터 흐름 유지

### 스토리지 전략

- **어댑터 패턴**: 다양한 스토리지 방식을 지원하기 위한 어댑터 패턴 적용
- **확장성**: 새로운 스토리지 방식 추가가 용이한 구조
