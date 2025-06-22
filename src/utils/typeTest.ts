/**
 * 이 파일은 타입 테스트를 위한 것으로, 실제 애플리케이션 실행에는 사용되지 않습니다.
 * TypeScript 컴파일러가 타입 정의를 올바르게 검사하는지 확인하기 위한 용도입니다.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import type { 
  Field, 
  FieldType, 
  Record, 
  FieldConstraints, 
  ValidationResult, 
  ValidationError,
  DefaultFieldId,
  FieldValueType
} from '../types';
import { DEFAULT_FIELD_IDS } from '../types';

// 필드 타입 테스트
const textField: Field = {
  id: 'textField',
  type: 'text',
  label: '텍스트 필드',
  required: true,
  constraints: {
    minLength: 2,
    maxLength: 100,
    pattern: '^[a-zA-Z0-9]+$'
  },
  description: '텍스트 필드 설명',
  defaultValue: '기본값'
};

const numberField: Field = {
  id: 'numberField',
  type: 'number',
  label: '숫자 필드',
  required: false,
  constraints: {
    min: 0,
    max: 100
  },
  description: '숫자 필드 설명',
  defaultValue: 0
};

const dateField: Field = {
  id: 'dateField',
  type: 'date',
  label: '날짜 필드',
  required: true,
  constraints: {
    minDate: new Date('2020-01-01'),
    maxDate: new Date('2030-12-31')
  },
  description: '날짜 필드 설명',
  defaultValue: '2023-01-01'
};

const selectField: Field = {
  id: 'selectField',
  type: 'select',
  label: '선택 필드',
  required: true,
  options: ['옵션1', '옵션2', '옵션3'],
  description: '선택 필드 설명',
  defaultValue: '옵션1'
};

const checkboxField: Field = {
  id: 'checkboxField',
  type: 'checkbox',
  label: '체크박스 필드',
  required: false,
  description: '체크박스 필드 설명',
  defaultValue: false
};

// 레코드 타입 테스트
const testRecord: Record = {
  id: 'test1',
  [DEFAULT_FIELD_IDS.NAME]: '홍길동',
  [DEFAULT_FIELD_IDS.ADDRESS]: '서울시 강남구',
  [DEFAULT_FIELD_IDS.MEMO]: '테스트 메모',
  [DEFAULT_FIELD_IDS.JOIN_DATE]: '2023-01-01',
  [DEFAULT_FIELD_IDS.JOB]: '개발자',
  [DEFAULT_FIELD_IDS.EMAIL_CONSENT]: true,
  customField: '커스텀 필드 값'
};

// 필드 값 타입 매핑 테스트
const textValue: FieldValueType<'text'> = '텍스트 값';
const numberValue: FieldValueType<'number'> = 42;
const dateValue: FieldValueType<'date'> = '2023-01-01';
const selectValue: FieldValueType<'select'> = '옵션1';
const checkboxValue: FieldValueType<'checkbox'> = true;

// 유효성 검사 결과 테스트
const validResult: ValidationResult = {
  isValid: true,
  errors: []
};

const invalidResult: ValidationResult = {
  isValid: false,
  errors: [
    {
      fieldId: 'name',
      message: '이름은 필수 항목입니다.'
    },
    {
      fieldId: 'email',
      message: '이메일 형식이 올바르지 않습니다.'
    }
  ]
};

// 기본 필드 ID 테스트
const nameFieldId: DefaultFieldId = DEFAULT_FIELD_IDS.NAME;
const addressFieldId: DefaultFieldId = DEFAULT_FIELD_IDS.ADDRESS;
const memoFieldId: DefaultFieldId = DEFAULT_FIELD_IDS.MEMO;
const joinDateFieldId: DefaultFieldId = DEFAULT_FIELD_IDS.JOIN_DATE;
const jobFieldId: DefaultFieldId = DEFAULT_FIELD_IDS.JOB;
const emailConsentFieldId: DefaultFieldId = DEFAULT_FIELD_IDS.EMAIL_CONSENT;

// 타입 가드 테스트 함수
function isTextField(field: Field): field is Field & { type: 'text' } {
  return field.type === 'text';
}

function isNumberField(field: Field): field is Field & { type: 'number' } {
  return field.type === 'number';
}

function isDateField(field: Field): field is Field & { type: 'date' } {
  return field.type === 'date';
}

function isSelectField(field: Field): field is Field & { type: 'select' } {
  return field.type === 'select';
}

function isCheckboxField(field: Field): field is Field & { type: 'checkbox' } {
  return field.type === 'checkbox';
}

// 타입 가드 사용 예시
function processField(field: Field): void {
  if (isTextField(field)) {
    // 텍스트 필드 처리
    const minLength = field.constraints?.minLength;
    const maxLength = field.constraints?.maxLength;
    console.log(`텍스트 필드: ${field.label}, 최소 길이: ${minLength}, 최대 길이: ${maxLength}`);
  } else if (isNumberField(field)) {
    // 숫자 필드 처리
    const min = field.constraints?.min;
    const max = field.constraints?.max;
    console.log(`숫자 필드: ${field.label}, 최소값: ${min}, 최대값: ${max}`);
  } else if (isDateField(field)) {
    // 날짜 필드 처리
    const minDate = field.constraints?.minDate;
    const maxDate = field.constraints?.maxDate;
    console.log(`날짜 필드: ${field.label}, 최소 날짜: ${minDate}, 최대 날짜: ${maxDate}`);
  } else if (isSelectField(field)) {
    // 선택 필드 처리
    const options = field.options;
    console.log(`선택 필드: ${field.label}, 옵션: ${options?.join(', ')}`);
  } else if (isCheckboxField(field)) {
    // 체크박스 필드 처리
    console.log(`체크박스 필드: ${field.label}`);
  }
}

// 테스트 실행
processField(textField);
processField(numberField);
processField(dateField);
processField(selectField);
processField(checkboxField);
