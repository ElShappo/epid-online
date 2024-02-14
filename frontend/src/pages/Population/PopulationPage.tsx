import React from "react";
import { TableOutlined, LineChartOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import ChartsPage from "../Charts/ChartsPage";
import RegionsPage from "../../components/PopulationTable/PopulationTable";

const items = [
  {
    key: "1",
    label: "Таблица",
    icon: <TableOutlined />,
    children: <RegionsPage />,
  },
  {
    key: "2",
    label: "Графики",
    children: <ChartsPage />,
    icon: <LineChartOutlined />,
  },
];

const PopulationPage: React.FC = () => (
  <Tabs centered size="large" defaultActiveKey="1" items={items} />
);

export default PopulationPage;
