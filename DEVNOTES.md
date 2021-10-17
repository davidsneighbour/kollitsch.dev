## Development Environment

### pre-commit

```shell
pip install pre-commit
pre-commit install
pre-commit run --all-files
pre-commit autoupdate
pre-commit autoupdate
pre-commit gc
```

## NPM scripts

### Installation and Setup

```shell
npm install
```

### Development server

Add a file named `.env` to the root of your repository containing your local setup:

```ini
IP=192.168.1.201
PORT=1313
```

Do NOT commit this file to the repository.

To run the development server run 

```shell
npm run server
```

### Build scripts

This repository is currently optimised for Netlify. To create a local copy of the website run the following command:

```shell
./bin/netlify.sh
```

### Releasing

## HeroIcons

- [Github Repository](https://github.com/tailwindlabs/heroicons)
- [Website with icon overview](https://heroicons.com/)


## Publishing on Netlify

- running `npm run release` will create a new tag in the `main` branch
- it will merge the `main` branch into the `live` branch
- Netlify is set up to only deploy the `live` branch
- thus only releases will trigger a deploy
