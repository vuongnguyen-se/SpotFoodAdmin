// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: "http://localhost:5284/api",
// });

// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default axiosClient;
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5284/api",
});

export default axiosClient;