import { Outlet } from "react-router-dom";
import './MainPage.css'
import Header from "../../components/Header/Header";

export const MainPage = () => {
  
  return (
    <div className="layout">
      <Header />
      <main className="main">
        <Outlet />
      </main>

    </div>
  );
};