import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input } from 'antd';
import './AuthorizationPage.css'
import { useDispatch } from 'react-redux';
import { authorize, unauthorize } from '../../globalStore/authorizationSlice';
import { message } from 'antd';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const AuthorizationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';

  function showAuthorizationLoading() {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
  }

  function showAuthorizationError(errorText: string) {
    messageApi.open({
      key,
      type: 'error',
      content: errorText,
    });
  };

  const onFinish = async (values: any) => {
    console.log('Passing values:');
    console.log(values);
    console.log(JSON.stringify(values));

    try {
      showAuthorizationLoading();
      let response = await fetch('http://localhost:3002/authorization', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        console.log('Authorization successful!');
        dispatch(authorize() );
        navigate('/main');
      } else {
        const errorText = 'Invalid username or password';
        showAuthorizationError(errorText);
        console.error(errorText);
        dispatch(unauthorize() );
      }
    } catch (error) {
      const errorText = 'Something went wrong';
      showAuthorizationError(errorText);
      console.error(errorText);
      dispatch(unauthorize() );
    }
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='authorization'>
      {contextHolder}
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
  )
}

export default AuthorizationPage