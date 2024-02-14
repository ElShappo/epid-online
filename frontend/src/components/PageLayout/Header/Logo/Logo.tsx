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
      <section>
        <div className="text-3xl">Epid-online</div>
        <i>Эпидемиологические расчеты в Вашем браузере</i>
      </section>
    </Button>
  );
};

export default Logo;
