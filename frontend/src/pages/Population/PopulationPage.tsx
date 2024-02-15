import React from "react";
import { TableOutlined, LineChartOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import PopulationCharts from "../../components/PopulationCharts/PopulationCharts";
import PopulationTable from "../../components/PopulationTable/PopulationTable";

const items = [
  {
    key: "1",
    label: "Таблица",
    icon: <TableOutlined />,
    children: <PopulationTable />,
  },
  {
    key: "2",
    label: "Графики",
    children: <PopulationCharts />,
    icon: <LineChartOutlined />,
  },
];

const PopulationPage: React.FC = () => (
  <Tabs centered size="large" defaultActiveKey="1" items={items} />
);

export default PopulationPage;
