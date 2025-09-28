import './syncstring.js';
import './share2mastodon.js';
import setup from '@data/setup.json' with { type: 'json' };
import { renderIntroduction } from './render-intro.js';

const target = document.getElementById('about-introduction');
if (target) {
  const html = renderIntroduction(setup.introduction, setup.greetings);
  target.innerHTML = html;
}
