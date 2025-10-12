export const logger = (message: string, data?: any) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${message}`, data || "");
};
