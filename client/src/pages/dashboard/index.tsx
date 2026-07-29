import { useQuery } from "@tanstack/react-query";
import { Button, Card, Flex, Table, Typography, type TableColumnType } from "antd";
import React from "react";
import { getPayable, getReceivable } from "../../services/balance";
import type { BaseButtonProps } from "antd/es/button/Button";

const COLUMNS = [
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
        render: () => (
            <>
                <Button
                    variant="solid"
                    color="primary"
                >
                    Pay
                </Button>
            </>
        ),
    },
];

const Dashboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["paybale"],
        queryFn: getPayable,
    });

    const response = data?.data;
    const payableData = response?.data;

    console.log(payableData);
    return (
        <>
            <Card
                title={
                    <CardHeader
                        title={`You owe: ${payableData?.totalOwes}`}
                        btnText="Mark as Paid"
                    />
                }
                style={{ margin: 10 }}
            >
                <Table
                    columns={COLUMNS}
                    dataSource={payableData?.expenses || []}
                    loading={isLoading}
                    rowKey={"expenseId"}
                    bordered
                />
            </Card>

            <ReceivableCard />
        </>
    );
};

const RECEIVE_COLUMNS = [
    // {
    //     key: "paidBy",
    //     title: "Paid By",
    //     dataIndex: "paidBy",
    // },
    { key: "groupName", title: "Group Name", dataIndex: "groupName" },
    { key: "amount", title: "Amount", dataIndex: "amount" },
    { key: "description", title: "Description", dataIndex: "description" },
    { key: "share", title: "Share", render: (value: any) => value.participant["share"] },
    { key: "owes", title: "Owes", render: (value: any) => value.participant["owes"] },
    { key: "paid", title: "Paid", render: (value: any) => value.participant["paid"] },
    {
        key: "action",
        title: "Action",
        render: () => (
            <>
                <Button
                    variant="solid"
                    color="pink"
                >
                    Notify
                </Button>
            </>
        ),
    },
];
const ReceivableCard: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["receivable"],
        queryFn: getReceivable,
    });

    const response = data?.data;
    const receivableData = response?.data;

    console.log(receivableData);
    return (
        <>
            <Card
                title={
                    <CardHeader
                        title={`You are owed: ${receivableData?.totalOwed}`}
                        btnText="Notify All"
                        btnColor="pink"
                    />
                }
                style={{ margin: 10 }}
            >
                {" "}
                <Table
                    columns={RECEIVE_COLUMNS}
                    dataSource={receivableData?.receivables || []}
                    loading={isLoading}
                    rowKey={"_id"}
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
                >
                    {btnText}
                </Button>
            </Flex>
        </>
    );
};

export default Dashboard;
