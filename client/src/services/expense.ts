import { axiosInstanse } from "./axiosInstance";

export const addExpenses = (payload: { groupId: string; amount: number; description: string }) => {
    return axiosInstanse.post("/expenses/add", payload);
};
