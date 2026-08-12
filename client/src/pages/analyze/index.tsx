import { Card, Col, Row } from "antd";
import MonthlyAnalysis from "./MonthlyAnalysis";
import GroupAnalysis from "./GroupAnalysis";
import TrendAnalysis from "./TrendAnalysis";

const CARDS = [
    {
        title: "Monthly Spendings",
        component: <MonthlyAnalysis />,
    },
    {
        title: "Group Spendings",
        component: <GroupAnalysis />,
    },
    {
        title: "Last 30 Day(s) Trend",
        component: <TrendAnalysis />,
    },
];

const Analyze = () => {
    return (
        <>
            <Row
                gutter={[10, 10]}
                style={{ margin: 10 }}
            >
                {CARDS.map((card) => (
                    <Col span={12}>
                        <Card
                            size="small"
                            title={card.title}
                        >
                            {card.component}
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default Analyze;
