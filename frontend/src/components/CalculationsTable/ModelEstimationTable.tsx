import { Table, TableProps } from "antd";

export type ModelEstimationTableColumns = {
  key: string;
  type: string;
  totalMorbidity: number;
  totalIntensiveMorbidity: number;
  lambda: number;
  c: number;
  contactNumber: number;
  absoluteError: number;
};

const columns: TableProps<ModelEstimationTableColumns>["columns"] = [
  {
    title: "Тип",
    dataIndex: "type",
    width: 120,
    align: "center",
  },
  {
    title: "Совокупная абс. заболеваемость",
    dataIndex: "totalMorbidity",
    width: 150,
    align: "center",
  },
  {
    title: "Совокупная инт. заболеваемость",
    dataIndex: "totalIntensiveMorbidity",
    width: 150,
    align: "center",
  },
  {
    title: "Параметр λ",
    dataIndex: "lambda",
    width: 150,
    align: "center",
  },
  {
    title: "Параметр c",
    dataIndex: "c",
    width: 150,
    align: "center",
  },
  {
    title: "Контактное число",
    dataIndex: "contactNumber",
    width: 150,
    align: "center",
  },
  {
    title: "Различие фактической и модельной кривой заболеваемости",
    dataIndex: "absoluteError",
    width: 150,
    align: "center",
  },
];

type ModelEstimationTableProps = {
  data: ModelEstimationTableColumns[];
};

const ModelEstimationTable = ({ data }: ModelEstimationTableProps) => {
  return <Table bordered pagination={false} dataSource={data} columns={columns} scroll={{ y: 500 }} />;
};

export default ModelEstimationTable;
