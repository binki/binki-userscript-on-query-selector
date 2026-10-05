// Copyright (c) 2026 Nathan Phillip Brink

/**
 * Build a binkiOnQuerySelector() for a specific element.
 */
const binkiBuildOnQuerySelector = element => {
  const byQuerySelector = new Map();
  const observer = new MutationObserver(() => {
    console.log('handling mutation');
    for (const [querySelector, state] of byQuerySelector) {
      for (const found of element.querySelectorAll(querySelector)) {
        if (!state.sentElements.has(found)) {
          state.sentElements.add(found);
          for (const handler of state.handlers) {
            handler(found);
          }
        }
      }
    }
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
      sentElements: new WeakSet(),
    }));
    for (const found of element.selectorsAll(selectors)) {
      if (state.sentElements.has(found)) {
        // If other handlers already received this element, only send it to our new registrant.
        handler(found);
      } else {
        // If other handlers haven’t already received this element, broadcast.
        state.sentElements.add(found);
        for (const handler of state.handlers) {
          handler(found);
        }
      }
    }
    state.handlers.push(handler);
  };
};

const binkiOnQuerySelector = binkiBuildOnQuerySelector(document.body);
