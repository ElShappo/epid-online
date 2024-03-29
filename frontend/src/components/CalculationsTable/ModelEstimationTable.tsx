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
  },
  {
    title: "Совокупная абс. заболеваемость",
    dataIndex: "totalMorbidity",
  },
  {
    title: "Совокупная инт. заболеваемость",
    dataIndex: "totalIntensiveMorbidity",
  },
  {
    title: "Параметр λ",
    dataIndex: "lambda",
  },
  {
    title: "Параметр c",
    dataIndex: "c",
  },
  {
    title: "Контактное число",
    dataIndex: "contactNumber",
  },
  {
    title: "Различие фактической и модельной кривой заболеваемости",
    dataIndex: "absoluteError",
  },
];

type ModelEstimationTableProps = {
  data: ModelEstimationTableColumns[];
};

const ModelEstimationTable = ({ data }: ModelEstimationTableProps) => {
  return <Table bordered pagination={false} dataSource={data} columns={columns} />;
};

export default ModelEstimationTable;
