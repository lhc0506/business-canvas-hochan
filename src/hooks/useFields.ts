import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import type { Field } from "../types";
import { getFields, saveField, deleteField } from "../services/storage";

/**
 * 필드 관리를 위한 커스텀 훅
 * @returns 필드 관련 상태 및 액션
 */
export function useFields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 필드 데이터 로드
  const loadFields = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loadedFields = getFields();
      setFields(loadedFields);
    } catch (err) {
      console.error("필드 데이터 로드 중 오류 발생:", err);
      setError("필드 정보를 불러오는 중 오류가 발생했습니다.");
      message.error("필드 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 필드 저장
  const saveFieldData = useCallback(
    async (field: Field) => {
      try {
        const result = saveField(field);

        if (result.success) {
          await loadFields();
          return { success: true };
        } else {
          message.error("필드 저장 중 오류가 발생했습니다.");
          return { success: false };
        }
      } catch (err) {
        console.error("필드 저장 중 오류 발생:", err);
        message.error("필드 저장 중 오류가 발생했습니다.");
        return { success: false };
      }
    },
    [loadFields]
  );

  // 필드 삭제
  const removeField = useCallback(
    async (id: string) => {
      try {
        const result = deleteField(id);

        if (result.success) {
          await loadFields();
          message.success("필드가 삭제되었습니다.");
          return { success: true };
        } else {
          message.error("필드 삭제 중 오류가 발생했습니다.");
          return { success: false };
        }
      } catch (err) {
        console.error("필드 삭제 중 오류 발생:", err);
        message.error("필드 삭제 중 오류가 발생했습니다.");
        return { success: false };
      }
    },
    [loadFields]
  );

  // 초기 데이터 로드
  useEffect(() => {
    loadFields();
  }, [loadFields]);

  return {
    fields,
    loading,
    error,
    loadFields,
    saveFieldData,
    removeField,
  };
}
