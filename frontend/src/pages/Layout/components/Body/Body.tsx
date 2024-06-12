import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loader from "../../../../components/Loader/Loader";
import headerHeight from "../../../../store/headerHeight";
import { getRemainingHeightString } from "../../../../utils";
import { observer } from "mobx-react-lite";

const Body = observer(() => {
  console.log(`Header height = ${headerHeight.get()}`);
  const remainingHeight = getRemainingHeightString(headerHeight.get());

  return (
    <main className="overflow-y-auto px-4 box-border" style={{ height: remainingHeight }}>
      <Suspense fallback=<Loader text="Идёт загрузка..." height={remainingHeight} />>
        <Outlet />
      </Suspense>
    </main>
  );
});

export default Body;
