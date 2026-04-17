import axiosClient from "../api/axiosClient";

export const getContents = () => axiosClient.get("/contents");
export const getContentById = (id) => axiosClient.get(`/contents/${id}`);

export const getContentsByPoiId = (poiId) =>
  axiosClient.get(`/pois/${poiId}/contents`);

export const createContent = (poiId, data) =>
  axiosClient.post(`/pois/${poiId}/contents`, data);

export const updateContent = (id, data) =>
  axiosClient.put(`/contents/${id}`, data);

export const deleteContent = (id) =>
  axiosClient.delete(`/contents/${id}`);