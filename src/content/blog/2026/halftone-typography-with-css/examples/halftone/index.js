import state from './playground-state.json' with { type: 'json' };

const root = document.documentElement;
const sample = document.querySelector('#sample');

// A dot must stay smaller than half of its cell, or neighbours merge.
const radius = Math.min(state.dotRadius, state.dotSpacing / 2 - 0.5);

root.style.setProperty('--dot-spacing', `${state.dotSpacing}px`);
root.style.setProperty('--dot-radius', `${radius}px`);
root.style.setProperty('--sample-size', `${state.typeSize}px`);
root.style.setProperty('--ink', state.ink);
root.style.setProperty('--paper', state.paper);

if (sample) {
  // textContent keeps the sample text literal: markup stays text.
  sample.textContent = state.text;
  sample.classList.toggle('is-solid', state.solid);
  sample.classList.toggle('is-animated', state.animate);
  sample.classList.toggle('is-paused', state.paused);
}
