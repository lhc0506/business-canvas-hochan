import React from "react";
import { Input, DatePicker, Select, Checkbox } from "antd";
import type { Field, FieldValue } from "../../types";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import dayjs from "dayjs";
import "./styles.css";

interface FieldInputProps {
  field: Field;
  value?: FieldValue;
  onChange?: (value: FieldValue) => void;
  error?: string;
}

/**
 * 필드 타입에 따른 입력 컴포넌트 렌더링
 */
export function FieldInput({ field, value, onChange, error }: FieldInputProps) {
  const handleChange = (val: FieldValue) => {
    if (onChange) {
      onChange(val);
    }
  };

  // 필드 타입별 특수 처리를 위한 핸들러
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleChange(e.target.value);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    handleChange(date ? date.format("YYYY-MM-DD") : undefined);
  };

  const handleSelectChange = (value: string) => {
    handleChange(value);
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    handleChange(e.target.checked);
  };

  switch (field.type) {
    case "text":
      if (field.id === "memo") {
        return (
          <Input.TextArea
            className="memo-textarea"
            value={value as string}
            onChange={handleTextChange}
            status={error ? "error" : ""}
          />
        );
      }
      return (
        <Input
          value={value as string}
          onChange={handleTextChange}
          status={error ? "error" : ""}
        />
      );

    case "date":
      return (
        <DatePicker
          className="date-picker"
          value={typeof value === "string" && value ? dayjs(value) : undefined}
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          allowClear={true}
          status={error ? "error" : ""}
        />
      );

    case "select":
      return (
        <Select
          className="select-field"
          value={value as string}
          onChange={handleSelectChange}
          options={field.options?.map((option) => ({
            value: option,
            label: option,
          }))}
          status={error ? "error" : ""}
        />
      );

    case "checkbox":
      return (
        <Checkbox checked={Boolean(value)} onChange={handleCheckboxChange} />
      );

    default:
      return <Input value={value as string} onChange={handleTextChange} />;
  }
}

export default FieldInput;
