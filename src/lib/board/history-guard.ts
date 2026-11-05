/**
 * The phone map and the video window both answer the back gesture. Which one
 * reacts cannot depend on listener order, so they agree here instead.
 */
export const historyGuard = {
  /** A video window is open: the next step back belongs to it. */
  video: false,
  /** A video window is taking its own entry out of the history: nobody else reacts. */
  skipNext: false,
};
