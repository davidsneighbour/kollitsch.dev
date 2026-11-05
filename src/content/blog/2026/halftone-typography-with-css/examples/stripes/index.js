import state from './playground-state.json' with { type: 'json' };

const root = document.documentElement;
const sample = document.querySelector('#sample');

root.style.setProperty('--stripe-width', `${state.stripeWidth}px`);
root.style.setProperty('--stripe-gap', `${state.stripeGap}px`);
root.style.setProperty('--stripe-angle', `${state.angle}deg`);
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
