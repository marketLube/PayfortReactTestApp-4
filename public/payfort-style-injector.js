// Script to handle CSS injection via postMessage
(function() {
  // Listen for messages from the parent window
  window.addEventListener('message', function(event) {
    // Check if the message is for CSS injection
    if (event.data && event.data.action === 'injectCss' && event.data.css) {
      try {
        // Create a style element
        const styleElement = document.createElement('style');
        styleElement.textContent = event.data.css;
        
        // Append the style element to the document head
        document.head.appendChild(styleElement);
        
        // Send a confirmation message back to the parent
        if (window.parent) {
          window.parent.postMessage({
            status: 'css_injected',
            success: true
          }, '*');
        }
        
        console.log('Custom CSS injected successfully');
      } catch (error) {
        console.error('Error injecting CSS:', error);
        
        // Send an error message back to the parent
        if (window.parent) {
          window.parent.postMessage({
            status: 'css_injection_failed',
            error: error.message
          }, '*');
        }
      }
    }
  }, false);
  
  // Notify the parent window that we're ready to receive CSS
  if (window.parent) {
    window.parent.postMessage({
      status: 'ready',
      message: 'Payfort iframe ready for CSS injection'
    }, '*');
  }
})();
