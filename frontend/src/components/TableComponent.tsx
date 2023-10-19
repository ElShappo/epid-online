import { Table } from 'antd'

const TableComponent = (props: any) => {
  if (props.columns) {
    return (
      <Table
        className='mainTable'
        columns={props.columns}
        dataSource={props.rowsWithoutSummary}
        bordered
        scroll={{ y: `${props.height}` }}
        pagination={false}
        summary={() => {
          if (props.summary) {
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>Summary</Table.Summary.Cell>

                  <Table.Summary.Cell index={1}>{props.summary['malesFemalesAll']}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>{props.summary['malesAll']}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>{props.summary['femalesAll']}</Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>{props.summary['proportionAll']}</Table.Summary.Cell>

                  <Table.Summary.Cell index={5}>{props.summary['malesFemalesCity']}</Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>{props.summary['malesCity']}</Table.Summary.Cell>
                  <Table.Summary.Cell index={7}>{props.summary['femalesCity']}</Table.Summary.Cell>
                  <Table.Summary.Cell index={8}>{props.summary['proportionCity']}</Table.Summary.Cell>

                  <Table.Summary.Cell index={9}>{props.summary['malesFemalesRural']}</Table.Summary.Cell>
                  <Table.Summary.Cell index={10}>{props.summary['malesRural']}</Table.Summary.Cell>
                  <Table.Summary.Cell index={11}>{props.summary['femalesRural']}</Table.Summary.Cell>
                  <Table.Summary.Cell index={12}>{props.summary['proportionRural']}</Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          } else {
            return undefined;
          }
        }
        }
      />
    )
  } else {
    return (
      <Table
        columns={props.columns}
        dataSource={undefined}
      />
    )
  }
}

export default TableComponent