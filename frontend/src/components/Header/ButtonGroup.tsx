import React from "react";
import { Button, Dropdown, Grid, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LineChartOutlined,
  TableOutlined,
  QuestionCircleOutlined,
  MenuOutlined
} from "@ant-design/icons";
import './ButtonGroup.css'

const { useBreakpoint } = Grid;


const HeaderButtonGroup = () => {
  const screens = useBreakpoint() as any;
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button icon={<TableOutlined />} onClick={() => navigate('subjects/2.1.')}>Таблица</Button>
      )
    },
    {
      key: '2',
      label: (
        <Button icon={<LineChartOutlined />}>Графики</Button>
      )
    },
    {
      key: '3',
      label: (
        <Button icon={<QuestionCircleOutlined />}>FAQ</Button>
      )
    },
  ];

  console.log(screens);

  if (!screens.lg && !screens.xl && !screens.xxl) {
    return (
      <Dropdown menu={{ items }} placement="bottomRight">
        {
          screens.md 
            ? <Button type="primary" icon={<MenuOutlined />} className="hamburger-button" size="large"></Button>
            : <Button type="primary" icon={<MenuOutlined />} className="hamburger-button"></Button>
        }
      </Dropdown>
    )
  } else {
    return (
      <div className="button-group">
        {items.map(item => (item as any).label)}
      </div>
    );
  }

};

export default HeaderButtonGroup;
