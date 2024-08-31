const initializeAndSwitchClassOnScroll = () => {
  const body = document.body;
  const scrollThreshold = 50;

  // set the initial class based on scroll position
  const determineAndSetClass = () => {
    const currentState = window.scrollY > scrollThreshold ? 'nav-state2' : 'nav-state1';
    const oppositeState = currentState === 'nav-state1' ? 'nav-state2' : 'nav-state1';
    if (!body.classList.contains(currentState)) {
      body.classList.remove(oppositeState);
      body.classList.add(currentState);
    }
  };

  // listen to scroll event to update class based on current scroll position
  window.addEventListener('scroll', determineAndSetClass);

  // set the initial class based on current scroll position
  determineAndSetClass();
};

export { initializeAndSwitchClassOnScroll };
