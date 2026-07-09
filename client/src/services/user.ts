import { axiosInstanse } from "./axiosInstance";

export const getUsers = () => {
    return axiosInstanse.get("/users");
};
