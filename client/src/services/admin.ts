import { axiosInstanse } from "./axiosInstance";

type Login = {
    email: string;
    password: string;
};

type Signup = Login & { confirmPassword: string };

export const login = async (data: Login) => {
    return axiosInstanse.post("/auth/login", data);
};

export const signup = async (data: Signup) => {
    return axiosInstanse.post("/auth/signup", data);
};

export const me = async () => {
    return axiosInstanse.get("/me");
};
