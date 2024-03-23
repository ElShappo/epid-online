import { Table } from "antd";
import { CalculationCategoriesType } from "../../types";
import { useEffect, useState } from "react";

type DataType = {
  key: string;
  type?: string;
  lambda?: number;
  c?: number;
  contactNumber?: number;
  absoluteError?: number;
};

const columns = [
  {
    title: "Тип",
    dataIndex: "type",
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
  hasSexRecognition: boolean;
  objLambda?: CalculationCategoriesType;
  objC?: CalculationCategoriesType;
  objContactNumber?: CalculationCategoriesType;
  objAbsoluteError?: CalculationCategoriesType;
};

const ModelEstimationTable = ({
  hasSexRecognition,
  objLambda,
  objC,
  objContactNumber,
  objAbsoluteError,
}: ModelEstimationTableProps) => {
  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    const res = [];
    const keys = hasSexRecognition
      ? [
          "Russia",
          "menRussia",
          "womenRussia",
          "ChosenRegions",
          "menChosenRegions",
          "womenChosenRegions",
        ]
      : ["Russia", "ChosenRegions"];

    let index = 1;
    for (const key of keys as (keyof CalculationCategoriesType)[]) {
      res.push({
        key: String(index),
        type: key,
        lambda: objLambda?.[key],
        c: objC?.[key],
        contactNumber: objContactNumber?.[key],
        absoluteError: objAbsoluteError?.[key],
      });
      ++index;
    }
    setRows(res);
  }, [hasSexRecognition, objLambda, objC, objContactNumber, objAbsoluteError]);
  return (
    <Table bordered pagination={false} dataSource={rows} columns={columns} />
  );
};

export default ModelEstimationTable;
