import { axiosInstanse } from "./axiosInstance";

export const getPayable = () => {
    return axiosInstanse.get("/balance/payable");
};

export const getReceivable = () => {
    return axiosInstanse.get("/balance/receivable");
};

export const payExpenseAmount = (payload: { expenseId: string; amount: number }) => {
    return axiosInstanse.post("/expenses/pay", payload);
};
