import { isAxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Divider, Card, Space } from "antd";
import { login } from "../../services/admin";
import { LinkButton } from "../../components/link";

const Login = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { mutate, isPending } = useMutation({
        mutationKey: ["login"],
        mutationFn: login,
        onError(error, _variables, _onMutateResult, _context) {
            if (isAxiosError(error)) {
                const { status, response } = error;

                if (status == 401) {
                    form.setFields([
                        { name: "email", errors: [" "] },
                        {
                            name: "password",
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
                        }
                    }
                }
            }
        },
        onSuccess(_data, _variables, _onMutateResult, _context) {
            navigate({ to: "/me" });
        },
    });

    const handleSubmit = async () => {
        const { email, password } = form.getFieldsValue();
        mutate({ email, password });
    };

    return (
        <>
            <Card style={{ width: 360 }}>
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    disabled={isPending}
                    layout="vertical"
                    autoComplete="off"
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
                            autoComplete="off"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        status="validating"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your password",
                            },
                        ]}
                    >
                        <Input
                            type={"password"}
                            placeholder={"Enter password"}
                            autoComplete="off"
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
                                to="/signup"
                                disabled={isPending}
                            >
                                New user?
                            </LinkButton>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default Login;
