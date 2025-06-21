import type { Record } from '../types';

// 초기 레코드 데이터
export const INITIAL_RECORDS: Record[] = [
  {
    id: '1',
    name: 'John Doe',
    address: '서울 강남구',
    memo: '외국인',
    joinDate: '2024-10-02',
    job: '개발자',
    emailConsent: true,
  },
  {
    id: '2',
    name: 'Foo Bar',
    address: '서울 서초구',
    memo: '한국인',
    joinDate: '2024-10-01',
    job: 'PO',
    emailConsent: false,
  },
];
