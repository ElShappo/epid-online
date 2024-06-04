import { Button, Dropdown, Grid, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Settings from "./Settings/Settings";
import TerminalIcon from "@mui/icons-material/Terminal";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import HelpIcon from "@mui/icons-material/Help";

const { useBreakpoint } = Grid;

const Menu = () => {
  const screens = useBreakpoint() as any;
  const navigate = useNavigate();

  const size = screens.lg || screens.xl || screens.xxl ? "large" : screens.md ? "middle" : "small";

  const showHamburger = screens.lg ? false : true;

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button
          type="text"
          size={size}
          icon={<TerminalIcon fontSize="large" />}
          className="flex items-center h-auto text-xl"
          onClick={() => navigate(`/programs`)}
        >
          Программы
        </Button>
      ),
    },
    {
      key: "2",
      label: <Settings buttonSize={size} />,
    },
    {
      key: "3",
      label: (
        <Button
          className="flex items-center h-auto text-xl"
          size={size}
          type="text"
          icon={<HelpIcon fontSize="large" />}
          onClick={() => navigate("/faq")}
        >
          FAQ
        </Button>
      ),
    },
    {
      key: "4",
      label: (
        <Button
          size={size}
          type="text"
          href="https://github.com/ElShappo?tab=repositories"
          target="_blank"
          className="flex items-center no-underline h-auto text-xl"
          icon={<ContactPageIcon fontSize="large" />}
        >
          Контакты
        </Button>
      ),
    },
  ];

  // console.log(screens);

  if (showHamburger) {
    return (
      <Dropdown menu={{ items }} placement="bottomRight">
        <Button
          type="text"
          icon={<MenuIcon fontSize="large" />}
          className="hamburger-button px-8"
          size="large"
        ></Button>
      </Dropdown>
    );
  } else {
    return (
      <div className="flex justify-center flex-wrap gap-4 max-md:text-sm max-sm:w-auto">
        {items.map((item, index) => {
          return <span key={item?.key ?? index}>{(item as any).label}</span>;
        })}
      </div>
    );
  }
};

export default Menu;
