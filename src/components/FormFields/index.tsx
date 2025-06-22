import { Form } from "antd";
import type { Field, ValidationResult, FieldValue } from "../../types";
import { FieldInput } from "./FieldInput";
import "./styles.css";

interface FormFieldProps {
  field: Field;
  value?: FieldValue;
  onChange?: (value: FieldValue) => void;
  validationResult?: ValidationResult;
}

/**
 * Form.Item으로 감싼 필드 컴포넌트
 */
export function FormField({
  field,
  value,
  onChange,
  validationResult,
}: FormFieldProps) {
  // 해당 필드에 대한 오류 메시지 찾기
  const fieldError = validationResult?.errors?.find(
    (error) => error.fieldId === field.id
  );

  return (
    <Form.Item
      label={field.label}
      name={field.id}
      required={field.required}
      validateStatus={fieldError ? "error" : undefined}
      help={fieldError?.message}
      className={`form-field ${
        field.type === "checkbox" ? "checkbox-field" : ""
      }`}
    >
      <FieldInput
        field={field}
        value={value}
        onChange={onChange}
        error={fieldError?.message}
      />
    </Form.Item>
  );
}

export default FormField;
