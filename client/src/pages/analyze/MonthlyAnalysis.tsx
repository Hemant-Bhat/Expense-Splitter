import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { getMonthlySpendings } from "../../services/analyze";
import ChartSkeleton from "../../components/ChartSkeleton";

const MonthlyAnalysis = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["spending", "monthly"],
        queryFn: getMonthlySpendings,
    });

    const spendings = data?.data?.spendings || [];

    return (
        <ChartSkeleton
            type="bar"
            isLoading={isLoading}
        >
            <BarChart
                data={spendings.map((d: any) => ({ name: d.monthName, value: d.totalSpendedAmount }))}
                style={{ width: "100%", maxHeight: "40vh", aspectRatio: 1.618 }}
                responsive
                barSize={100}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={"name"} />
                <YAxis width={"auto"} />
                <Legend />
                <Tooltip />
                <Bar
                    dataKey="value"
                    name={"Spending"}
                    fill="#5b55ff"
                    activeBar={{ fill: "#3d39a5" }}
                    radius={[10, 10, 0, 0]}
                />
            </BarChart>
        </ChartSkeleton>
    );
};

export default MonthlyAnalysis;
