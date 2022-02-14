import 'ninja-keys';

// menu
let ninjaTag = document.createElement("ninja-keys");
const footer = document.getElementById("footer");
footer.appendChild(ninjaTag);

if (ninjaTag) {
  ninjaTag.data = [
    {
      id: 'Home',
      title: 'Home',
      hotkey: 'ctrl+H',
      section: 'Navigation',
      handler: () => {
        window.location.href = '/';
      },
    },
    {
      id: 'Contact',
      title: 'Contact',
      hotkey: 'ctrl+shift+C',
      section: 'Navigation',
      handler: () => {
        window.location.href = '/contact/';
      },
    },
  ];
}
