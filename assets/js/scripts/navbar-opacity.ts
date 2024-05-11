// Define the class switch function with initialization
const initializeAndSwitchClassOnScroll = () => {
  const body = document.body;
  const scrollThreshold = 50;

  // Function to determine and set the initial class based on scroll position
  const determineAndSetClass = () => {
    const currentState = window.scrollY > scrollThreshold ? 'nav-state2' : 'nav-state1';
    const oppositeState = currentState === 'nav-state1' ? 'nav-state2' : 'nav-state1';

    // Ensure the body only has the correct class
    if (!body.classList.contains(currentState)) {
      body.classList.remove(oppositeState);
      body.classList.add(currentState);
    }
  };

  // Listen to scroll event to update class based on current scroll position
  window.addEventListener('scroll', determineAndSetClass);

  // Set the initial class based on current scroll position
  determineAndSetClass();
};

// Use window.onload to ensure everything is loaded before initializing
window.onload = initializeAndSwitchClassOnScroll;

// Export the function for manual invocation if needed elsewhere
export { initializeAndSwitchClassOnScroll };
