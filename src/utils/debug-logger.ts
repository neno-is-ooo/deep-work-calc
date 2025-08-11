// Debug logger for development - tracks all user interactions
export const initDebugLogger = () => {
  // @ts-ignore - import.meta.env is available in Vite
  if (import.meta.env.DEV) {
    // Log all clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      let identifier = target.tagName;
      
      // Safely get className
      if (target.id) {
        identifier = target.id;
      } else if (target.className && typeof target.className === 'string') {
        identifier = target.className.split(' ')[0] || target.tagName;
      }
      
      const text = target.textContent?.substring(0, 30)?.trim();
      console.log(`🖱️ CLICK: ${identifier} ${text ? `"${text}"` : ''}`);
    }, true);

    // Log all input changes
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      let identifier = 'input';
      
      if (target.name) {
        identifier = target.name;
      } else if (target.id) {
        identifier = target.id;
      } else if (target.className && typeof target.className === 'string') {
        identifier = target.className.split(' ')[0] || 'input';
      }
      
      console.log(`⌨️ INPUT: ${identifier} = "${target.value}"`);
    }, true);

    // Log all form submissions
    document.addEventListener('submit', (e) => {
      console.log('📝 FORM SUBMIT:', {
        form: (e.target as HTMLFormElement).name,
        timestamp: new Date().toISOString()
      });
    }, true);

    // Log all state changes (for Zustand)
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      if (args[0]?.includes?.('zustand') || args[0]?.includes?.('state')) {
        originalConsoleLog('🔄 STATE CHANGE:', ...args);
      } else {
        originalConsoleLog(...args);
      }
    };

    // Log route/hash changes
    window.addEventListener('hashchange', () => {
      console.log('🔗 HASH CHANGE:', window.location.hash);
    });

    // Log errors
    window.addEventListener('error', (e) => {
      console.error('❌ ERROR:', e.error);
    });

    console.log('🐛 Debug logger initialized - tracking all interactions');
  }
};