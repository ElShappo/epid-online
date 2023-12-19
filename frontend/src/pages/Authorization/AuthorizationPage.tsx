import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input } from "antd";
import "./AuthorizationPage.css";
import { message } from "antd";
import authorization from "../../globalStore/authorization";
import { observer } from "mobx-react-lite";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const AuthorizationPage = observer(() => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  function showAuthorizationLoading() {
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
  }

  function showAuthorizationError(errorText: string) {
    messageApi.open({
      key,
      type: "error",
      content: errorText,
    });
  }

  const onFinish = async (values: any) => {
    console.log("Passing values:");
    console.log(values);
    console.log(JSON.stringify(values));

    try {
      showAuthorizationLoading();
      const response = await fetch("http://localhost:3002/authorization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Authorization successful!");
        authorization.authorize();
        navigate("/main");
      } else {
        const errorText = "Invalid username or password";
        showAuthorizationError(errorText);
        console.error(errorText);
        authorization.unauthorize();
      }
    } catch (error) {
      const errorText = "Something went wrong";
      showAuthorizationError(errorText);
      console.error(errorText);
      authorization.unauthorize();
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="authorization">
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
          label="Логин"
          name="username"
          rules={[{ required: true, message: "Введите свой логин" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Введите свой пароль" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Запомнить</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Подтвердить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default AuthorizationPage;
