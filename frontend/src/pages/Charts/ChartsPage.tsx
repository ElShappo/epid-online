import React from "react";
import {Tabs} from 'antd';

const steps = [
  {
    title: 'First',
    content: 'Для каждого из выбранных регионов будут построены графики',
  },
  {
    title: 'Second',
    content: 'Укажите виды графиков, которые вы хотите построить',
  },
  {
    title: 'Last',
    content: 'Итог',
  },
];

const ChartsPage = () => {
  return (
  <Tabs
    defaultActiveKey="1"
    centered
    items={new Array(3).fill(null).map((_, i) => {
      const id = String(i + 1);
      return {
        label: `Tab ${id}`,
        key: id,
        children: `Content of Tab Pane ${id}`,
      };
    })}
  />)
};

export default ChartsPage;
