import { useQuery } from "@tanstack/react-query";
import { me } from "../../services/admin";
import { Card, Spin, Typography } from "antd";
import CardMeta from "antd/es/card/CardMeta";

const { Text } = Typography;

const Profile = () => {
    const { data, isLoading, isError } = useQuery({ queryKey: ["me"], queryFn: me });
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
