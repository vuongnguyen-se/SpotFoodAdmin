import axiosClient from "../api/axiosClient";

export const getAudios = () => axiosClient.get("/audios");

export const uploadAudio = (formData) =>
  axiosClient.post("/audios/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteAudio = (id) => axiosClient.delete(`/audios/${id}`);