---
title: "Install and link Firefox Developer Edition on Ubuntu"
description: ""
date: "2023-03-10T21:44:58+07:00"
resources:
  - title: "Firefox Developer Edition"
    src: "header.jpg"
tags:
  - "firefox"
  - "browser"
  - "howto"
  - "ubuntu"
  - "100DaysToOffload"
fmContentType: "blog"
cover: "./header.jpg"
---

[Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) is a specialized version of the Firefox browser, designed for developers and early adopters. It's kind of a beta version, but with much more features. It comes with various tools, such as the Visual Editing, Debugging, an inspector that shows you details about the used CSS Grid, unused CSS and so on. I often use it to debug website issues that come up.

Every time I have to reinstall my Ubuntu system, I have to go through the process of installing Firefox Developer Edition again. Manually. They do not offer a PPA and the PPAs you find online are not official and very seldom updated. There is also no simple `apt install` method to get the browser. This is a bit annoying, so I decided to write a quick step-by-step list on how to install and link Firefox Developer Edition on Ubuntu that I can refer to anytime I need to re-configure my system.

## Step 1: Download Firefox Developer Edition

To install Firefox Developer Edition on Ubuntu, you need to download the latest version from the official Mozilla website. Follow these steps to download the latest Firefox Developer Edition:

- Open the [Firefox Developer Edition download page](https://www.mozilla.org/en-US/firefox/developer/).and click on the "Firefox Developer Edition" button to download the package for your system. If you are on Ubuntu, it will be pre-selected. If you are not on Ubuntu, you are in the wrong How-To, because this one is about how to set it up on Ubuntu and Ubuntu-like systems.
- Save the downloaded file to your preferred location on your computer.

# Step 2: Install Firefox Developer Edition

Once you have downloaded the Firefox Developer Edition package, you need to install it on your Ubuntu system.

- Open the terminal app on your Ubuntu system by pressing Ctrl+Alt+T or however you start your preferred terminal app.
- Navigate to the directory where you have saved the Firefox Developer Edition package.
- Extract the package
- Move the extracted Firefox Developer Edition folder to the /opt directory (you will have to use sudo for this)
- Create a symbolic link to the Firefox Developer Edition executable (this too requires sudo)

The following commands will do exactly that:

```bash
cd ~/Downloads
tar -xvf firefox-*.tar.bz2
sudo mv firefox /opt/firefox-developer-edition
sudo ln -s /opt/firefox-developer-edition/firefox /usr/bin/firefox-developer-edition
```

## Step 3: Add a Desktop Shortcut

First, create a file named "Firefox Developer Edition.desktop" in the following directory: ~/.local/share/applications. You can use any text editor to create this file, such as Gedit, Nano, or Vim.

Once you have created the file, paste the following content into it:

```ini
[Desktop Entry]
Version=1.0
Name=Firefox Developer Edition
StartupWMClass="firefox-aurora", "Firefox Developer Edition"
GenericName=Web Browser
Exec=/opt/firefox-developer-edition/firefox
Terminal=false
Icon=/opt/firefox-developer-edition/browser/chrome/icons/default/default128.png
Type=Application
Categories=Network;WebBrowser;Favorites;
StartupNotify=true
Keywords=web;browser;internet;
Actions=new-window;new-private-window;
StartupWMClass=Firefox Developer Edition
MimeType=text/html;text/xml;application/xhtml_xml;x-scheme-handler/http;x-scheme-handler/https;x-scheme-handler/ftp;
X-Ayatana-Desktop-Shortcuts=NewWindow;NewIncognito

[Desktop Action NewWindow]
Name=New Window
Exec=/opt/firefox-developer-edition/firefox --new-window %u
OnlyShowIn=Unity;

[Desktop Action NewIncognito]
Name=New Incognito Window
Exec=/opt/firefox-developer-edition/firefox --private-window %u
OnlyShowIn=Unity;
```
Save the file and close the text editor.

Once you have saved the file, Firefox Developer Edition should now appear in your start menu when you type in Firefox. Drag and drop it to your sidebar to create a shortcut.

That's all there is to it! You can now launch Firefox Developer Edition directly from your Start menu or drag and drop it to your sidebar.
