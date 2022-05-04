import BezierEasing from 'bezier-easing';

// there might be a neat way to dynamically get this from the open-props value
// e.g. getComputedStyle(document.documentElement).getPropertyValue('--ease-elastic-3')
// returns "cubic-bezier(.5, 1.25, .75, 1.25)"
export const easeElastic3 = BezierEasing(0.5, 1.25, 0.75, 1.25);
