import axios from "axios";

const axiosInstanse = axios.create({
  baseURL: "localhost:3000",
});

// const login = async ({ email, password }) => {
//     return axios.post('')
// };
