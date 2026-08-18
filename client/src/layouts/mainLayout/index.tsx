import { Button, Layout, Menu, Typography } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useEffect } from "react";
import { theme } from "antd";
import { LinkButton } from "../../components/link";
import { useMutation } from "@tanstack/react-query";
import { Outlet, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useSocketContext } from "../../providers/SocketProvider";
import useApp from "antd/es/app/useApp";
import { registerNotificationEvent } from "../../sockets/notification.socket";

const ITEMS = [
    // {
    //     key: "me",
    //     label: (
    //         <LinkButton
    //             type="link"
    //             to="/me"
    //         >
    //             Me
    //         </LinkButton>
    //     ),
    // },
    {
        key: "allGroups",
        label: (
            <LinkButton
                type="link"
                to="/groups/all"
                style={{ height: "100%" }}
            >
                Groups
            </LinkButton>
        ),
    },
    {
        key: "dashboard",
        label: (
            <LinkButton
                type="link"
                to="/dashboard"
                style={{ height: "100%" }}
            >
                Dashboard
            </LinkButton>
        ),
    },
    {
        key: "analyze",
        label: (
            <LinkButton
                type="link"
                to="/reports"
                style={{ height: "100%" }}
            >
                Reports
            </LinkButton>
        ),
    },
];

const MainLayout = () => {
    const { useToken } = theme;
    const { token } = useToken();
    const { message, notification } = useApp();
    const navigate = useNavigate();
    const { socket } = useSocketContext();
    const { auth, user } = useRouteContext({ from: "/_main" });

    useEffect(() => {
        if (socket) {
            socket?.connect();

            const unregister = registerNotificationEvent({
                socket,
                handlers: {
                    onNotificationUpdate(value) {
                        notification.open({ title: "Notification", description: value?.content, closable: true, closeIcon: <h1>&times;</h1>, duration: false });
                    },
                },
            });

            return () => {
                unregister();
            };
        }
    }, [socket]);

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
                <Header style={{ position: "sticky", top: 0, zIndex: 1, display: "flex", boxShadow: token.boxShadowTertiary, background: token.colorBgContainer, alignItems: "center" }}>
                    <Typography
                        component="h3"
                        style={{ marginBlock: 12, color: "red", fontSize: "2.5rem" }}
                    >
                        {/* Expense Spliiter */}ム
                    </Typography>

                    <Menu
                        mode="horizontal"
                        items={ITEMS}
                        style={{ minWidth: 0, flex: 1, borderBottom: 0 }}
                        styles={{
                            item: {
                                padding: 0,
                            },
                            itemContent: {
                                height: "100%",
                                paddingInline: "10px",
                                display: "inline-block",
                            },
                        }}
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
