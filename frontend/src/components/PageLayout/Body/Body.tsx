import { Outlet } from "react-router-dom";

type BodyProps = {
  headerHeight: number;
};
const Body = ({ headerHeight }: BodyProps) => {
  console.log(headerHeight);
  return (
    <div
      className="overflow-y-auto px-4 box-border"
      style={{ height: `calc(100vh - ${headerHeight}px)` }}
    >
      <Outlet context={headerHeight} />
    </div>
  );
};

export default Body;
