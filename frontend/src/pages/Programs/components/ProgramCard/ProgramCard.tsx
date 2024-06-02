import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import "./ProgramCard.css";
import { useNavigate } from "react-router-dom";
import { fallbackImg } from "../../../../constants";
import { ProgramDetails } from "../../../../types";

const ProgramCard = ({ name, description, icon, url }: ProgramDetails) => {
  const navigate = useNavigate();

  return (
    <Card
      key={name}
      hoverable
      className="max-w-72"
      cover={<img alt="Фото" src={icon || fallbackImg} onError={(e) => (e.currentTarget.src = fallbackImg)} />}
      onClick={() => navigate(url)}
    >
      <Meta title={name} description={description || <i>Нет описания</i>} className="max-h-48" />
    </Card>
  );
};

export default ProgramCard;
