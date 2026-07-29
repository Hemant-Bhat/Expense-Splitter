import { axiosInstanse } from "./axiosInstance";

export const getPayable = () => {
    return axiosInstanse.get("/balance/payable");
};

export const getReceivable = () => {
    return axiosInstanse.get("/balance/receivable");
};
