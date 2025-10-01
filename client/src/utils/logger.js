const isDev = import.meta.env.DEV;

const styles = {
  info: 'color: #3b82f6; font-weight: bold',
  warn: 'color: #f59e0b; font-weight: bold',
  error: 'color: #ef4444; font-weight: bold',
  success: 'color: #10b981; font-weight: bold'
};

export const logger = {
  info: (...args) => isDev && console.log('%c🔸 CLIENT |', styles.info, ...args),
  warn: (...args) => isDev && console.warn('%c⚠️ CLIENT |', styles.warn, ...args),
  error: (...args) => console.error('%c❌ CLIENT |', styles.error, ...args),
  success: (...args) => isDev && console.log('%c✅ CLIENT |', styles.success, ...args)
};

