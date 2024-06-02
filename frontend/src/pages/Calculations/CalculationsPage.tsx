import React from "react";
import { TableOutlined, LineChartOutlined, CalculatorOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import CalculationsTable from "../../components/CalculationsTable/CalculationsTable";
import CalculationsCharts from "../../components/CalculationsCharts/CalculationsCharts";
import CalculationsIntervals from "../../components/CalculationsIntervals/CalculationsIntervals";

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
  {
    key: "3",
    label: "Калькулятор доверит. интервалов для Пуассона",
    children: <CalculationsIntervals />,
    icon: <CalculatorOutlined />,
  },
];

const PopulationPage: React.FC = () => <Tabs centered size="large" defaultActiveKey="1" items={items} />;

export default PopulationPage;
