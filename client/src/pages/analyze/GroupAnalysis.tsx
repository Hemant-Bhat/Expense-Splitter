import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Legend, Tooltip } from "recharts";
import ChartSkeleton from "../../components/ChartSkeleton";
import { getYearlySpendings } from "../../services/analyze";
import { getRandomColor } from "../../utils";
import EmptyChart from "../../components/EmptyChart";

const GroupAnalysis = () => {
    const { data: groupData, isFetching: groupDataLoading } = useQuery({
        queryKey: ["spending", "group"],
        queryFn: () => getYearlySpendings({ year: new Date().getFullYear() }),
    });
    const groupSpendData = groupData?.data?.data || [];
    const pieData =
        groupSpendData?.groups?.map((group: any) => ({
            name: group.groupName,
            value: group.totalGroupSpendings,
            fill: getRandomColor(),
        })) || [];
    return (
        <>
            {/* <Button onClick={() => refetch()}>Refresh</Button> */}
            <ChartSkeleton
                type="pie"
                isLoading={groupDataLoading}
            >
                <PieChart
                    style={{ width: "100%", height: "100%", maxHeight: "40vh", aspectRatio: 1.618 }}
                    responsive
                >
                    {pieData.length > 0 ? (
                        <>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={"40%"}
                                outerRadius="80%"
                                fill="#05bc7f"
                                label
                                isAnimationActive={true}
                            />
                            <Tooltip />
                            <Legend />
                        </>
                    ) : (
                        <EmptyChart />
                    )}
                </PieChart>
            </ChartSkeleton>
        </>
    );
};

export default GroupAnalysis;
