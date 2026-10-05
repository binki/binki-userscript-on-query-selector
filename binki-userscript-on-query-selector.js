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
  return (querySelector, handleElement) => {
    if (!byQuerySelector.size) observer.observe(element, {
      attributes: true,
      characterData: true,
      subtree: true,
      childList: true,
    });
    const state = byQuerySelector.getOrInsertComputed(querySelector, () => ({
      handlers: [],
      sentElements: new WeakSet(),
    }));
    for (const found of element.querySelectorAll(querySelector)) {
      if (state.sentElements.has(found)) {
        // If other handlers already received this element, only send it to our new registrant.
        handleElement(found);
      } else {
        // If other handlers haven’t already received this element, broadcast.
        state.sentElements.add(found);
        for (const handler of state.handlers) {
          handler(found);
        }
      }
    }
    state.handlers.push(handleElement);
  };
};

const binkiOnQuerySelector = binkiBuildOnQuerySelector(document.body);
