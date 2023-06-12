# RocketBlock

Anti-procrastination extension.

# How to install

- Download the dist folder
- Go to chrome://extensions
- Toggle the developer mode switch at the top right
- Select "Load Unpacked"
- Load the dist folder

# How to use

- Go to the options page of the extension (Go to chrome://extensions, click "Details" on RocketBlock, click on "Site Settings")
- On that page, you can add websites to ignore, and then select how much time you want to block. Select the "Start Blocking" button to start blocking.

# Code layout

/src contains source code
/dist contains built code that is ready for distribution

# How to build and get the extension ready for distribution

To build:
- Remove the dev stuff from options.html (comments will tell you what you will need to remove)
- Compile options.js at https://babeljs.io/repl. Check "Source Type" to "Script", and under "Presets" make sure "react" is selected. Also make sure "Classic" is selected under the "React Runtime" dropdown menu.

# Developing notes

You will need to comment out all the lines that reference the chrome extension API during development. Remember to uncomment them during build.

# Technology stack

- Javascript as the language
- React.js as the UI library for the options page
- Babel.js to convert the React code into something browser readable
- Chrome Extension API to actually do stuff with the browser 

# Roadmap

idk first I will need to make the build process easier
then add more features 