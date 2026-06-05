import { Layout, Typography } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import type { ReactNode } from "react";
import { theme } from "antd";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ background: token.colorBgContainer, alignItems: "center" }}>
          <Typography
            component="h3"
            style={{ marginBlock: 12 }}
          >
            Expense Spliiter
          </Typography>
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
