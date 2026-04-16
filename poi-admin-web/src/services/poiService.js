import axiosClient from "../api/axiosClient";

export const getPois = (params) => axiosClient.get("/Poi", { params });
export const getPoiById = (id) => axiosClient.get(`/Poi/${id}`);
export const createPoi = (data) => axiosClient.post("/Poi", data);
export const updatePoi = (id, data) => axiosClient.put(`/Poi/${id}`, data);
export const deletePoi = (id) => axiosClient.delete(`/Poi/${id}`);