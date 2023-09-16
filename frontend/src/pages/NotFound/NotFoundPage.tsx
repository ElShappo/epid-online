import React from 'react'
import { Empty, Row } from 'antd'
import "./NotFoundPage.css";
import Title from 'antd/es/typography/Title';

const NotFoundPage = () => {
  return (
    <Row className="NotFoundPage" justify='center' align='middle'>
      <Empty description={<Title level={3}>Page not found</Title>}/>
    </Row>
  )
}

export default NotFoundPage;