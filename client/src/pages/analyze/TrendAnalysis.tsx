import { useQuery } from "@tanstack/react-query";
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip } from "recharts";
import { getSpendingTrend } from "../../services/analyze";
import ChartSkeleton from "../../components/ChartSkeleton";

const TrendAnalysis = () => {
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
                        <Tooltip />
                    </>
                ) : (
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        No data available
                    </text>
                )}
            </LineChart>
        </ChartSkeleton>
    );
};

export default TrendAnalysis;
