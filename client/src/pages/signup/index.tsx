import { Button, Form, Input, Divider, Card } from "antd";

const Signup = () => {
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
          <Divider>Sign Up</Divider>
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
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input
              type={"password"}
              placeholder={"Enter password"}
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="cnfPassword"
            rules={[{ required: true, message: "Please enter cofirm password" }]}
          >
            <Input
              type={"password"}
              placeholder={"Enter confirm password"}
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

export default Signup;
