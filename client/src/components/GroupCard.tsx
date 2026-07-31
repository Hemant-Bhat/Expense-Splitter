import type React from "react";
import { Card, Divider, Flex, Typography } from "antd";
import { LinkButton } from "./link";

type GroupCardProps = {
    name: string;
    groupId: string;
    memberList: string[];
};

const Text = Typography.Text;

const GroupCard: React.FC<GroupCardProps> = ({ groupId, name, memberList }) => {
    return (
        <>
            <Card
                title={name}
                size="small"
                variant="outlined"
                style={{ maxWidth: "200px", height: 260, overflowY: "auto" }}
                extra={[
                    <LinkButton
                        to="/group/$groupId"
                        params={{ groupId }}
                        variant="outlined"
                        size="small"
                    >
                        More
                    </LinkButton>,
                ]}
            >
                <Divider
                    size="small"
                    titlePlacement="center"
                >
                    <Text type="secondary">Members</Text>
                </Divider>
                <Flex
                    orientation="vertical"
                    style={{ maxHeight: "150px", overflow: "auto" }}
                >
                    {memberList?.map((member) => (
                        <Text
                            key={member}
                            ellipsis
                            style={{ width: "100%", flexShrink: 0 }}
                        >
                            {member}
                        </Text>
                    ))}
                </Flex>
            </Card>
        </>
    );
};

export default GroupCard;
