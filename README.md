# ![rocketblock icon](src/extension_files/rocketblock32.png) RocketBlock

> *Downing distractions to defend your time*

RocketBlock is a strict Chrome extension that is designed for self-control (not parental or administrative control).

It works by blocking all sites except for ignore-listed ones and prevents you from stopping the extension while the block is enabled.

# How to install

- Download the `rocketblock-dist` folder from the [releases page](https://github.com/BaconErie/rocketblock/releases)
- Go to chrome://extensions
- Toggle the developer mode switch at the top right
- Select "Load Unpacked" at the top left
- Load the dist folder

# How to use

- Go to the settings page of the extension
    - Click on the extension logo at the extension bar OR
    - Go to chrome://extensions, click "Details" on RocketBlock, click on "Site Settings"
- On the settings page, you can add websites to ignore, and then select how much time you want to block. Select the "Start Blocking" button to start blocking.

# Code layout

- `/src` contains source code
    - `extension_files/` contains non-React files (e.g. logos, manifest.json, background/content scripts)
    - `options/` contains React code for the options page

- Files at top-most directory has config files for Webpack and Babel

# How to build the extension from source

*Note: You will need Node.js and npm installed*

1. Download the source code (one way is from the [releases page](https://github.com/BaconErie/rocketblock/releases))

2. Run `npm install` at the top most directory to install all the dependencies (make sure your NODE_ENV is NOT set to production)

3. Run `npm run build`. The built and ready-to-use extension will be in the dist folder.

# Technology stack

- JavaScript as the language
- React.js as the UI library for the options page
- Webpack and Babel.js to compile and make the options page browser readable
- Chrome Extension API to actually do stuff with the browser 

# Roadmap

See the [Github issues page](https://github.com/BaconErie/rocketblock/issues/1) for the roadmap.

# License

RocketBlock is licensed under the MIT license. See the [LICENSE file](LICENSE) for details. All dependencies are owned and licensed by their respective owners.