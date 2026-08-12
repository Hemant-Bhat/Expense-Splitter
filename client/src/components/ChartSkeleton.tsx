import { Divider, Flex, Skeleton } from "antd";
import type { ReactNode } from "react";

const ChartSkeleton = ({ type, isLoading, children }: { type: "bar" | "pie" | "line"; isLoading: boolean; children: ReactNode }) => {
    return isLoading ? (
        <>
            {(() => {
                switch (type) {
                    case "bar":
                        return (
                            <BarChartLoading
                                barCount={5}
                                legendCount={3}
                            />
                        );
                    case "pie":
                        return <PieChartLoading />;
                    case "line":
                        return <LineCharLoading />;
                    default:
                        return "Loading...";
                }
            })()}
        </>
    ) : (
        children
    );
};

const BarChartLoading = ({ barCount = 5, legendCount = 3 }: { barCount?: number; legendCount?: number }) => {
    const bars = new Array(barCount).fill(null);
    const legends = new Array(legendCount).fill(null);

    return (
        <Flex
            vertical
            gap={15}
            justify="center"
            align="center"
        >
            <Flex gap={25}>
                {bars.map((_) => (
                    <Skeleton.Node
                        active
                        style={{ height: "250px", width: "50px" }}
                    />
                ))}
            </Flex>
            <Flex
                gap={10}
                justify="center"
            >
                {legends.map((_) => (
                    <Skeleton.Node
                        active
                        style={{ height: 20 }}
                    />
                ))}
            </Flex>
        </Flex>
    );
};

const PieChartLoading = ({ legendCount = 3 }: { legendCount?: number }) => {
    const legends = new Array(legendCount).fill(null);

    return (
        <Flex
            vertical
            gap={10}
            justify="center"
            align="center"
        >
            <Skeleton.Node
                active
                style={{ borderRadius: "50%", width: "255px", height: "auto", aspectRatio: 1 / 1 }}
            />
            <Flex
                gap={10}
                justify="center"
            >
                {legends.map((_) => (
                    <Skeleton.Node
                        active
                        style={{ height: 20 }}
                    />
                ))}
            </Flex>
        </Flex>
    );
};

const LineCharLoading = () => {
    return (
        <Flex
            vertical
            style={{ width: "100%", height: "auto", maxHeight: "50vh", aspectRatio: 1 / 1 }}
        >
            <Flex style={{ height: "100%" }}>
                <Divider
                    orientation="vertical"
                    size="large"
                    style={{ height: "100%", marginInline: 20 }}
                />
                <Flex style={{ width: "100%", height: "100%" }}>
                    <Skeleton.Node
                        active
                        style={{ width: "90%", height: "100%" }}
                        styles={{ root: { width: "100%", height: "100%" } }}
                    />
                </Flex>
            </Flex>
            <Divider />
        </Flex>
    );
};

export default ChartSkeleton;
