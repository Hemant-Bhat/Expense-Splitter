import { Button, Form, Input, Divider, Card, Space } from "antd";
import { LinkButton } from "../../components/link";

const Signup = () => {
  const [form] = Form.useForm();
  // const email = Form.useWatch("email", form);
  const handleSubmit = () => {
    form.setFieldsValue({ password: "1111" });
    form.setFieldValue("email", "hemantbhaqqt");
  };

  return (
    <>
      <Card>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          style={{ width: 360 }}
        >
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
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Button
                variant="solid"
                color="primary"
                htmlType="submit"
              >
                Login
              </Button>
              <LinkButton
                to="/login"
                type="primary"
              >
                Existing user?
              </LinkButton>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Signup;
