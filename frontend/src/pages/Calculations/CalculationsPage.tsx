import React from "react";
import { TableOutlined, LineChartOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import CalculationsTable from "../../components/CalculationsTable/CalculationsTable";
import CalculationsCharts from "../../components/CalculationsCharts/CalculationsCharts";

const items = [
  {
    key: "1",
    label: "Таблица",
    icon: <TableOutlined />,
    children: <CalculationsTable />,
  },
  {
    key: "2",
    label: "Графики",
    children: <CalculationsCharts />,
    icon: <LineChartOutlined />,
  },
];

const PopulationPage: React.FC = () => (
  <Tabs centered size="large" defaultActiveKey="1" items={items} />
);

export default PopulationPage;
