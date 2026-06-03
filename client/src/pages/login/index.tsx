import { Button, Form, Input, Divider, Card } from "antd";

const Login = () => {
  const [form] = Form.useForm();
  // const email = Form.useWatch("email", form);
  const handleSubmit = () => {
    form.setFieldsValue({ password: "1111" });
    form.setFieldValue("email", "hemantbhaqqt");
  };

  return (
    <>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        style={{ maxWidth: 360 }}
      >
        <Card>
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
          <Form.Item>
            <Button
              variant="solid"
              color="primary"
              htmlType="submit"
            >
              Login
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </>
  );
};

export default Login;
