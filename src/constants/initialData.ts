import type { Record } from '../types';
import { DEFAULT_FIELD_IDS } from '../types';

// 초기 레코드 데이터
export const INITIAL_RECORDS: Record[] = [
  {
    id: '1',
    [DEFAULT_FIELD_IDS.NAME]: 'John Doe',
    [DEFAULT_FIELD_IDS.ADDRESS]: '서울 강남구',
    [DEFAULT_FIELD_IDS.MEMO]: '외국인',
    [DEFAULT_FIELD_IDS.JOIN_DATE]: '2024-10-02',
    [DEFAULT_FIELD_IDS.JOB]: '개발자',
    [DEFAULT_FIELD_IDS.EMAIL_CONSENT]: true,
  },
  {
    id: '2',
    [DEFAULT_FIELD_IDS.NAME]: 'Foo Bar',
    [DEFAULT_FIELD_IDS.ADDRESS]: '서울 서초구',
    [DEFAULT_FIELD_IDS.MEMO]: '한국인',
    [DEFAULT_FIELD_IDS.JOIN_DATE]: '2024-10-01',
    [DEFAULT_FIELD_IDS.JOB]: 'PO',
    [DEFAULT_FIELD_IDS.EMAIL_CONSENT]: false,
  },
];
