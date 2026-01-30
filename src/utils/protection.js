// Content Protection Script
// Prevents copying, right-click, and keyboard shortcuts

export const initProtection = () => {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable keyboard shortcuts for copying/saving
  document.addEventListener('keydown', (e) => {
    // Disable Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+S, Ctrl+A, Ctrl+U, Ctrl+P
    if (e.ctrlKey || e.metaKey) {
      const blockedKeys = ['c', 'v', 'x', 's', 'a', 'u', 'p'];
      if (blockedKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
    }
    
    // Disable F12 (DevTools), Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      const blockedShiftKeys = ['i', 'j', 'c'];
      if (blockedShiftKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
    }
    
    // Disable PrintScreen
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      // Clear clipboard
      navigator.clipboard.writeText('').catch(() => {});
      return false;
    }
  });

  // Disable copy event
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable cut event
  document.addEventListener('cut', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable drag start
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable select start (except in inputs)
  document.addEventListener('selectstart', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return true;
    }
    e.preventDefault();
    return false;
  });

  // Detect DevTools opening (basic detection)
  let devtoolsOpen = false;
  const threshold = 160;
  
  const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        // Optional: blur content when devtools detected
        document.body.style.filter = 'blur(10px)';
      }
    } else {
      if (devtoolsOpen) {
        devtoolsOpen = false;
        document.body.style.filter = 'none';
      }
    }
  };
  
  // Check periodically
  setInterval(checkDevTools, 1000);

  console.log('%c⚠️ Content Protected', 'color: #6366f1; font-size: 20px; font-weight: bold;');
  console.log('%cThis site has copy protection enabled.', 'color: #94a3b8; font-size: 14px;');
};
