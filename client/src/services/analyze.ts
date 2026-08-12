import { axiosInstanse } from "./axiosInstance";

export const getMonthlySpendings = async () => {
    return await axiosInstanse.get("/analyze/spendings/monthly");
};

export const getYearlySpendings = async ({ year }: { year: number }) => {
    return await axiosInstanse.get(`/analyze/spendings/yearly?year=${year}`);
};

export const getSpendingTrend = async () => {
    return axiosInstanse.get("/analyze/spendings/trend");
};
