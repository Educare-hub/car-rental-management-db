export const logger = (message: string, data?: any): void => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${message}`, data ?? "");
};
