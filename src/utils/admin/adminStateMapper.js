export const mapStatsFromApi = (apiData, prev) => {
  const updated = { ...prev };
  Object.keys(updated).forEach((key) => {
    updated[key] = {
      ...updated[key],
      value: Number(apiData[key] || 0).toLocaleString(),
    };
  });
  return updated;
};