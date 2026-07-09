import GroupCard from "../../components/GroupCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGroup, getAllGroups } from "../../services/group";
import { Button, Flex, Space, Spin, Typography, type FormInstance } from "antd";
import { GroupForm } from "../../components/GroupForm";
import { useState } from "react";
import { isAxiosError } from "axios";
import useApp from "antd/es/app/useApp";
import { getUsers } from "../../services/user";
import type { User } from "../../types/user";

const Text = Typography.Text;
const Title = Typography.Title;

const Dashboard = () => {
    const { message } = useApp();
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createGroup,
        mutationKey: ["group-create"],
        onSuccess(_data, _variables, _onMutateResult, _context) {
            message.success("Group created successfully");
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            setOpen(false);
        },
        onError(error, _variables, _onMutateResult, _context) {
            if (isAxiosError(error)) {
                const { data } = error?.response;
                if (data.code == "VALIDATION_ERROR") {
                    message.error(data.fieldErrors.name);
                }
            }
        },
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ["groups"],
        queryFn: getAllGroups,
    });

    const { data: userData } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    const response = data?.data;

    const userList = userData?.data?.data?.map((user: User) => ({ label: user.email, value: user.email }));

    const handleSubmit = (form: FormInstance) => {
        console.dir(form.getFieldsValue());

        mutate(form.getFieldsValue());
    };

    if (isLoading) {
        return <Spin />;
    }

    if (isError) {
        return <Text type="danger">There was some error !</Text>;
    }

    return (
        <>
            <Flex
                vertical
                style={{ padding: 15, alignContent: "center", justifyContent: "end" }}
            >
                <Flex style={{ alignContent: "center", justifyContent: "end" }}>
                    <Button
                        type="primary"
                        onClick={() => setOpen(true)}
                    >
                        Create Group
                    </Button>
                </Flex>

                <Space
                    style={{ width: "100%" }}
                    align="baseline"
                    wrap
                >
                    {response?.data?.map((group: any) => (
                        <GroupCard
                            key={group.id}
                            groupId={group.id}
                            name={group.name}
                            memberList={group.members}
                        />
                    ))}

                    {response?.data?.length == 0 ? (
                        <Title
                            level={4}
                            type="secondary"
                            style={{ textAlign: "center", width: "100%" }}
                        >
                            No groups
                        </Title>
                    ) : null}
                </Space>
            </Flex>

            <GroupForm
                open={open}
                onOk={(_e, form) => handleSubmit(form)}
                onCancel={() => setOpen(false)}
                users={userList}
            />
        </>
    );
};

export default Dashboard;
