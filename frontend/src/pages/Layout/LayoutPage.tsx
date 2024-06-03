import { useState } from "react";
import Header from "./components/Header/Header";
import Body from "./components/Body/Body";

const PageLayout = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  return (
    <div className="layout">
      <Header setHeaderHeight={setHeaderHeight} />
      <Body headerHeight={headerHeight} />
    </div>
  );
};

export default PageLayout;
