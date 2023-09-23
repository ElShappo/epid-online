import { Table } from 'antd'

const TableComponent = (props: any) => {
  if (props.columns) {
    return (
      <Table
        columns={props.columns}
        dataSource={props.rows || undefined}
        bordered
        scroll={{ y: "240px" }}
      />
    )
  } else {
    return (
      <Table
        columns={props.columns}
        dataSource={props.rows || undefined}
        bordered
        scroll={{ x: true, y: "240px" }}
      />
    )
  }
}

export default TableComponent