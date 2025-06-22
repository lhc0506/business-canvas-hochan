import type {
  Field,
  Record,
  ValidationResult,
  ValidationError,
} from "../types";

/**
 * 필드 값이 필드 정의에 따라 유효한지 검사합니다.
 * @param field 필드 정의
 * @param value 검사할 값
 * @returns 유효성 검사 결과와 오류 메시지
 */
export const validateFieldValue = (
  field: Field,
  value: unknown
): { isValid: boolean; error?: string } => {
  // 필수 필드 검사
  if (
    field.required &&
    (value === undefined || value === null || value === "")
  ) {
    return { isValid: false, error: `${field.label}은(는) 필수 항목입니다.` };
  }

  // 값이 없고 필수가 아니면 유효함
  if (
    (value === undefined || value === null || value === "") &&
    !field.required
  ) {
    return { isValid: true };
  }

  // 타입별 유효성 검사
  switch (field.type) {
    case "text": {
      if (typeof value !== "string") {
        return {
          isValid: false,
          error: `${field.label}은(는) 문자열이어야 합니다.`,
        };
      }

      // 제약조건 검사
      if (field.constraints) {
        if (
          field.constraints.minLength !== undefined &&
          value.length < field.constraints.minLength
        ) {
          return {
            isValid: false,
            error: `${field.label}은(는) 최소 ${field.constraints.minLength}자 이상이어야 합니다.`,
          };
        }

        if (
          field.constraints.maxLength !== undefined &&
          value.length > field.constraints.maxLength
        ) {
          return {
            isValid: false,
            error: `${field.label}은(는) 최대 ${field.constraints.maxLength}자까지 입력 가능합니다.`,
          };
        }

        if (
          field.constraints.pattern &&
          !new RegExp(field.constraints.pattern).test(value)
        ) {
          return {
            isValid: false,
            error: `${field.label} 형식이 올바르지 않습니다.`,
          };
        }
      }
      break;
    }

    case "number": {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return {
          isValid: false,
          error: `${field.label}은(는) 숫자여야 합니다.`,
        };
      }

      // 제약조건 검사
      if (field.constraints) {
        if (
          field.constraints.min !== undefined &&
          numValue < field.constraints.min
        ) {
          return {
            isValid: false,
            error: `${field.label}은(는) ${field.constraints.min} 이상이어야 합니다.`,
          };
        }

        if (
          field.constraints.max !== undefined &&
          numValue > field.constraints.max
        ) {
          return {
            isValid: false,
            error: `${field.label}은(는) ${field.constraints.max} 이하여야 합니다.`,
          };
        }
      }
      break;
    }

    case "date": {
      const dateValue = new Date(String(value));
      if (isNaN(dateValue.getTime())) {
        return {
          isValid: false,
          error: `${field.label}은(는) 유효한 날짜여야 합니다.`,
        };
      }

      // 제약조건 검사
      if (field.constraints) {
        if (
          field.constraints.minDate &&
          dateValue < field.constraints.minDate
        ) {
          return {
            isValid: false,
            error: `${
              field.label
            }은(는) ${field.constraints.minDate.toLocaleDateString()} 이후여야 합니다.`,
          };
        }

        if (
          field.constraints.maxDate &&
          dateValue > field.constraints.maxDate
        ) {
          return {
            isValid: false,
            error: `${
              field.label
            }은(는) ${field.constraints.maxDate.toLocaleDateString()} 이전이어야 합니다.`,
          };
        }
      }
      break;
    }

    case "select": {
      if (!field.options?.includes(String(value))) {
        return {
          isValid: false,
          error: `${field.label}은(는) 유효한 옵션이어야 합니다.`,
        };
      }
      break;
    }

    case "checkbox": {
      if (typeof value !== "boolean") {
        return {
          isValid: false,
          error: `${field.label}은(는) 체크박스여야 합니다.`,
        };
      }
      break;
    }
  }

  return { isValid: true };
};

/**
 * 레코드의 모든 필드 값이 유효한지 검사합니다.
 * @param record 검사할 레코드
 * @param fields 필드 정의 배열
 * @returns 유효성 검사 결과
 */
export const validateRecord = (
  record: Record,
  fields: Field[]
): ValidationResult => {
  const errors: ValidationError[] = [];

  // 모든 필드에 대해 유효성 검사
  fields.forEach((field) => {
    const value = record[field.id];
    const result = validateFieldValue(field, value);

    if (!result.isValid && result.error) {
      errors.push({
        fieldId: field.id,
        message: result.error,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 레코드 배열의 모든 레코드가 유효한지 검사합니다.
 * @param records 검사할 레코드 배열
 * @param fields 필드 정의 배열
 * @returns 유효성 검사 결과
 */
export const validateRecords = (
  records: Record[],
  fields: Field[]
): ValidationResult => {
  const errors: ValidationError[] = [];

  records.forEach((record, index) => {
    const result = validateRecord(record, fields);
    if (!result.isValid) {
      // 레코드 인덱스 정보 추가
      result.errors.forEach((error) => {
        errors.push({
          fieldId: `${index}.${error.fieldId}`,
          message: `레코드 #${index + 1}: ${error.message}`,
        });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
