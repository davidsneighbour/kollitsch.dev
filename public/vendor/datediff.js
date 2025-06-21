// src/components/DateDiff.js

class DateDiff extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const startDate = new Date(this.getAttribute('date'));
    const format = this.getAttribute('format') || 'Y';
    const now = new Date();

    if (isNaN(startDate)) {
      this.textContent = '[invalid date]';
      return;
    }

    const diff = this.#calculateDifference(startDate, now);
    const result = this.#formatDiff(diff, format);

    console.log(result);

    this.textContent = result;
  }

  #calculateDifference(from, to) {
    const y = to.getFullYear() - from.getFullYear();
    const m = to.getMonth() - from.getMonth();
    const d = to.getDate() - from.getDate();

    let years = y;
    let months = m;
    let days = d;

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalMonths = years * 12 + months;
    const totalDays = Math.floor((to - from) / (1000 * 60 * 60 * 24));

    return { days, months, totalDays, totalMonths, years };
  }

  #formatDiff(diff, format) {
    return format
      .replace(/%?Y/g, `${diff.years}`)
      .replace(/%?M/g, `${diff.totalMonths}`)
      .replace(/%?D/g, `${diff.totalDays}`)
      .replace(/Y/g, `${diff.years} year${diff.years !== 1 ? 's' : ''}`)
      .replace(/M/g, `${diff.months} month${diff.months !== 1 ? 's' : ''}`)
      .replace(/D/g, `${diff.days} day${diff.days !== 1 ? 's' : ''}`);
  }
}

customElements.define('date-diff', DateDiff);
