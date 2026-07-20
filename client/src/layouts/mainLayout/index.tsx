import { Button, Layout, Menu, Typography } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useEffect, type ReactNode } from "react";
import { theme } from "antd";
import { LinkButton } from "../../components/link";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../services/admin";
import { useNavigate } from "@tanstack/react-router";
import { useSocketContext } from "../../providers/SocketProvider";
import useApp from "antd/es/app/useApp";

const MainLayout = ({ children }: { children: ReactNode }) => {
    const { useToken } = theme;
    const { token } = useToken();
    const { message } = useApp();
    const navigate = useNavigate();
    const { socket } = useSocketContext();

    useEffect(() => {
        socket?.connect();
    }, []);

    const { mutate } = useMutation({
        mutationFn: logout,
        mutationKey: ["logout"],
        onSuccess(data) {
            const response = data?.data;
            message.success(response.message);
            socket?.disconnect();
            navigate({ to: "/login" });
        },
    });

    return (
        <>
            <Layout style={{ minHeight: "100vh" }}>
                <Header style={{ display: "flex", background: token.colorBgContainer, alignItems: "center" }}>
                    <Typography
                        component="h3"
                        style={{ marginBlock: 12 }}
                    >
                        {/* Expense Spliiter */}E S
                    </Typography>

                    <Menu
                        mode="horizontal"
                        items={[
                            {
                                key: "me",
                                label: (
                                    <LinkButton
                                        type="link"
                                        to="/me"
                                    >
                                        Me
                                    </LinkButton>
                                ),
                            },
                            {
                                key: "dashboard",
                                label: (
                                    <LinkButton
                                        type="link"
                                        to="/dashboard"
                                    >
                                        Go to Dashboard
                                    </LinkButton>
                                ),
                            },
                        ]}
                        style={{ minWidth: 0, flex: 1, borderBottom: 0 }}
                    />

                    <Button
                        htmlType="button"
                        color="danger"
                        variant="filled"
                        onClick={() => mutate()}
                    >
                        Logout
                    </Button>
                </Header>
                <Content>{children}</Content>
                <Footer>
                    <Typography.Paragraph
                        strong
                        style={{ textAlign: "center" }}
                    >
                        Footer @ 2026
                    </Typography.Paragraph>
                </Footer>
            </Layout>
        </>
    );
};

export default MainLayout;
