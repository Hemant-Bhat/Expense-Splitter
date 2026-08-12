import { theme } from "antd";

const EmptyChart = ({ text = "No data available" }: { text?: string }) => {
    const { token } = theme.useToken();

    return (
        <text
            x="50%"
            y="50%"
            fill={token.colorText}
            textAnchor="middle"
            dominantBaseline="middle"
        >
            {text}
        </text>
    );
};

export default EmptyChart;
