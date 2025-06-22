import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import type { Record, Field } from "../types";
import {
  getRecords,
  saveRecord,
  deleteRecord,
  getFields,
} from "../services/storage";

/**
 * 회원 레코드 관리를 위한 커스텀 훅
 * @returns 레코드 관련 상태 및 액션
 */
export function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loadedRecords = getRecords();
      const loadedFields = getFields();

      setRecords(loadedRecords);
      setFields(loadedFields);
    } catch (err) {
      console.error("데이터 로드 중 오류 발생:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      message.error("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 레코드 저장
  const saveRecordData = useCallback(
    async (record: Record) => {
      try {
        const result = saveRecord(record);

        if (result.success) {
          await loadData();
          return { success: true };
        } else {
          message.error("저장 중 유효성 검사 오류가 발생했습니다.");
          return {
            success: false,
            validationResult: result.validationResult,
          };
        }
      } catch (err) {
        console.error("레코드 저장 중 오류 발생:", err);
        message.error("저장 중 오류가 발생했습니다.");
        return { success: false };
      }
    },
    [loadData]
  );

  // 레코드 삭제
  const removeRecord = useCallback(
    async (id: string) => {
      try {
        const result = deleteRecord(id);

        if (result.success) {
          await loadData();
          message.success("회원이 삭제되었습니다.");
          return { success: true };
        } else {
          message.error("삭제 중 오류가 발생했습니다.");
          return { success: false };
        }
      } catch (err) {
        console.error("레코드 삭제 중 오류 발생:", err);
        message.error("삭제 중 오류가 발생했습니다.");
        return { success: false };
      }
    },
    [loadData]
  );

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    records,
    fields,
    loading,
    error,
    loadData,
    saveRecordData,
    removeRecord,
  };
}
