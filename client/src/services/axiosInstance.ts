import axios from "axios";

export type ApiResponse<T> = {
    data: T;
    message: string;
    success: boolean;
};

const axiosInstanse = axios.create({
    baseURL: import.meta.env.VITE_BASE_URI,
    withCredentials: true,
});

// axiosInstanse.interceptors.request.use((a) => {
//   console.log(a);
//   return a;
// });
export { axiosInstanse };
