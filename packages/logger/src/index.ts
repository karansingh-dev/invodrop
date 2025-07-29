export const logger = {
  info: (message: string, data = {}) => {
    console.info(`📝 [INFO] ${new Date().toISOString()} - ${message}`, data);
  },

  error: (message: string, data = {}) => {
    console.error(`❌ [ERROR] ${new Date().toISOString()} - ${message}`, data);
  },

  warn: (message: string, data = {}) => {
    console.warn(`⚠️  [WARN] ${new Date().toISOString()} - ${message}`, data);
  },
};
