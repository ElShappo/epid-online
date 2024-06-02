import { useState } from "react";
import Header from "../../components/PageLayout/Header/Header";
import Body from "../../components/PageLayout/Body/Body";

export const PageLayout = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  return (
    <div className="layout">
      <Header setHeaderHeight={setHeaderHeight} />
      <Body headerHeight={headerHeight} />
    </div>
  );
};
