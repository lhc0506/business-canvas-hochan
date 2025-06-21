import type { Record, Field } from '../types';
import { INITIAL_RECORDS } from '../constants/initialData';
import { DEFAULT_FIELDS } from '../constants/fields';

// 환경 변수에서 저장 방식 가져오기
const STORAGE_TYPE = import.meta.env.VITE_STORAGE || 'in-memory';

// 로컬 스토리지 키
const RECORDS_KEY = 'member-records';
const FIELDS_KEY = 'member-fields';

// 인메모리 저장소
let inMemoryRecords: Record[] = [...INITIAL_RECORDS];
let inMemoryFields: Field[] = [...DEFAULT_FIELDS];

/**
 * 레코드 가져오기
 */
export const getRecords = (): Record[] => {
  if (STORAGE_TYPE === 'local-storage') {
    const storedRecords = localStorage.getItem(RECORDS_KEY);
    return storedRecords ? JSON.parse(storedRecords) : INITIAL_RECORDS;
  }
  return inMemoryRecords;
};

/**
 * 레코드 저장하기
 */
export const saveRecords = (records: Record[]): void => {
  if (STORAGE_TYPE === 'local-storage') {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } else {
    inMemoryRecords = [...records];
  }
};

/**
 * 필드 가져오기
 */
export const getFields = (): Field[] => {
  if (STORAGE_TYPE === 'local-storage') {
    const storedFields = localStorage.getItem(FIELDS_KEY);
    return storedFields ? JSON.parse(storedFields) : DEFAULT_FIELDS;
  }
  return inMemoryFields;
};

/**
 * 필드 저장하기
 */
export const saveFields = (fields: Field[]): void => {
  if (STORAGE_TYPE === 'local-storage') {
    localStorage.setItem(FIELDS_KEY, JSON.stringify(fields));
  } else {
    inMemoryFields = [...fields];
  }
};

/**
 * 저장 방식 가져오기
 */
export const getStorageType = (): string => {
  return STORAGE_TYPE;
};
