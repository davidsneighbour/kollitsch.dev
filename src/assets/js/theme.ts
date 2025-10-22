import './syncstring.ts';
import setup from '@data/setup.json' with { type: 'json' };
import { renderIntroduction } from './render-intro.ts';

const target = document.getElementById('about-introduction');
if (target) {
  const html = renderIntroduction(setup.introduction, setup.greetings);
  target.innerHTML = html;
}
