import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Flex, Form, Input, Modal, Row, Spin, Table, theme, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getPayable, getReceivable, notifyToParticipant, payExpenseAmount } from "../../services/balance";
import type { BaseButtonProps } from "antd/es/button/Button";
import { useForm } from "antd/es/form/Form";
import useApp from "antd/es/app/useApp";
import { isAxiosError } from "axios";
import { useSocketContext } from "../../providers/SocketProvider";
import { registerBalanceEvents } from "../../sockets/balance.socket";
import { useRouteContext } from "@tanstack/react-router";
import type { Currency } from "../../types/currency";

const Dashboard = () => {
    return (
        <>
            <PayableCard />
            <ReceivableCard />
        </>
    );
};

const PayableCard: React.FC = () => {
    const { message } = useApp();
    // const { socket } = useSocketContext();
    const {
        user: { currency },
    } = useRouteContext({ from: "/_main" });
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["paybale"],
        queryFn: getPayable,
    });
    const [payModal, setPayModal] = useState<{ expenseId: string; owes: number; paid: number; share: number; [key: string]: any } | null>(null);
    const PAYABLE_COLUMNS = [
        {
            key: "paidBy",
            title: "Paid By",
            dataIndex: "paidBy",
        },
        { key: "groupName", title: "Group Name", dataIndex: "groupName" },
        { key: "amount", title: "Amount", dataIndex: "amount" },
        { key: "description", title: "Description", dataIndex: "description" },
        { key: "share", title: "Share", dataIndex: "share" },
        { key: "owes", title: "Owes", dataIndex: "owes" },
        { key: "paid", title: "Paid", dataIndex: "paid" },
        {
            key: "action",
            title: "Action",
            render: (value: any) => (
                <>
                    <Button
                        variant="solid"
                        color="primary"
                        onClick={() => handlePay(value)}
                    >
                        Pay
                    </Button>
                </>
            ),
        },
    ];

    // useEffect(() => {
    //     if (socket) {
    //         const unregister = registerBalanceEvents({
    //             socket,
    //             handlers: {
    //                 onPayableUpdate(data) {
    //                     notification.info({
    //                         title: "Payment Received",
    //                         description: (
    //                             <Typography.Paragraph>
    //                                 <Typography.Text strong>{data?.payer}</Typography.Text> paid the amount
    //                                 <Typography.Text strong>
    //                                     {" "}
    //                                     {data?.amount}
    //                                     {currency.symbol}{" "}
    //                                 </Typography.Text>{" "}
    //                                 to you
    //                             </Typography.Paragraph>
    //                         ),
    //                         duration: false,
    //                     });
    //                     refetch();
    //                 },
    //             },
    //         });

    //         return () => {
    //             unregister();
    //         };
    //     }
    // }, []);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: payExpenseAmount,
    });

    const handlePay = (values: any) => {
        setPayModal(values);
    };

    const submitPay = async (values: any) => {
        try {
            const { amount } = values;
            await mutateAsync({ expenseId: payModal?.expenseId as string, amount });
            refetch();
            message.success(`You have paid amount ${currency.symbol} ${amount}`);
            setPayModal(null);
        } catch (error) {
            if (isAxiosError(error)) {
                const { response } = error;
                if (response?.status == 400) {
                    const errors = Object.values(response.data.fieldErrors || []);
                    message.error(errors.join(", "));
                }
            } else {
                message.error("Something went wrong");
            }
        }
    };

    const response = data?.data;
    const payableData = response?.data;
    return (
        <>
            <Card
                title={
                    <CardHeader
                        title={`You owe: ${currency.symbol} ${payableData?.totalOwes || 0} `}
                        btnText="Pay All"
                    />
                }
                style={{ margin: 10 }}
                size="middle"
            >
                <Table
                    columns={PAYABLE_COLUMNS}
                    dataSource={payableData?.expenses || []}
                    loading={isLoading}
                    rowKey={"expenseId"}
                    pagination={false}
                    scroll={{ y: 55 * 5 }}
                    bordered
                />
            </Card>

            <PayModal
                open={Boolean(payModal)}
                expense={payModal}
                onClose={() => setPayModal(null)}
                onFinish={(values) => submitPay(values)}
                isLoading={isPending}
                currency={currency}
            />
        </>
    );
};

