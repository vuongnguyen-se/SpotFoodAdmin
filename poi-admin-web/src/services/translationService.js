import axiosClient from "../api/axiosClient";

export const getTranslations = () => axiosClient.get("/translations");
export const getTranslationById = (id) => axiosClient.get(`/translations/${id}`);

export const getTranslationsByPoiId = (poiId) =>
  axiosClient.get(`/pois/${poiId}/translations`);

export const createTranslation = (poiId, data) =>
  axiosClient.post(`/pois/${poiId}/translations`, data);

export const updateTranslation = (id, data) =>
  axiosClient.put(`/translations/${id}`, data);

export const deleteTranslation = (id) =>
  axiosClient.delete(`/translations/${id}`);