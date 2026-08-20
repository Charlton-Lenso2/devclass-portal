export function getStatusColor(status) {
  switch (status) {
    case "EXPIRED":
      return "#dc2626";
    case "DUE_SOON":
      return "#f59e0b"; 
    case "ACTIVE":
      return "#16a34a"; 
    case "ARCHIVED":
      return "#6b7280"; 
    default:
      return "#6b7280";
  }
}
