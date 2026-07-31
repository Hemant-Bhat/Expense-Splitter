import { Outlet } from "@tanstack/react-router";
import { Layout } from "antd";

const AuthLayout = () => {
    return (
        <>
            <Layout style={{ minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
                <Outlet />
            </Layout>
        </>
    );
};

export default AuthLayout;
