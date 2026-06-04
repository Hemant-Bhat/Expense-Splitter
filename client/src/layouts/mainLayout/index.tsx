import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import type { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Layout>
        <Header>Header</Header>
        <Content>{children}</Content>
        <Footer>Footer @ 2026</Footer>
      </Layout>
    </>
  );
};

export default MainLayout;
