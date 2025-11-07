import './syncstring.ts';
import setup from '@data/setup.json' with { type: 'json' };
import { renderIntroduction } from './render-intro.ts';
import Lenis from 'lenis'

const target = document.getElementById('about-introduction');
if (target) {
  const html = renderIntroduction(setup.introduction, setup.greetings);
  target.innerHTML = html;
}

// const lenis = new Lenis({
new Lenis({
  autoRaf: true,
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
});

// Listen for the scroll event and log the event data
// lenis.on('scroll', (e) => {
//   // console.log(e);
// });
