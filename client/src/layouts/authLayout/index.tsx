import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Layout style={{ minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>{children}</Layout>
    </>
  );
};

export default AuthLayout;
