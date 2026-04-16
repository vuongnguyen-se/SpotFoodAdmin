import axiosClient from "../api/axiosClient";

export const getCategories = () => axiosClient.get("/categories");