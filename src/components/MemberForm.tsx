import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Button,
  message,
} from "antd";
import "./MemberForm.css";
import dayjs from "dayjs";
import type { Record, Field, ValidationError } from "../types";
import { validateFieldValue } from "../utils/validation";
import { saveRecord } from "../services/storage";

interface MemberFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  record?: Record;
  fields: Field[];
}

function MemberForm({
  visible,
  onClose,
  onSave,
  record,
  fields,
}: MemberFormProps) {
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

      // 저장 시도
      const result = saveRecord(recordToSave);

      if (result.success) {
        message.success(
          record ? "회원 정보가 수정되었습니다." : "새 회원이 추가되었습니다."
        );
        onSave();
        onClose();
      } else if (
        result.validationResult &&
        !result.validationResult.isValid &&
        result.validationResult.errors
      ) {
        // 유효성 검사 오류 표시
        const newErrors: { [key: string]: string } = {};
        result.validationResult.errors.forEach((error: ValidationError) => {
          newErrors[error.fieldId] = error.message;
        });
        setErrors(newErrors);
        message.error("입력 내용을 확인해주세요.");
      } else {
        message.error("저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("폼 제출 오류:", error);
      message.error("입력 내용을 확인해주세요.");
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
    const error = errors[field.id];
    const isRequired = field.required;

    switch (field.type) {
      case "text":
        // 메모 필드는 TextArea로 렌더링
        if (field.id === "memo") {
          return (
            <Form.Item
              key={field.id}
              name={field.id}
              label={field.label}
              validateStatus={error ? "error" : undefined}
              help={error}
              required={isRequired}
              rules={[{ required: isRequired }]}
            >
              <Input.TextArea
                rows={4}
                className="memo-textarea"
                onChange={(e) => validateField(field.id, e.target.value)}
              />
            </Form.Item>
          );
        }

        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            validateStatus={error ? "error" : undefined}
            help={error}
            required={isRequired}
            rules={[{ required: isRequired }]}
          >
            <Input onChange={(e) => validateField(field.id, e.target.value)} />
          </Form.Item>
        );

      case "number":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            validateStatus={error ? "error" : undefined}
            help={error}
            required={isRequired}
            rules={[{ required: isRequired }]}
          >
            <Input
              type="number"
              placeholder={`${field.label}을(를) 입력하세요`}
              onChange={(e) =>
                validateField(
                  field.id,
                  e.target.value ? Number(e.target.value) : null
                )
              }
            />
          </Form.Item>
        );

      case "date":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            validateStatus={error ? "error" : undefined}
            help={error}
            required={isRequired}
            rules={[{ required: isRequired }]}
          >
            <DatePicker
              className="join-date-picker"
              onChange={(date) =>
                validateField(field.id, date ? date.format("YYYY-MM-DD") : null)
              }
              allowClear={true}
            />
          </Form.Item>
        );

      case "select":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            validateStatus={error ? "error" : undefined}
            help={error}
            required={isRequired}
            rules={[{ required: isRequired }]}
          >
            <Select
              className={field.id === "job" ? "job-select" : ""}
              placeholder={`${field.label}을(를) 선택하세요`}
              options={field.options?.map((option) => ({
                label: option,
                value: option,
              }))}
              onChange={(value) => validateField(field.id, value)}
              defaultValue={
                field.id === "job" && field.options && field.options.length > 0
                  ? field.options[0]
                  : field.defaultValue
              }
            />
          </Form.Item>
        );

      case "checkbox":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            valuePropName="checked"
            validateStatus={error ? "error" : undefined}
            help={error}
            label={field.id === "emailConsent" ? "이메일 수신 동의" : ""}
            rules={[{ required: isRequired }]}
          >
            <Checkbox
              onChange={(e) => validateField(field.id, e.target.checked)}
            >
              {field.id === "emailConsent" ? "" : field.label}
            </Checkbox>
          </Form.Item>
        );

      default:
        return null;
    }
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
