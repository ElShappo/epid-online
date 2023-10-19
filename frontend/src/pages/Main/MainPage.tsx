import { Button, Col, Layout, Row } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { Outlet, useNavigate } from "react-router-dom";
import './MainPage.css'
import {
  LineChartOutlined,
  TableOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import React, { useEffect, useRef, useState } from "react";

export const MainPage = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigate = useNavigate();
  const headerRef = useRef<any>(null);

  useEffect(() => {
    window.addEventListener('resize', (evt) => {
      setHeaderHeight(headerRef.current.clientHeight)
    });

    setHeaderHeight(headerRef.current.clientHeight)
  }, []);

  return (
    <Layout className="top-layout">
      <Header className="header" ref={headerRef}>
        <nav className="subjectsNav">
          <Row justify={"center"} align={"middle"} className="navRow">
            <Col sm={{ span: 24 }} md={{ span: 12 }} className="mainButtonCol">
              <Button ghost className="mainButton" onClick={() => navigate('/main')}>ТРЕКЕР НАСЕЛЕНИЯ РФ</Button>
            </Col>
            <Col sm={{ span: 24 }} md={{ span: 6, offset: 6 }}>
              <div className="buttonGroup">
                <Button icon={<TableOutlined />} onClick={() => navigate('subjects/2.1.')}>Таблица</Button>
                <Button icon={<LineChartOutlined />}>Графики</Button>
                <Button icon={<QuestionCircleOutlined />}>FAQ</Button>
              </div>
            </Col>
          </Row>
        </nav>
      </Header>

      <Content className="content">
        <Outlet context={headerHeight}/>
      </Content>

    </Layout>
  );
};
