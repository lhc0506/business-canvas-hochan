import type { Record, Field, ValidationResult } from "../types";
import { INITIAL_RECORDS } from "../constants/initialData";
import { DEFAULT_FIELDS } from "../constants/fields";
import { validateRecord, validateRecords } from "../utils/validation";

// 환경 변수에서 스토리지 타입 가져오기
const STORAGE_TYPE = import.meta.env.VITE_STORAGE || "in-memory";

// 로컬 스토리지 키
const RECORDS_KEY = "member-table-records";
const FIELDS_KEY = "member-table-fields";

// 인메모리 스토리지
let inMemoryRecords: Record[] = [...INITIAL_RECORDS];
let inMemoryFields: Field[] = [...DEFAULT_FIELDS];

/**
 * 레코드 데이터 가져오기
 * @returns 레코드 배열
 */
export const getRecords = (): Record[] => {
  if (STORAGE_TYPE === "local-storage") {
    try {
      const storedRecords = localStorage.getItem(RECORDS_KEY);
      return storedRecords ? JSON.parse(storedRecords) : [...INITIAL_RECORDS];
    } catch (error) {
      console.error(
        "로컬 스토리지에서 레코드를 불러오는 중 오류가 발생했습니다:",
        error
      );
      return [...INITIAL_RECORDS];
    }
  }
  return inMemoryRecords;
};

/**
 * 레코드 데이터 저장하기
 * @param records 저장할 레코드 배열
 * @returns 저장 성공 여부와 유효성 검사 결과
 */
export const saveRecords = (
  records: Record[]
): { success: boolean; validationResult?: ValidationResult } => {
  const fields = getFields();
  const validationResult = validateRecords(records, fields);

  // 유효성 검사 실패 시
  if (!validationResult.isValid) {
    return { success: false, validationResult };
  }

  try {
    if (STORAGE_TYPE === "local-storage") {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    } else {
      inMemoryRecords = [...records];
    }
    return { success: true };
  } catch (error) {
    console.error("레코드 저장 중 오류가 발생했습니다:", error);
    return { success: false };
  }
};

/**
 * 단일 레코드 저장하기
 * @param record 저장할 레코드
 * @returns 저장 성공 여부와 유효성 검사 결과
 */
export const saveRecord = (
  record: Record
): { success: boolean; validationResult?: ValidationResult } => {
  const fields = getFields();
  const validationResult = validateRecord(record, fields);

  // 유효성 검사 실패 시
  if (!validationResult.isValid) {
    return { success: false, validationResult };
  }

  const records = getRecords();
  const existingIndex = records.findIndex((r) => r.id === record.id);

  if (existingIndex >= 0) {
    // 기존 레코드 업데이트
    records[existingIndex] = record;
  } else {
    // 새 레코드 추가
    records.push(record);
  }

  return saveRecords(records);
};

/**
 * 레코드 삭제하기
 * @param id 삭제할 레코드 ID
 * @returns 삭제 성공 여부
 */
export const deleteRecord = (id: string): { success: boolean } => {
  try {
    const records = getRecords();
    const filteredRecords = records.filter((record) => record.id !== id);

    if (STORAGE_TYPE === "local-storage") {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(filteredRecords));
    } else {
      inMemoryRecords = filteredRecords;
    }

    return { success: true };
  } catch (error) {
    console.error("레코드 삭제 중 오류가 발생했습니다:", error);
    return { success: false };
  }
};

/**
 * 필드 정의 가져오기
 * @returns 필드 정의 배열
 */
export const getFields = (): Field[] => {
  if (STORAGE_TYPE === "local-storage") {
    try {
      const storedFields = localStorage.getItem(FIELDS_KEY);
      return storedFields ? JSON.parse(storedFields) : [...DEFAULT_FIELDS];
    } catch (error) {
      console.error(
        "로컬 스토리지에서 필드를 불러오는 중 오류가 발생했습니다:",
        error
      );
      return [...DEFAULT_FIELDS];
    }
  }
  return inMemoryFields;
};

/**
 * 필드 정의 저장하기
 * @param fields 저장할 필드 정의 배열
 * @returns 저장 성공 여부
 */
export const saveFields = (fields: Field[]): { success: boolean } => {
  try {
    if (STORAGE_TYPE === "local-storage") {
      localStorage.setItem(FIELDS_KEY, JSON.stringify(fields));
    } else {
      inMemoryFields = [...fields];
    }
    return { success: true };
  } catch (error) {
    console.error("필드 저장 중 오류가 발생했습니다:", error);
    return { success: false };
  }
};

/**
 * 단일 필드 저장하기
 * @param field 저장할 필드
 * @returns 저장 성공 여부
 */
export const saveField = (field: Field): { success: boolean } => {
  const fields = getFields();
  const existingIndex = fields.findIndex((f) => f.id === field.id);

  if (existingIndex >= 0) {
    // 기존 필드 업데이트
    fields[existingIndex] = field;
  } else {
    // 새 필드 추가
    fields.push(field);
  }

  return saveFields(fields);
};

/**
 * 필드 삭제하기
 * @param id 삭제할 필드 ID
 * @returns 삭제 성공 여부
 */
export const deleteField = (id: string): { success: boolean } => {
  try {
    const fields = getFields();
    const filteredFields = fields.filter((field) => field.id !== id);

    if (STORAGE_TYPE === "local-storage") {
      localStorage.setItem(FIELDS_KEY, JSON.stringify(filteredFields));
    } else {
      inMemoryFields = filteredFields;
    }

    return { success: true };
  } catch (error) {
    console.error("필드 삭제 중 오류가 발생했습니다:", error);
    return { success: false };
  }
};

/**
 * 저장 방식 가져오기
 */
export const getStorageType = (): string => {
  return STORAGE_TYPE;
};
