import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <Button type="text" className="h-auto" onClick={() => navigate("/")}>
      <section className="flex flex-wrap justify-center items-center content-center gap-1">
        <img src="blue_logo_pixian_ai.png" width={80} height={74} />
        <div>
          <h1 className="text-3xl font-normal pb-1 pl-1">Epid-online</h1>
          <i className="text-base max-sm:hidden">Эпидемиологические расчеты в Вашем браузере</i>
        </div>
      </section>
    </Button>
  );
};

export default Logo;
