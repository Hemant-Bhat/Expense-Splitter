import { useQuery } from "@tanstack/react-query";
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip } from "recharts";
import { getSpendingTrend } from "../../services/analyze";
import ChartSkeleton from "../../components/ChartSkeleton";
import EmptyChart from "../../components/EmptyChart";
import { useRouteContext } from "@tanstack/react-router";
import { theme } from "antd";

const TrendAnalysis = () => {
    const { user } = useRouteContext({ from: "/_main" });
    const { token } = theme.useToken();
    const { data: trendData, isLoading: trendDataLoading } = useQuery({
        queryKey: ["spending", "trend"],
        queryFn: getSpendingTrend,
    });

    const spendTrendData = trendData?.data?.data || [];

    const lineData = spendTrendData.map((d: any) => ({ name: new Date(d.date).toLocaleDateString(), value: d.totalAmount }));

    return (
        <ChartSkeleton
            type="line"
            isLoading={trendDataLoading}
        >
            <LineChart
                data={lineData}
                style={{ width: "100%", maxHeight: "40vh", aspectRatio: 1.618 }}
                responsive
                barSize={100}
            >
                {lineData.length > 0 ? (
                    <>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={"name"} />
                        <YAxis width={"auto"} />
                        <Line
                            dataKey="value"
                            fill="#5b55ff"
                        />
                        <Tooltip
                            content={({ payload, label }) => {
                                const firstPayload = payload?.[0];
                                return (
                                    <div>
                                        <p> Date: {label}</p>
                                        <p>
                                            Total Amount: {user.currency.symbol} {firstPayload?.value}
                                        </p>
                                    </div>
                                );
                            }}
                            wrapperStyle={{
                                background: token.colorBgBase,
                                color: token.colorBgSolid,
                                border: `1px solid ${token.colorBgSolid}`,
                                padding: 10,
                            }}
                        />
                    </>
                ) : (
                    <EmptyChart />
                )}
            </LineChart>
        </ChartSkeleton>
    );
};

export default TrendAnalysis;
