export const animationsComplete = (element) =>
	Promise.allSettled(element.getAnimations().map((animation) => animation.finished));
