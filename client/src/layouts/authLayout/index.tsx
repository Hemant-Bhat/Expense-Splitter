import { Outlet } from "@tanstack/react-router";
import { Layout, Typography } from "antd";

const AuthLayout = () => {
    return (
        <>
            <Layout style={{ minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
                <Typography
                    component="h2"
                    style={{ marginBlock: 12, color: "red", fontSize: "3.5rem" }}
                >
                    {/* Expense Spliiter */}ム
                </Typography>
                <Outlet />
            </Layout>
        </>
    );
};

export default AuthLayout;
