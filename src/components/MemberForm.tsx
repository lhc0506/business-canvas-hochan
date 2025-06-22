import { useState, useEffect } from "react";
import { Modal, Form, Button } from "antd";
import "./MemberForm.css";
import dayjs from "dayjs";
import type { Record, ValidationResult, Field } from "../types";
import { validateFieldValue } from "../utils/validation";
import { FormField } from "./FormFields";
import { useRecords } from "../hooks/useRecords";
import { useFields } from "../hooks/useFields";

interface MemberFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  record?: Record;
}

function MemberForm({ visible, onClose, onSave, record }: MemberFormProps) {
  // 커스텀 훅을 사용하여 필드 정보 관리
  const { fields } = useFields();
  const { saveRecordData } = useRecords();
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // 모달이 열리거나 닫힐 때 폼 초기화
  useEffect(() => {
    if (visible) {
      if (record) {
        // 수정 모드: 기존 레코드 값으로 폼 초기화
        const formValues: { [key: string]: unknown } = {};

        fields.forEach((field) => {
          if (field.type === "date" && record[field.id]) {
            formValues[field.id] = record[field.id]
              ? dayjs(record[field.id] as string)
              : undefined;
          } else {
            formValues[field.id] = record[field.id];
          }
        });

        form.setFieldsValue(formValues);
      } else {
        // 추가 모드: 기본값으로 폼 초기화
        const defaultValues: { [key: string]: unknown } = {};

        fields.forEach((field) => {
          // 직업 필드의 경우 기본값을 첫 번째 옵션으로 설정
          if (field.id === "job" && field.options && field.options.length > 0) {
            defaultValues[field.id] = field.options[0];
          }
          // 가입일 필드는 기본값을 설정하지 않음
          else if (field.id === "joinDate") {
            // 가입일 필드에는 기본값을 설정하지 않음
          }
          // 나머지 필드는 기본값 설정
          else if (field.defaultValue !== undefined) {
            if (
              field.type === "date" &&
              typeof field.defaultValue === "string"
            ) {
              defaultValues[field.id] = dayjs(field.defaultValue);
            } else {
              defaultValues[field.id] = field.defaultValue;
            }
          }
        });

        form.setFieldsValue(defaultValues);
      }

      setErrors({});
    } else {
      // 모달이 닫힐 때 폼 초기화
      form.resetFields();
    }
  }, [visible, record, fields, form]);

  // 필드 값 변경 시 유효성 검사
  const validateField = (fieldId: string, value: unknown) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return true;

    const result = validateFieldValue(field, value);
    if (!result.isValid && result.error) {
      setErrors((prev: { [key: string]: string }) => ({
        ...prev,
        [fieldId]: result.error as string,
      }));
      return false;
    } else {
      setErrors((prev: { [key: string]: string }) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
      return true;
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      // 날짜 값을 문자열로 변환
      const formattedValues: { [key: string]: unknown } = {};
      Object.entries(values).forEach(([key, value]) => {
        if (dayjs.isDayjs(value)) {
          formattedValues[key] = value.format("YYYY-MM-DD");
        } else {
          formattedValues[key] = value;
        }
      });

      // 레코드 ID 설정
      const recordToSave: Record = {
        id: record?.id || `record-${Date.now()}`,
        ...formattedValues,
      };

      // 저장 시도 - 커스텀 훅 사용
      const result = await saveRecordData(recordToSave);

      if (result.success) {
        onSave();
        onClose();
      } else if (
        result.validationResult &&
        !result.validationResult.isValid &&
        result.validationResult.errors
      ) {
        // 유효성 검사 오류 표시
        const newErrors: { [key: string]: string } = {};
        result.validationResult.errors.forEach((error) => {
          newErrors[error.fieldId] = error.message;
        });
        setErrors(newErrors);
      }
    } catch (error: unknown) {
      console.error("폼 제출 오류:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 폼에 에러가 있거나 필수 필드가 비어있는지 확인
  const hasErrors = () => {
    if (Object.keys(errors).length > 0) return true;

    // 필수 필드가 비어있는지 확인
    const formValues = form.getFieldsValue();
    for (const field of fields) {
      if (field.required && !formValues[field.id]) {
        return true;
      }
    }

    return false;
  };

  // 필드 렌더링 함수
  const renderField = (field: Field) => {
    const validationResult: ValidationResult = {
      isValid: !errors[field.id],
      errors: errors[field.id]
        ? [{ fieldId: field.id, message: errors[field.id] }]
        : [],
    };

    return (
      <FormField
        key={field.id}
        field={field}
        validationResult={validationResult}
        onChange={(value) => validateField(field.id, value)}
      />
    );
  };

  return (
    <Modal
      title={record ? "회원 정보 수정" : "회원 추가"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          취소
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={handleSubmit}
          disabled={hasErrors()}
        >
          {record ? "수정" : "추가"}
        </Button>,
      ]}
      width={600}
      maskClosable={false}
      className="member-form"
    >
      <Form
        form={form}
        layout="vertical"
        name="memberForm"
        initialValues={{
          // 가입일 필드는 초기값을 명시적으로 undefined로 설정
          joinDate: undefined,
        }}
      >
        {fields.map(renderField)}
      </Form>
    </Modal>
  );
}

export default MemberForm;
