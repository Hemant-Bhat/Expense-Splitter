import type React from "react";
import { useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMembers, getGroup, getGroupExpenses } from "../../services/group";
import { Button, Col, Divider, Flex, Form, Input, Layout, Modal, Popover, Row, Spin, Table, theme, Typography, type ModalProps } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Link from "antd/es/typography/Link";
import { addExpenses } from "../../services/expense";
import { useForm, type FormInstance } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { GroupForm } from "../../components/GroupForm";
import { getUsers } from "../../services/user";
import { useSocketContext } from "../../providers/SocketProvider";
import { registerGroupEvents } from "../../sockets/group.socket";
import useApp from "antd/es/app/useApp";
import { isAxiosError } from "axios";

const Title = Typography.Title;
const Paragraph = Typography.Paragraph;

const Group: React.FC = () => {
    const {
        token: { colorBgContainer, colorBorderSecondary },
    } = theme.useToken();
    const { message, notification } = useApp();
    const { socket } = useSocketContext();
    const [isExpenseOpen, setIsExpenseOpen] = useState(false);
    const { groupId } = useParams({ from: "/_main/group/$groupId" });
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["group", groupId],
        queryFn: () => getGroup(groupId),
        enabled: !!groupId,
    });

    const { data: groupExpenses } = useQuery({
        queryKey: ["group", "expenses", groupId],
        queryFn: () => getGroupExpenses(groupId),
    });

    const { mutate } = useMutation({
        mutationFn: addExpenses,
        onSuccess(_data) {
            // const response = data?.data;
            // message.success(response?.message);
            setIsExpenseOpen(false);
        },
        onError(error) {
            if (isAxiosError(error)) {
                const response = error.response?.data;
                const allErrors = Object.values(response?.fieldErrors);
                message.error(allErrors as string[]);
            }
        },
    });

    const handleSubmit = (form: FormInstance) => {
        mutate({ groupId, ...form.getFieldsValue() });
        form.resetFields();
    };

    useEffect(() => {
        if (socket) {
            const unregister = registerGroupEvents({
                socket,
                groupId,
                handlers: {
                    onExpenseAdded(data) {
                        console.log(data);
                        const paidBy = data?.paidBy;
                        notification.info({ title: `${paidBy.name} added new expense!` });
                        queryClient.invalidateQueries({
                            queryKey: ["group", "expenses", groupId],
                        });
                    },
                    onMemberAdded(_value) {
                        queryClient.invalidateQueries({
                            queryKey: ["group", groupId],
                        });
                    },
                },
            });

            return () => unregister();
        }
    }, [socket, groupId]);

    if (isLoading) {
        return (
            <Spin
                size="large"
                style={{ width: "100%", minHeight: "200px", alignItems: "center", justifyContent: "center" }}
            />
        );
    }

    if (isError) {
        if (isAxiosError(error)) {
            const data = error.response?.data;
            return (
                <Paragraph
                    type="danger"
                    style={{ padding: 20, textAlign: "center" }}
                >
                    {data.message}
                </Paragraph>
            );
        } else {
            return (
                <Paragraph type="danger">
                    Something went wrong <pre>{JSON.stringify(error)}</pre>
                </Paragraph>
            );
        }
    }

    const response = data?.data;
    const { name, members, createdAt, creator } = response?.data || {};
    const expenseResponse = groupExpenses?.data;
    const expenseData = expenseResponse?.data;

    return (
        <>
            <Layout style={{ padding: 10 }}>
                <Header style={{ background: colorBgContainer, padding: 8, borderRadius: 8 }}>
                    <Title
                        level={4}
                        style={{ marginBottom: 0 }}
                    >
                        {name}
                    </Title>
                    <Flex
                        orientation="horizontal"
                        style={{ justifyContent: "space-between" }}
                    >
                        <Paragraph
                            type="secondary"
                            style={{ margin: 0 }}
                        >
                            Created By: {creator?.email} on {createdAt && new Date(createdAt).toLocaleDateString()}
                        </Paragraph>
                    </Flex>
                </Header>
                <Content>
                    <Row
                        gutter={[10, 10]}
                        style={{ marginTop: 10 }}
                    >
                        <Col
                            span={24}
                            md={16}
                            lg={18}
                        >
                            <Table
                                size="small"
                                bordered
                                pagination={false}
                                scroll={{ y: 55 * 5, x: 600 }}
                                title={() => (
                                    <Flex style={{ justifyContent: "space-between", alignItems: "center" }}>
                                        <Title level={5}>List of expenses</Title>
                                        <Button
                                            type="primary"
                                            onClick={() => setIsExpenseOpen(true)}
                                        >
                                            Add Expense
                                        </Button>
                                    </Flex>
                                )}
                                columns={[
                                    {
                                        key: "paidBy",
                                        title: "Payer",
                                        dataIndex: "paidBy",
                                        width: 200,
                                        render: (user, _b) => <>{user.email}</>,
                                    },
                                    { key: "amount", title: "Amount", dataIndex: "amount" },
                                    { key: "description", title: "Description", dataIndex: "description" },
                                    {
                                        key: "participants",
                                        title: "Participants",
                                        dataIndex: "participants",
                                        width: 200,
                                        render: (record, _) => <ParticipantsCell participants={record} />,
                                    },
                                ]}
                                rowKey={(e: any) => e?.expenseId}
                                dataSource={expenseData}
                                styles={{
                                    content: { borderRadius: 10 },
                                    title: {
                                        padding: 8,
                                    },
                                }}
                            />
                        </Col>
                        <Col
                            span={24}
                            md={8}
                            lg={6}
                            style={{ background: colorBgContainer, borderLeft: `1px solid ${colorBorderSecondary}`, borderRadius: 8, minHeight: 200 }}
                        >
                            <Flex style={{ padding: "8px 4px", justifyContent: "space-between", alignItems: "center" }}>
                                <Title
                                    level={5}
                                    style={{ margin: 0 }}
                                >
                                    Members
                                </Title>
                                <AddMemberForm
                                    groupId={groupId}
                                    members={members || []}
                                    groupName={name || ""}
                                />
                            </Flex>
                            <Divider style={{ margin: 0 }}></Divider>
                            {members?.map((member) => (
                                <Paragraph
                                    ellipsis
                                    key={member}
                                    style={{ margin: "2px 4px" }}
                                >
                                    {member}
                                </Paragraph>
                            ))}
                        </Col>
                    </Row>
                </Content>
            </Layout>

            <AddExpenseForm
                open={isExpenseOpen}
                handleOk={(form) => handleSubmit(form)}
                handleCancel={() => setIsExpenseOpen(false)}
            />
        </>
    );
};

