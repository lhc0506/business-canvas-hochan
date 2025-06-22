import { useState } from "react";
import { Table, Button, Checkbox, Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import "./MemberTable.css";
import type { ColumnsType } from "antd/es/table";
import type { Record } from "../types";
import MemberForm from "./MemberForm";
import { useRecords } from "../hooks/useRecords";

function MemberTable() {
  // 커스텀 훅을 사용하여 레코드 관리
  const { records, fields, loading, loadData, removeRecord } = useRecords();
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<Record | undefined>(
    undefined
  );

  // 테이블 컬럼 생성
  const generateColumns = (): ColumnsType<Record> => {
    const columns: ColumnsType<Record> = fields.map((field) => {
      const column: ColumnsType<Record>[0] = {
        title: field.label,
        dataIndex: field.id,
        key: field.id,
        filters: Array.from(
          new Set(
            records.map((record) =>
              record[field.id] !== undefined ? record[field.id] : ""
            )
          )
        ).map((value) => ({ text: String(value), value: String(value) })),
        onFilter: (value, record: Record) =>
          String(record[field.id] || "") === String(value),
      };

      // 체크박스 필드 렌더링
      if (field.type === "checkbox") {
        column.render = (value: boolean) => (
          <Checkbox
            checked={value}
            onChange={() => {}}
            style={{ pointerEvents: "none" }}
          />
        );
      }

      return column;
    });

    // 액션 컬럼 추가
    columns.push({
      title: "",
      key: "action",
      width: 50,
      render: (_: unknown, record: Record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "수정",
                onClick: () => handleEdit(record),
                className: "edit-action",
              },
              {
                key: "2",
                label: "삭제",
                onClick: () => handleDelete(record.id),
                className: "delete-action",
                danger: true,
              },
            ] as MenuProps["items"],
          }}
          trigger={["click"]}
          overlayClassName="member-action-dropdown"
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    });

    return columns;
  };

  // 레코드 수정 핸들러
  const handleEdit = (record: Record) => {
    setCurrentRecord(record);
    setFormVisible(true);
  };

  // 레코드 삭제 핸들러
  const handleDelete = async (id: string) => {
    const result = await removeRecord(id);
    if (!result.success) {
      message.error("회원 삭제 중 오류가 발생했습니다.");
    }
  };

  // 레코드 추가 핸들러
  const handleAdd = () => {
    setCurrentRecord(undefined);
    setFormVisible(true);
  };

  // 폼 닫기 핸들러
  const handleFormClose = () => {
    setFormVisible(false);
  };

  // 저장 완료 후 데이터 새로고침
  const handleSaveComplete = () => {
    loadData();
  };

  return (
    <div className="member-table">
      <div className="member-table-header">
        <h2 className="member-table-title">회원 목록</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          추가
        </Button>
      </div>
      <Table
        columns={generateColumns()}
        dataSource={records}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      {/* 회원 추가/수정 폼 */}
      <MemberForm
        visible={formVisible}
        onClose={handleFormClose}
        onSave={handleSaveComplete}
        record={currentRecord}
      />
    </div>
  );
}

export default MemberTable;
