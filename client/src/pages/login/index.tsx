import { Button, Form, Input, Divider, Card, Space } from "antd";
import { LinkButton } from "../../components/link";

const Login = () => {
  const [form] = Form.useForm();
  const handleSubmit = () => {
    const { email, password } = form.getFieldsValue();
    console.log()
  };

  return (
    <>
      <Card style={{ width: 360 }}>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Divider>Login</Divider>
          <Form.Item
            label="Email"
            name={"email"}
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              type={"text"}
              placeholder={"Enter email"}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input
              type={"password"}
              placeholder={"Enter password"}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Button
                variant="solid"
                color="primary"
                htmlType="submit"
              >
                Login
              </Button>
              <LinkButton to="/signup">New user?</LinkButton>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Login;