const PayModal: React.FC<{
    open: boolean;
    isLoading: boolean;
    onFinish: (values: { amount: number }) => void;
    onClose: () => void;
    expense: {
        expenseId: string;
        owes: number;
        paid: number;
        share: number;
    } | null;
    currency: Currency;
}> = ({ open, onClose, onFinish, expense, isLoading, currency }) => {
    const [form] = useForm();
    const { token } = theme.useToken();

    useEffect(() => {
        if (expense) {
            form.setFieldsValue({ amount: expense?.owes });
        }
    }, [expense, form]);

    return (
        <>
            <Modal
                title="Pay"
                okText="Pay"
                open={open}
                onCancel={() => onClose()}
                onOk={() => form.submit()}
                okButtonProps={{ disabled: isLoading }}
                cancelButtonProps={{ disabled: isLoading }}
                mask={{ closable: !isLoading }}
                keyboard={!isLoading}
                closable={false}
            >
                <Spin spinning={isLoading}>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={(values) => onFinish?.(values)}
                        disabled={isLoading}
                    >
                        <Row
                            style={{
                                margin: "10px 0",
                                background: token.colorPrimaryBg,
                                border: `1px solid ${token.colorPrimaryBorder} `,
                                borderRadius: token.borderRadius,
                            }}
                        >
                            <Col
                                span={8}
                                style={{ padding: "5px 10px" }}
                            >
                                <p>
                                    Your share
                                    <br />
                                    <span style={{ fontWeight: "500" }}>
                                        {" "}
                                        {currency.symbol} {expense?.share}
                                    </span>
                                </p>
                            </Col>
                            <Col
                                span={8}
                                style={{ padding: "5px 10px" }}
                            >
                                <p>
                                    You paid
                                    <br />
                                    <span style={{ fontWeight: "500" }}>
                                        {currency.symbol} {expense?.paid}
                                    </span>
                                </p>
                            </Col>
                            <Col
                                span={8}
                                style={{ padding: "5px 10px" }}
                            >
                                <p>
                                    You owe
                                    <br />
                                    <span style={{ fontWeight: "500" }}>
                                        {currency.symbol} {expense?.owes}
                                    </span>
                                </p>
                            </Col>
                        </Row>

                        <Form.Item
                            label={"Enter amount"}
                            name={"amount"}
                        >
                            <Input
                                type={"number"}
                                max={expense?.owes}
                                min={0}
                                prefix={currency.symbol}
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
};

const ReceivableCard: React.FC = () => {
    const { notification } = useApp();
    const { socket } = useSocketContext();
    const {
        user: { currency },
    } = useRouteContext({ from: "/_main" });
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["receivable"],
        queryFn: getReceivable,
    });
    const { mutate } = useMutation({
        mutationFn: notifyToParticipant,
    });
    const RECEIVE_COLUMNS = [
        {
            key: "member",
            title: "Member",
            render: (value: any) => value.participant["email"],
        },
        // { key: "groupName", title: "Group Name", dataIndex: "groupName" },
        { key: "amount", title: "Amount", dataIndex: "amount" },
        { key: "description", title: "Description", dataIndex: "description" },
        { key: "share", title: "Share", render: (value: any) => value.participant["share"] },
        { key: "owes", title: "Owes", render: (value: any) => value.participant["owes"] },
        { key: "paid", title: "Paid", render: (value: any) => value.participant["paid"] },
        {
            key: "action",
            title: "Action",
            render: (value: any) => (
                <>
                    <Button
                        variant="solid"
                        color="pink"
                        onClick={() => mutate({ expenseId: value?.expenseId, participantEmail: value?.participant?.email })}
                    >
                        Notify
                    </Button>
                </>
            ),
        },
    ];
    useEffect(() => {
        if (socket) {
            const unregister = registerBalanceEvents({
                socket,
                handlers: {
                    onReceivableUpdate(data) {
                        notification.info({
                            title: "Payment Received",
                            description: (
                                <Typography.Paragraph>
                                    <Typography.Text strong>{data?.payer}</Typography.Text> paid the amount
                                    <Typography.Text strong>
                                        {" "}
                                        {currency.symbol} {data?.amount}
                                    </Typography.Text>{" "}
                                    to you
                                </Typography.Paragraph>
                            ),
                            duration: false,
                        });

                        refetch();
                    },
                },
            });

            return () => {
                unregister();
            };
        }
    }, []);
    const response = data?.data;
    const receivableData = response?.data;
    return (
        <>
            <Card
                title={
                    <CardHeader
                        title={`You are owed: ${currency.symbol} ${receivableData?.totalOwed || 0}`}
                        btnText="Notify All"
                        btnColor="pink"
                    />
                }
                style={{ margin: 10 }}
                size="middle"
            >
                <Table
                    columns={RECEIVE_COLUMNS}
                    dataSource={receivableData?.receivables || []}
                    loading={isLoading}
                    rowKey={"_id"}
                    scroll={{ y: 55 * 5 }}
                    pagination={false}
                    bordered
                />
            </Card>
        </>
    );
};

const CardHeader: React.FC<{ title: string; btnText: string; btnColor?: BaseButtonProps["color"] }> = ({ title, btnText, btnColor = "primary" }) => {
    return (
        <>
            <Flex justify="space-between">
                <Typography.Title level={5}>{title}</Typography.Title>
                <Button
                    variant="solid"
                    color={btnColor}
                    disabled
                >
                    {btnText}
                </Button>
            </Flex>
        </>
    );
};

export default Dashboard;
