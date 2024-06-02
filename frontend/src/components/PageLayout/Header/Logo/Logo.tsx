import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <Button
      type="text"
      className="main-button max-md:text-xl max-sm:text-base max-sm:w-auto h-auto"
      onClick={() => navigate("/")}
    >
      <section className="flex flex-wrap justify-center items-center content-center gap-1">
        <img src="blue_logo_pixian_ai.png" width={80} height={74} />
        <div>
          <div className="text-3xl">Epid-online</div>
          <i className="max-sm:hidden">Эпидемиологические расчеты в Вашем браузере</i>
        </div>
      </section>
    </Button>
  );
};

export default Logo;
