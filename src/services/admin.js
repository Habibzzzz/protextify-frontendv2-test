import api from "./api";

const getAdminDashboardOverview = async () => {
  return await api.get("/admin/dashboard/overview");
};

const getAdminDashboardCharts = async (range = "30d") => {
  return await api.get(`/admin/dashboard/charts?range=${range}`);
};

const adminService = {
  getAdminDashboardOverview,
  getAdminDashboardCharts,
};

export default adminService;