export default Group;

const ParticipantsCell: React.FC<{ participants: any[] }> = ({ participants }) => {
    const visibleItems = participants.length > 2 ? participants.slice(0, 2) : participants;
    // const moreItems = participants.length > 2 ? participants.slice(2) : [];

    return (
        <>
            {visibleItems?.map((d) => (
                <p key={d.email}>{d.email}</p>
            ))}
            {/* moreItems.length > 1 && ( */}
            {participants.length > 0 && (
                <Popover
                    content={
                        <>
                            <Table
                                columns={[
                                    {
                                        title: "Email",
                                        key: "email",
                                        dataIndex: "email",
                                        width: 200,
                                    },
                                    {
                                        title: "Share",
                                        key: "share",
                                        dataIndex: "share",
                                        width: 90,
                                    },
                                    {
                                        title: "Paid",
                                        key: "paid",
                                        dataIndex: "paid",
                                        width: 90,
                                    },
                                    {
                                        title: "Owes",
                                        key: "owes",
                                        dataIndex: "owes",
                                        width: 90,
                                    },
                                ]}
                                dataSource={participants}
                                pagination={false}
                                size="small"
                                bordered
                                rowKey={(e) => e.id}
                                scroll={{ y: 55 * 2, x: 200 }}
                            />
                        </>
                    }
                    // placement="left"
                    styles={{
                        container: {
                            maxWidth: 500,
                            width: "auto",
                        },
                    }}
                    showArrow={false}
                >
                    <Link>More Info</Link>
                </Popover>
            )}
        </>
    );
};

const AddExpenseForm: React.FC<{
    open: boolean;
    handleOk: (form: FormInstance) => void;
    handleCancel: ModalProps["onCancel"];
}> = ({ open, handleOk, handleCancel }) => {
    const [form] = useForm();
    return (
        <>
            <Modal
                title="Add Expense"
                open={open}
                onOk={() => handleOk(form)}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name={"amount"}
                        label="Amount"
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name={"description"}
                        label="Description"
                    >
                        <Input type="text" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

const AddMemberForm: React.FC<{ groupId: string; groupName: string; members: string[] }> = ({ groupId, groupName, members }) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const { message } = useApp();

    const { data } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    const { mutateAsync } = useMutation({
        mutationFn: addMembers,
        mutationKey: ["group", "members", groupId],
        onSuccess(data) {
            const response = data?.data;

            queryClient.invalidateQueries({ queryKey: ["group", groupId] });
            message.success(response.message);
        },
    });

    const handleSubmit = async (form: FormInstance) => {
        await mutateAsync({ groupId, members: form.getFieldValue("members") });
        setOpen(false);
        form.resetFields();
    };

    const response = data?.data;
    const users = response?.data?.filter((user: any) => !members.includes(user.email)).map((user: any) => ({ label: user.email, value: user.email }));

    return (
        <>
            <Button
                color="primary"
                variant="solid"
                onClick={() => setOpen(true)}
            >
                Add Members
            </Button>

            <GroupForm
                open={open}
                onOk={(_e, form) => handleSubmit(form)}
                onCancel={() => setOpen(false)}
                users={users}
                okText="Add"
                title="Add Members"
                groupName={groupName}
            />
        </>
    );
};

// const useStyle = createStyles(({ css, token }) => {
//     const { antCls } = token;
//     return {
//         customTable: css`
//             ${antCls}-table {
//                 ${antCls}-table-container {
//                     ${antCls}-table-body,
//                     ${antCls}-table-content {
//                         scrollbar-width: thin;
//                         scrollbar-color: #eaeaea transparent;
//                     }
//                 }
//             }
//         `,
//     };
// });
