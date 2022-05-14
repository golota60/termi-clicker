## Node template

While building `yayfetch`, I've created a comfortable setup that can be an entry point for my apps. This repo is that entry point. 

### Opinions

This template is quite unopinionated, but you might still find some things that are not your style. With that in mind, here's what is used here:
 - Jest for testing 
 - @callstack/eslint-config/node as a eslint config

### Before you use

 - Check whether you want to use `commonjs`. This entrypoint will be ideal for CLIs, but if you want to ship an actual module, this might be more complicated

### Setup

 - `yarn` to install all the dependencies
 - `yarn start` to run default script

### Contributing

If see any bugs, want to improve this repo or have some useful insight - feel free to create an issue