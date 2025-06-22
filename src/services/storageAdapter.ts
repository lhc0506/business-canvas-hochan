import type { Record, Field } from "../types";
import { INITIAL_RECORDS } from "../constants/initialData";
import { DEFAULT_FIELDS } from "../constants/fields";

/**
 * 스토리지 어댑터 인터페이스
 */
export interface StorageAdapter {
  getRecords(): Record[];
  saveRecords(records: Record[]): boolean;
  getFields(): Field[];
  saveFields(fields: Field[]): boolean;
}

/**
 * 인메모리 스토리지 어댑터 구현
 */
export class InMemoryStorageAdapter implements StorageAdapter {
  private records: Record[] = [...INITIAL_RECORDS];
  private fields: Field[] = [...DEFAULT_FIELDS];

  getRecords(): Record[] {
    return [...this.records];
  }

  saveRecords(records: Record[]): boolean {
    try {
      this.records = [...records];
      return true;
    } catch (error) {
      console.error("인메모리 레코드 저장 중 오류:", error);
      return false;
    }
  }

  getFields(): Field[] {
    return [...this.fields];
  }

  saveFields(fields: Field[]): boolean {
    try {
      this.fields = [...fields];
      return true;
    } catch (error) {
      console.error("인메모리 필드 저장 중 오류:", error);
      return false;
    }
  }
}

/**
 * 로컬 스토리지 어댑터 구현
 */
export class LocalStorageAdapter implements StorageAdapter {
  private readonly RECORDS_KEY = "member-table-records";
  private readonly FIELDS_KEY = "member-table-fields";

  getRecords(): Record[] {
    try {
      const storedRecords = localStorage.getItem(this.RECORDS_KEY);
      return storedRecords ? JSON.parse(storedRecords) : [...INITIAL_RECORDS];
    } catch (error) {
      console.error("로컬 스토리지 레코드 로드 중 오류:", error);
      return [...INITIAL_RECORDS];
    }
  }

  saveRecords(records: Record[]): boolean {
    try {
      localStorage.setItem(this.RECORDS_KEY, JSON.stringify(records));
      return true;
    } catch (error) {
      console.error("로컬 스토리지 레코드 저장 중 오류:", error);
      return false;
    }
  }

  getFields(): Field[] {
    try {
      const storedFields = localStorage.getItem(this.FIELDS_KEY);
      return storedFields ? JSON.parse(storedFields) : [...DEFAULT_FIELDS];
    } catch (error) {
      console.error("로컬 스토리지 필드 로드 중 오류:", error);
      return [...DEFAULT_FIELDS];
    }
  }

  saveFields(fields: Field[]): boolean {
    try {
      localStorage.setItem(this.FIELDS_KEY, JSON.stringify(fields));
      return true;
    } catch (error) {
      console.error("로컬 스토리지 필드 저장 중 오류:", error);
      return false;
    }
  }
}

/**
 * 스토리지 어댑터 팩토리
 */
export class StorageAdapterFactory {
  static createAdapter(type: string): StorageAdapter {
    switch (type.toLowerCase()) {
      case "local-storage":
        return new LocalStorageAdapter();
      case "in-memory":
      default:
        return new InMemoryStorageAdapter();
    }
  }
}

// 싱글톤 인스턴스
let storageAdapterInstance: StorageAdapter | null = null;

/**
 * 스토리지 어댑터 인스턴스 가져오기
 */
export function getStorageAdapter(): StorageAdapter {
  if (!storageAdapterInstance) {
    const storageType = import.meta.env.VITE_STORAGE || "in-memory";
    storageAdapterInstance = StorageAdapterFactory.createAdapter(storageType);
  }
  return storageAdapterInstance;
}

/**
 * 테스트용 어댑터 설정 함수
 */
export function setStorageAdapter(adapter: StorageAdapter): void {
  storageAdapterInstance = adapter;
}
