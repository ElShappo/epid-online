import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import "./ProgramCard.css";
import { useNavigate } from "react-router-dom";

const ProgramCard = ({
  name,
  description,
  icon,
  url,
}: {
  name: string;
  description: string;
  icon: string;
  url: string;
}) => {
  const navigate = useNavigate();

  return (
    <Card key={name} hoverable className="max-w-72" cover={<img alt="Фото" src={icon} />} onClick={() => navigate(url)}>
      <Meta title={name} description={description} className="max-h-48" />
    </Card>
  );
};

export default ProgramCard;
