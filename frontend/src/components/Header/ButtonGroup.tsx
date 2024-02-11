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
import { defaultYear } from "../../constants";

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
          onClick={() => navigate(`subjects/${defaultYear}`)}
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
          onClick={() => navigate(`charts/${defaultYear}`)}
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
          className="hamburger-button px-8"
          size={size}
        ></Button>
      </Dropdown>
    );
  } else {
    return (
      <div className="button-group flex justify-center flex-wrap gap-4">
        {items.map((item) => (item as any).label)}
      </div>
    );
  }
};

export default HeaderButtonGroup;
