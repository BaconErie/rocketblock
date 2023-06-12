# RocketBlock

Anti-procrastination extension.

/src contains source code
/dist contains built code that is ready for distribution

# How to build and get the extension ready for distribution

To build:
- Remove the dev stuff from options.html (comments will tell you what you will need to remove)
- Compile options.js at https://babeljs.io/repl. Check "Source Type" to "Script", and under "Presets" make sure "react" is selected. Also make sure "Classic" is selected under the "React Runtime" dropdown menu.

# Developing notes

You will need to comment out all the lines that reference the chrome extension API during development. Remember to uncomment them during build.

# Roadmap

idk first I will need to make the build process easier
then add more features 