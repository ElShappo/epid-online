import Menu from "./Menu/Menu";
import { useEffect, useRef } from "react";
import Logo from "./Logo/Logo";

type HeaderProps = {
  setHeaderHeight: React.Dispatch<React.SetStateAction<number>>;
};

const Header = ({ setHeaderHeight }: HeaderProps) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const getTabsHeight = () => {
        console.log((ref.current! as HTMLElement).offsetHeight);
        setHeaderHeight((ref.current! as HTMLElement).offsetHeight);
      };
      new ResizeObserver(getTabsHeight).observe(ref.current);
    }
  }, [setHeaderHeight]);

  return (
    <header className="header bg-slate-800 p-8" ref={ref}>
      <nav className="nav-header h-full flex flex-wrap justify-center items-center content-center gap-20 max-md:gap-y-4 max-sm:gap-y-0">
        <Logo />
        <Menu />
      </nav>
    </header>
  );
};

export default Header;
