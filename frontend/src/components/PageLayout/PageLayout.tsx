import Header from "./Header/Header";
import { useState } from "react";
import Body from "./Body/Body";

export const PageLayout = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  return (
    <div className="layout">
      <Header setHeaderHeight={setHeaderHeight} />
      <Body headerHeight={headerHeight} />
    </div>
  );
};
