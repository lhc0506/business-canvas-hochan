// 필드 타입 정의
export type FieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox';

// 필드 정의 인터페이스
export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[]; // select 타입일 경우 사용
}

// 레코드(회원) 인터페이스
export interface Record {
  id: string;
  [key: string]: string | number | boolean | undefined; // 동적 필드를 위한 인덱스 시그니처
}
