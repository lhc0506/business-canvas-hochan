import type { Field } from '../types';

// 기본 필드 정의
export const DEFAULT_FIELDS: Field[] = [
  {
    id: 'name',
    type: 'text',
    label: '이름',
    required: true,
  },
  {
    id: 'address',
    type: 'text',
    label: '주소',
    required: false,
  },
  {
    id: 'memo',
    type: 'text',
    label: '메모',
    required: false,
  },
  {
    id: 'joinDate',
    type: 'date',
    label: '가입일',
    required: true,
  },
  {
    id: 'job',
    type: 'text',
    label: '직업',
    required: false,
  },
  {
    id: 'emailConsent',
    type: 'checkbox',
    label: '이메일 수신 동의',
    required: false,
  },
];
