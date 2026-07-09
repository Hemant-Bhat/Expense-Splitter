import { axiosInstanse } from "./axiosInstance";

export const addExpeses = (payload: { groupId: string; amount: number; description: string }) => {
    return axiosInstanse.post("/expenses/add", payload);
};
