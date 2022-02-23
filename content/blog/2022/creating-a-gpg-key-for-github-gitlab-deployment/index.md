---
title: "Creating a GPG Key for Github/Gitlab Deployment"
description: ""
summary: ""

date: 2022-02-23T22:43:14+07:00
publishDate: 2022-02-23T22:43:14+07:00
lastmod: 2022-02-23T22:43:14+07:00

resources:
  - title: "Photo by [Mauro Sbicego](https://unsplash.com/@maurosbicego) via [Unsplash](https://unsplash.com/)"
    src: "mauro-sbicego-4hfpVsi-gSg-unsplash.jpg"

tags:
  - encryption
  - security
  - github
  - gitlab

---

Every now and then I have to add a GPG-key to one of my projects. Last week for instance a key expired that I used for a year to sign my commits. And every time that happens, I have to google how to create my key again. So let's go through the motions of how to create a new GPG key (which once you read through it all is astonishingly easy).

```bash
gpg2 --full-generate-key
```

This command creates a new GPG key. You will be asked to select a key type (I chose RSA/RSA), a key length (I chose 4096 bits) and a key expiration date (I chose 1 year from now). After this you get to setup the key configuration with your real name, email address and a comment. I chose the name and email address I use with Github and as comment a nice "GPG key for github/lab commits". After that you are asked to verify your setup and the key is created.

A popup will ask you for a password. In my case the setup is so that the key is saved to my local keychain that is loaded once per log in to my machine. This way I will have to enter my keys password once a day in normal cases, which is safe and nicely secure. Based on your local setup you might want to choose an empty password (if for instance your session is password secured and your computer will never be stolen or hacked, which will probably never happen, or once and then... well... ok, just choose a password here!). But don't. Add a secure password and your key is prepared.

After this let GPG show your new key:

```bash
gpg2 --list-secret-keys --keyid-format LONG
```

A sample output could look like this:

```plaintext
❯ gpg2 --list-secret-keys --keyid-format LONG
/home/patrick/.gnupg/pubring.kbx
--------------------------------
sec   rsa4096/40BCAA0B2E3817F4 2022-02-17 [SC] [expires: 2023-02-17]
      0FAE21A9BBFDA0FA6E90DF7A40BCAA0B2E3817F4
uid                 [ultimate] Patrick Kollitsch (GPG Key for Github only) <patrick@davids-neighbour.com>
ssb   rsa4096/1C261C6830454AF7 2022-02-17 [E] [expires: 2023-02-17]
```

The code after rsa4096 in this sample, `40BCAA0B2E3817F4` is the ID of your key. Take a note of it and export your key:

```bash
gpg2 --armor --export YOUR_KEY_ID
```

Replace YOUR_KEY_ID with the ID of your key (in the case above `40BCAA0B2E3817F4`). This will print your key on the CLI. Do not post this part online, because that is your secret key. Having this in a commit of your repo or anywhere other people can see it is a security risk and you should deprecate that key immediately.

Take this key (everything including `-----BEGIN PGP PUBLIC KEY BLOCK-----` and `-----END PGP PUBLIC KEY BLOCK-----`) and copy it into the setup of your project. In Github you can find that in your [profile settings](https://github.com/settings/keys). Add a notice that reminds you of how this key came to be and all will be well.

Now you can just set your local Git configuration to automatically sign commits with your key.

```bash
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
```

After this, when you commit something, it will be signed with your key.

This all amounts to the following quick and dirty workflow:

```bash
gpg2 --full-generate-key
gpg2 --list-secret-keys --keyid-format LONG
gpg2 --armor --export YOUR_KEY_ID
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
```
