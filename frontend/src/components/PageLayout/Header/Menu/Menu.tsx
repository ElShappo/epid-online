import { Button, Dropdown, Grid, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { QuestionCircleOutlined, MenuOutlined } from "@ant-design/icons";
import Settings from "./Settings/Settings";
import { defaultYear } from "../../../../constants";
import PeopleIcon from "@mui/icons-material/People";

const { useBreakpoint } = Grid;

const Menu = () => {
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
          type="text"
          size={size}
          icon={<PeopleIcon />}
          className="flex"
          onClick={() => navigate(`/population`)}
        >
          Население
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
        <Button size={size} type="text" icon={<QuestionCircleOutlined />}>
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
          type="text"
          icon={<MenuOutlined />}
          className="hamburger-button px-8"
          size={size}
        ></Button>
      </Dropdown>
    );
  } else {
    return (
      <div className="button-group flex justify-center flex-wrap gap-4 max-md:text-sm max-sm:w-auto">
        {items.map((item, index) => {
          return <span key={item?.key ?? index}>{(item as any).label}</span>;
        })}
      </div>
    );
  }
};

export default Menu;
