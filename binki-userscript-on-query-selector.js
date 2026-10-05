// Copyright (c) 2026 Nathan Phillip Brink

/**
 * Build a binkiOnQuerySelector() for a specific element.
 */
const binkiBuildOnQuerySelector = element => {
  let handleNeeded = false;
  const byQuerySelector = new Map();
  const handle = () => {
    if (handleNeeded) {
      for (const [querySelector, state] of byQuerySelector) {
        for (const found of element.querySelectorAll(querySelector)) {
          // Only send yet-unseen nodes to existing handlers.
          if (!state.sentElements.has(found)) {
            state.sentElements.add(found);
            for (const handler of state.handlers) {
              handler(found);
            }
          }
          // Send already-seen nodes to new handlers because they have not seen anything yet.
          for (const newHandler of state.newHandlers) {
            newHandler(found);
          }
        }
        if (state.newHandlers.length) {
          for (const newHandler of state.newHandlers) {
            state.handlers.push(newHandler);
          }
          state.newHandlers = [];
        }
      }
    }
    // In case if we have both a mutation event and newly added handlers, avoid the overhead of checking all the selectors again.
    handleNeeded = false;
  };
  const observer = new MutationObserver(() => {
    handleNeeded = true;
    handle();
  });
  return (selectors, handler) => {
    if (typeof selectors !== 'string') throw new Error('Argument selectors must be a string.');
    if (typeof handler !== 'function') throw new Error('Argument handler must be a function.');
    if (!byQuerySelector.size) observer.observe(element, {
      attributes: true,
      characterData: true,
      subtree: true,
      childList: true,
    });
    const state = byQuerySelector.getOrInsertComputed(selectors, () => ({
      handlers: [],
      newHandlers: [],
      sentElements: new WeakSet(),
    }));
    state.newHandlers.push(handler);
    // Only append a call to handle if one has not yet been scheduled.
    if (!handleNeeded) {
      Promise.resolve().then(handle);
      handleNeeded = true;
    }
  };
};

const binkiOnQuerySelector = binkiBuildOnQuerySelector(document.body);
