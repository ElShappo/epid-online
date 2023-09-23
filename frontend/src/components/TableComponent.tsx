import { Table } from 'antd'
import React, { useState } from 'react'
import { useAsyncValue } from 'react-router-dom';

const TableComponent = (props: any) => {
  const worksheets = useAsyncValue() as any;
  const [rows, setRows] = useState(props.rows);
  return (
    <Table
      columns={props.columns}
      dataSource={rows}
      bordered
      size="middle"
      scroll={{ x: 'calc(700px + 50%)', y: 240 }}
    />
  )
}

export default TableComponent