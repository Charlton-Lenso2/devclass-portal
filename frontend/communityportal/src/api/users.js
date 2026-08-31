import api from "./axios";

export const getAllStudents = () => api.get("/users");
export const getStudentReadStatus = (activityId) => api.get(`/notifications/activity/${activityId}/status`);