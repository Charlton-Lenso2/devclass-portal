import api from "./axios";

export const getAnnouncements = () => api.get("/announcements");
export const createAnnouncement = (data) => api.post("/announcements", data);
