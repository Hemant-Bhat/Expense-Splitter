import { Card, Col, Row } from "antd";
import MonthlyAnalysis from "./MonthlyAnalysis";
import GroupAnalysis from "./GroupAnalysis";
import TrendAnalysis from "./TrendAnalysis";

const CARDS = [
    {
        key: "month_spending",
        title: "Monthly Spendings",
        component: <MonthlyAnalysis />,
    },
    {
        key: "group_spending",
        title: "Group Spendings",
        component: <GroupAnalysis />,
    },
    {
        key: "last_30_days_trend",
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
                    <Col
                        key={card.key}
                        md={{ span: 12 }}
                        xs={{ span: 24 }}
                    >
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
