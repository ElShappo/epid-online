import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import React from "react";
import HeaderButtonGroup from "./ButtonGroup";
import './Header.css'

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <nav className="nav-header">
        <Button
          ghost
          className="main-button"
          onClick={() => navigate("/main")}
        >
          ТРЕКЕР НАСЕЛЕНИЯ РФ
        </Button>
        <HeaderButtonGroup />
      </nav>
    </header>
  );
};

export default Header;
