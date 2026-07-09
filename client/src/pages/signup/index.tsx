import axios from "axios";
import { Button, Form, Input, Divider, Card, Space, App, ConfigProvider, theme } from "antd";
import { LinkButton } from "../../components/link";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../services/admin";
import { useNavigate } from "@tanstack/react-router";

const Signup = () => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: signup,
        mutationKey: ["signup"],
        onError(error) {
            if (axios.isAxiosError(error)) {
                const { status, response } = error;

                if (status == 409) {
                    form.setFields([
                        {
                            name: "email",
                            errors: [response?.data?.message],
                        },
                    ]);
                } else if (status == 400) {
                    const fieldErrors = response?.data?.fieldErrors || null;
                    if (fieldErrors) {
                        if (Object.keys(fieldErrors).includes("email")) {
                            form.setFields([
                                {
                                    name: "email",
                                    errors: [fieldErrors["email"]],
                                },
                            ]);
                        } else if (Object.keys(fieldErrors).includes("password")) {
                            form.setFields([
                                {
                                    name: "password",
                                    errors: [fieldErrors["password"]],
                                },
                            ]);
                        } else {
                            form.setFields([
                                {
                                    name: "password",
                                    errors: [" "],
                                },
                                {
                                    name: "confirmPassword",
                                    errors: [fieldErrors["confirmPassword"]],
                                },
                            ]);
                        }
                    }
                }
            }
        },
        onSuccess(response) {
            const { data } = response;
            message.success(data?.message, 10);
            navigate({ to: "/login" });
        },
    });

    const handleSubmit = () => {
        const { email, password, confirmPassword } = form.getFieldsValue();
        mutate({ email, password, confirmPassword });
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
                        name="confirmPassword"
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
                                Sign Up
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
