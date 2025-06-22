/**
 * 필드 타입 정의
 * - text: 텍스트 입력 필드
 * - number: 숫자 입력 필드
 * - date: 날짜 선택 필드
 * - select: 드롭다운 선택 필드
 * - checkbox: 체크박스 필드
 */
export type FieldType = "text" | "number" | "date" | "select" | "checkbox";

/**
 * 필드 제약조건 인터페이스
 */
export interface FieldConstraints {
  minLength?: number; // 최소 길이 (text 타입)
  maxLength?: number; // 최대 길이 (text 타입)
  min?: number; // 최소값 (number 타입)
  max?: number; // 최대값 (number 타입)
  pattern?: string; // 정규식 패턴 (text 타입)
  minDate?: Date; // 최소 날짜 (date 타입)
  maxDate?: Date; // 최대 날짜 (date 타입)
}

/**
 * 필드 정의 인터페이스
 */
export interface Field {
  id: string; // 필드 식별자 (고유값)
  type: FieldType; // 필드 타입
  label: string; // 표시 라벨
  required: boolean; // 필수 여부
  options?: string[]; // select 타입일 경우 선택 옵션
  constraints?: FieldConstraints; // 필드 제약조건
  description?: string; // 필드 설명
  defaultValue?: string | number | boolean; // 기본값
}

/**
 * 레코드(회원) 인터페이스
 */
export interface Record {
  id: string; // 레코드 식별자 (고유값)
  [key: string]: string | number | boolean | undefined; // 동적 필드를 위한 인덱스 시그니처
}

/**
 * 필드 유효성 검사 결과 인터페이스
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * 유효성 검사 오류 인터페이스
 */
export interface ValidationError {
  fieldId: string;
  message: string;
}

/**
 * 기본 필드 ID 상수
 */
export const DEFAULT_FIELD_IDS = {
  NAME: "name",
  ADDRESS: "address",
  MEMO: "memo",
  JOIN_DATE: "joinDate",
  JOB: "job",
  EMAIL_CONSENT: "emailConsent",
} as const;

/**
 * 기본 필드 ID 타입
 */
export type DefaultFieldId =
  (typeof DEFAULT_FIELD_IDS)[keyof typeof DEFAULT_FIELD_IDS];

/**
 * 필드 값 타입 매핑
 */
export type FieldValueType<T extends FieldType> = T extends "text"
  ? string
  : T extends "number"
  ? number
  : T extends "date"
  ? string
  : T extends "select"
  ? string
  : T extends "checkbox"
  ? boolean
  : never;

/**
 * 모든 필드 값 타입
 */
export type FieldValue = string | number | boolean | undefined | null;
