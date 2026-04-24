import axiosClient from "../api/axiosClient";

export const getStatsOverview = () => {
  return axiosClient.get("/admin/stats/overview");
};

export const getHeatmapData = () => {
  return axiosClient.get("/admin/stats/heatmap");
};