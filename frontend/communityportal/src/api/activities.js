import api from "./axios";

export const getActivities = () => api.get("/activities");
export const getActivityById = (id) => api.get(`/activities/${id}`);
export const createActivity = (data) => api.post("/activities", data);
export const updateActivity = (id, data) => api.put(`/activities/${id}`, data);
export const archiveActivity = (id) => api.delete(`/activities/${id}`);
