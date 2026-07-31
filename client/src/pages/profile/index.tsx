import { useQuery } from "@tanstack/react-query";
import { Card, Spin, Typography } from "antd";
import CardMeta from "antd/es/card/CardMeta";
import { Route } from "../../routes/_main";

const { Text } = Typography;

const Profile = () => {
    const { auth } = Route.useRouteContext();

    const { data, isLoading, isError } = useQuery({ queryKey: ["me"], queryFn: auth.me });
    if (isLoading) {
        return <Spin />;
    }

    if (isError) {
        return <Text type="danger">There was some error !</Text>;
    }
    return (
        <>
            <Card>
                <CardMeta title={data?.data.user.email} />
            </Card>
        </>
    );
};

export default Profile;
