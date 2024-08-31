document.querySelectorAll('.entry a[rel=bookmark]')
  .slice(0, 3)
  .forEach(e => e.classList.add('prerenderosa')
  );

const pre = {
  "prerender": [{
    "source": "document",
    "where": {
      "and": [
        // prerender pages where the link has the new class name
        { "selector_matches": ".prerenderosa" },
      ]
    },
    "eagerness": "immediate", // be eager!
    // "eagerness": "moderate", // after 200ms hovering
    // conservative - on pointer down
  }]
};
const spec = document.createElement('script');
spec.type = "speculationrules";
spec.append(JSON.stringify(pre));
document.body.append(spec);
