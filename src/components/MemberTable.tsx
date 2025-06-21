import { useState, useEffect } from 'react';
import { Table, Button, Checkbox, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Record, Field } from '../types';
import { getRecords, saveRecords, getFields } from '../services/storage';

const MemberTable: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedRecords = getRecords();
        const loadedFields = getFields();
        setRecords(loadedRecords);
        setFields(loadedFields);
      } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 테이블 컬럼 생성
  const generateColumns = (): ColumnsType<Record> => {
    const columns: ColumnsType<Record> = fields.map((field) => {
      const column: ColumnsType<Record>[0] = {
        title: field.label,
        dataIndex: field.id,
        key: field.id,
        sorter: (a: Record, b: Record) => {
          if (field.type === 'number') {
            return Number(a[field.id] || 0) - Number(b[field.id] || 0);
          }
          const aValue = String(a[field.id] || '');
          const bValue = String(b[field.id] || '');
          return aValue.localeCompare(bValue);
        },
        filters: Array.from(new Set(records.map(record => record[field.id] !== undefined ? record[field.id] : '')))
          .map(value => ({ text: String(value), value: String(value) })),
        onFilter: (value, record: Record) => 
          String(record[field.id] || '') === String(value),
      };

      // 체크박스 필드 렌더링
      if (field.type === 'checkbox') {
        column.render = (value: boolean) => <Checkbox checked={value} disabled />;
      }

      return column;
    });

    // 액션 컬럼 추가
    columns.push({
      title: '',
      key: 'action',
      width: 50,
      render: (_: unknown, record: Record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: '수정',
                onClick: () => handleEdit(record),
              },
              {
                key: '2',
                label: '삭제',
                onClick: () => handleDelete(record.id),
              },
            ] as MenuProps['items']
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    });

    return columns;
  };

  // 레코드 수정 핸들러
  const handleEdit = (record: Record) => {
    console.log('수정:', record);
    // TODO: 수정 모달 구현
  };

  // 레코드 삭제 핸들러
  const handleDelete = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    saveRecords(updatedRecords);
  };

  // 레코드 추가 핸들러
  const handleAdd = () => {
    console.log('새 회원 추가');
    // TODO: 추가 모달 구현
  };

  return (
    <div className="member-table">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>회원 목록</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
        >
          추가
        </Button>
      </div>
      <Table
        columns={generateColumns()}
        dataSource={records}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default MemberTable;
