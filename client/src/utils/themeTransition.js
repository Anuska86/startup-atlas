import "../styles/ThemeTransition.css";

export const runThemeTransition = (event, switchTheme) => {
  const x = event.clientX;
  const y = event.clientY;

  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
};

if (!document.startViewTransition) {
  switchTheme();
  return;
}

const transition = document.startViewTransition(() => {
  switchTheme();
});

transition.ready.then(() => {
  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: 500,
      easing: "ease-in",
      pseudoElement: "::view-transition-new(root)",
    },
  );
});
