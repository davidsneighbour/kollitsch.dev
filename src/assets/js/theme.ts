import collapse from '@alpinejs/collapse';
import intersect from '@alpinejs/intersect';
import type { Alpine } from 'alpinejs';

export default (Alpine: Alpine) => {
  Alpine.plugin(collapse);
  Alpine.plugin(intersect);
};
