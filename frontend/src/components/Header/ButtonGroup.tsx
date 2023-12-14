import { Button, Dropdown, Grid, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LineChartOutlined,
  TableOutlined,
  QuestionCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import "./ButtonGroup.css";
import Settings from "../Settings";

const { useBreakpoint } = Grid;

const HeaderButtonGroup = () => {
  const screens = useBreakpoint() as any;
  const navigate = useNavigate();

  const size =
    screens.lg || screens.xl || screens.xxl
      ? "large"
      : screens.md
      ? "middle"
      : "small";

  const showHamburger = screens.lg || screens.xl || screens.xxl ? false : true;

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button
          type="primary"
          size={size}
          icon={<TableOutlined />}
          onClick={() => navigate("subjects/2.1.")}
        >
          Таблица
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button
          size={size}
          type="primary"
          icon={<LineChartOutlined />}
          onClick={() => navigate("charts")}
        >
          Графики
        </Button>
      ),
    },
    {
      key: "3",
      label: <Settings buttonSize={size} />,
    },
    {
      key: "4",
      label: (
        <Button size={size} type="primary" icon={<QuestionCircleOutlined />}>
          FAQ
        </Button>
      ),
    },
  ];

  console.log(screens);

  if (showHamburger) {
    return (
      <Dropdown menu={{ items }} placement="bottomRight">
        <Button
          type="primary"
          icon={<MenuOutlined />}
          className="hamburger-button"
          size={size}
        ></Button>
      </Dropdown>
    );
  } else {
    return (
      <div className="button-group">
        {items.map((item) => (item as any).label)}
      </div>
    );
  }
};

export default HeaderButtonGroup;
