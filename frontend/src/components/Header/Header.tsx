import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import HeaderButtonGroup from "./ButtonGroup";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header bg-slate-800 p-8">
      <nav className="nav-header h-full flex flex-wrap justify-center items-center content-center gap-20 max-md:gap-8 max-sm:gap-5">
        <Button
          type="text"
          className="main-button max-md:text-xl max-sm:text-base max-sm:w-auto h-auto"
          onClick={() => navigate("/main")}
        >
          <section>
            <div className="text-3xl">Epid-online</div>
            <i>Эпидемиологические расчеты в Вашем браузере</i>
          </section>
        </Button>
        <HeaderButtonGroup />
      </nav>
    </header>
  );
};

export default Header;
