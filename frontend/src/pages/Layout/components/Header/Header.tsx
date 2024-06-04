import Menu from "./Menu/Menu";
import { useEffect, useRef } from "react";
import Logo from "./Logo/Logo";
import headerHeight from "../../../../store/headerHeight";
import { observer } from "mobx-react-lite";

const Header = observer(() => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const getTabsHeight = () => {
        headerHeight.set((ref.current! as HTMLElement).offsetHeight);
      };
      new ResizeObserver(getTabsHeight).observe(ref.current);
    }
  }, []);

  return (
    <header className=" bg-slate-800 p-6 max-ms:px-2" ref={ref}>
      <nav className="flex flex-wrap justify-center items-center content-center gap-y-1 gap-x-20 max-sm:gap-y-0 max-sm:gap-x-10">
        <Logo />
        <Menu />
      </nav>
    </header>
  );
});

export default Header;
