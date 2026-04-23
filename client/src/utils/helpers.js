//Returns a specific hex color based on the startup's growth category

export const getCategoryColor = (category) => {
  const normalizedCategory = category?.trim();

  switch (normalizedCategory) {
    case "Early":
    case "Early Stage":
      return "#4ade80";
    case "Growth":
    case "Growth Stage":
      return "#3b82f6";
    case "Scale-up":
      return "#f59e0b";
    case "Enterprise":
      return "#4cc9f0";

    default:
      return "#94a3b8";
  }
};

//Format employee counts (e.g., 5000 -> 5k)
export const formatEmployees = (count) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count;
};
