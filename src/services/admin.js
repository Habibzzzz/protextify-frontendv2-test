import api from "./api";

const getAdminDashboardOverview = async () => {
  return await api.get("/admin/dashboard/overview");
};

const getAdminDashboardCharts = async (range = "30d") => {
  return await api.get(`/admin/dashboard/charts?range=${range}`);
};

const getAdminMonitoring = async () => {
  return await api.get("/admin/monitoring");
};

const getAdminUsers = async (query = "") => {
  const params = query ? `?q=${encodeURIComponent(query)}` : "";
  return await api.get(`/admin/users${params}`);
};

const createAdminUser = async (payload) => {
  return await api.post("/admin/users", payload);
};

const updateAdminUser = async (id, payload) => {
  return await api.patch(`/admin/users/${id}`, payload);
};

const deleteAdminUser = async (id) => {
  return await api.delete(`/admin/users/${id}`);
};

const adminService = {
  getAdminDashboardOverview,
  getAdminDashboardCharts,
  getAdminMonitoring,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
};

export default adminService;
