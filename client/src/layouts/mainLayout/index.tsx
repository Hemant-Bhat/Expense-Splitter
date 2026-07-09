import { Layout, Menu, Typography } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import type { ReactNode } from "react";
import { theme } from "antd";
import { LinkButton } from "../../components/link";

const MainLayout = ({ children }: { children: ReactNode }) => {
    const { useToken } = theme;
    const { token } = useToken();

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
                        style={{ minWidth: 0, flex: 1 }}
                    />
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
