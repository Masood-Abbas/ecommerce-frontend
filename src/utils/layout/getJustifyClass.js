export const getJustifyClass = (count) => {
  const mod = count % 4;

  if (mod === 1 || mod === 2) {
    return "justify-center";
  }

  return "justify-between";
};