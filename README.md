## Node template

While building `yayfetch`, I've created a comfortable setup that can be an entry point for my apps. This repo is that entry point. 

### Opinions

This template is quite unopinionated, but you might still find some things that are not your style. With that in mind, here's what is used here:
 - Jest for testing 
 - @callstack/eslint-config/node as a eslint config

### Before you use

 - Check whether you want to use `commonjs`. This entrypoint will be ideal for CLIs, but if you want to ship an actual module, this might be more complicated
 - This repo will at some point use `ECMAScript modules` - probably when the usage of them will yield no problems - currently, there's problems that are non-trivial to fix easily while keeping the dev experience good(mainly that imports with typescript need to contain an extension - it feels weird to import a js file into a ts codebase, also autoimporting doesn't catch that - this can be fixed with vscode options, but even when you do that then linter is going to be mad that you're importing a nonexistant js file - this would require adding a bundler, which i may or may not do in the future)

### Setup

 - `yarn` to install all the dependencies
 - `yarn start` to run default script

### Contributing

If see any bugs, want to improve this repo or have some useful insight - feel free to create an issue