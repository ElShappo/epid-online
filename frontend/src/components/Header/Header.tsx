import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import HeaderButtonGroup from "./ButtonGroup";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header h-[10vh] bg-slate-700">
      <nav className="nav-header h-full flex flex-wrap justify-center items-center content-center gap-20 max-md:gap-8 max-sm:gap-5">
        <Button
          ghost
          className="main-button text-2xl max-md:text-xl max-sm:text-base max-sm:w-auto h-auto"
          onClick={() => navigate("/main")}
        >
          ТРЕКЕР НАСЕЛЕНИЯ РФ
        </Button>
        <HeaderButtonGroup />
      </nav>
    </header>
  );
};

export default Header;
