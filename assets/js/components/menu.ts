import 'ninja-keys';

// menu
const ninjaTag = document.createElement('ninja-keys');
const footer = document.querySelector('#footer');
footer.append(ninjaTag);

if (ninjaTag) {
  ninjaTag.data = [
    {
      id: 'Home',
      title: 'Home',
      hotkey: 'ctrl+shift+H',
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
