export const runThemeTransition = (event, switchTheme) => {
  // If browser doesn't support it, just swap
  if (!document.startViewTransition) {
    switchTheme();
    return;
  }
  // The browser takes a snapshot here
  const transition = document.startViewTransition(() => {
    // The state update happens here
    switchTheme();
  });

  // This ensures the animation doesn't start until the DOM is updated
  transition.ready.then(() => {
    console.log("Transition is ready and running");
  });
};
