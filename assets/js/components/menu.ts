import "ninja-keys";

// menu
const ninja = document.querySelector('ninja-keys');
if (ninja){
  ninja.data = [
    {
      id: 'Home',
      title: 'Home',
      hotkey: 'ctrl+H',
      section: 'Navigation',
      handler: () => {
        window.location.href = "/";
      },
    },
    {
      id: 'Contact',
      title: 'Contact',
      hotkey: 'ctrl+C',
      section: 'Navigation',
      handler: () => {
        window.location.href = "/contact/";
      },
    },
  ];
}
