import { Button, Layout, Menu, Typography } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useEffect } from "react";
import { theme } from "antd";
import { LinkButton } from "../../components/link";
import { useMutation } from "@tanstack/react-query";
import { Outlet, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useSocketContext } from "../../providers/SocketProvider";
import useApp from "antd/es/app/useApp";

const ITEMS = [
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
        key: "allGroups",
        label: (
            <LinkButton
                type="link"
                to="/groups/all"
            >
                All Groups
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
];

const MainLayout = () => {
    const { useToken } = theme;
    const { token } = useToken();
    const { message } = useApp();
    const navigate = useNavigate();
    const { socket } = useSocketContext();
    const { auth, user } = useRouteContext({ from: "/_main" });

    useEffect(() => {
        socket?.connect();
    }, []);

    const { mutate } = useMutation({
        mutationFn: auth.logout,
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
                        items={ITEMS}
                        style={{ minWidth: 0, flex: 1, borderBottom: 0 }}
                    />
                    <Typography.Text
                        title={user.email}
                        style={{ width: "110px" }}
                        ellipsis
                    >
                        {user.email}
                    </Typography.Text>
                    <Button
                        htmlType="button"
                        color="danger"
                        variant="filled"
                        onClick={() => mutate()}
                    >
                        Logout
                    </Button>
                </Header>
                <Content>
                    <Outlet />
                </Content>
                <Footer>
                    <Typography.Paragraph style={{ textAlign: "center" }}>All rights reseverd @ 2026</Typography.Paragraph>
                </Footer>
            </Layout>
        </>
    );
};

export default MainLayout;
