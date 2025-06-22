import type { Record, Field, ValidationResult } from "../types";
import { validateRecord, validateRecords } from "../utils/validation";
import { getStorageAdapter } from "./storageAdapter";

// 스토리지 어댑터 인스턴스 가져오기
const storageAdapter = getStorageAdapter();

/**
 * 레코드 데이터 가져오기
 * @returns 레코드 배열
 */
export const getRecords = (): Record[] => {
  try {
    return storageAdapter.getRecords();
  } catch (error) {
    console.error("레코드를 불러오는 중 오류가 발생했습니다:", error);
    return [];
  }
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
    const success = storageAdapter.saveRecords(records);
    return { success };
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
    const success = storageAdapter.saveRecords(filteredRecords);
    return { success };
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
  try {
    return storageAdapter.getFields();
  } catch (error) {
    console.error("필드를 불러오는 중 오류가 발생했습니다:", error);
    return [];
  }
};

/**
 * 필드 정의 저장하기
 * @param fields 저장할 필드 정의 배열
 * @returns 저장 성공 여부
 */
export const saveFields = (fields: Field[]): { success: boolean } => {
  try {
    const success = storageAdapter.saveFields(fields);
    return { success };
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
    const success = storageAdapter.saveFields(filteredFields);
    return { success };
  } catch (error) {
    console.error("필드 삭제 중 오류가 발생했습니다:", error);
    return { success: false };
  }
};
