import type { Field } from "../types";
import { DEFAULT_FIELD_IDS } from "../types";

// 기본 필드 정의
export const DEFAULT_FIELDS: Field[] = [
  {
    id: DEFAULT_FIELD_IDS.NAME,
    type: "text",
    label: "이름",
    required: true,
    constraints: {
      maxLength: 50,
    },
    description: "회원의 이름을 입력하세요",
    defaultValue: "",
  },
  {
    id: DEFAULT_FIELD_IDS.ADDRESS,
    type: "text",
    label: "주소",
    required: false,
    constraints: {
      maxLength: 20,
    },
    description: "회원의 주소를 입력하세요",
    defaultValue: "",
  },
  {
    id: DEFAULT_FIELD_IDS.MEMO,
    type: "text",
    label: "메모",
    required: false,
    constraints: {
      maxLength: 50,
    },
    description: "회원에 대한 추가 정보를 입력하세요",
    defaultValue: "",
  },
  {
    id: DEFAULT_FIELD_IDS.JOIN_DATE,
    type: "date",
    label: "가입일",
    required: true,
    constraints: {
      minDate: new Date("2000-01-01"),
      maxDate: new Date("2099-12-31"),
    },
    description: "회원 가입 날짜를 선택하세요",
    defaultValue: undefined,
  },
  {
    id: DEFAULT_FIELD_IDS.JOB,
    type: "select",
    label: "직업",
    required: false,
    options: ["개발자", "PO", "디자이너", "마케터", "영업", "기타"],
    description: "회원의 직업을 선택하세요",
    defaultValue: "기타",
  },
  {
    id: DEFAULT_FIELD_IDS.EMAIL_CONSENT,
    type: "checkbox",
    label: "이메일 수신 동의",
    required: false,
    description: "마케팅 이메일 수신에 동의하시면 체크하세요",
    defaultValue: false,
  },
];
