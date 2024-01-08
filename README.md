# Drehmal Installer

Drehmal, Minecraft map installer. The idea is to install everything needed for Drehmal with as little friction as possible.

## Goals:

- Easy to use, low memory footprint
- Based on host OS, appropriately select path(s)
- Install files for any of single player, multiplayer or multiplayer host
- Download the map file
- Download the resource pack
- Download and install fabric
- Download and install client-side mods
- Creates a named Minecraft launcher profile

## Todo

- ✅ Use non-gdrive map source (eg. drehmal.net sharded archives)
- ❌ Test on Linux
- ❌ Test on MacOs
- ✅ Test on Windows
- ❌ Create backend server pointing to up to date resources
- ✅ Refactor large components (eg. `components/MapDownload.vue`) into multiple smaller ones
- ✅ Set Drehmal Resource Pack as active
- ✅ Cleanup installation files (fabric launcher, map tarball)
- ❌ Improve application logging
- ❌ App-wide error catching and handling
- ❌ Recovery states on errors
- ✅ Singleplayer functionality (map, resource pack, mods)
- ✅ Multiplayer client functionality (resource pack, mods)
- ✅ Multiplayer host functionality (map, server jar)

## Known Issues

- Install page state isn't stored
- Users can use browser forward/back button to navigate between pages
- Fabric install button breaks if user doesn't have Java installed or Java in their path (needed for CLI Fabric call)

### Development

Created using [Quasar](https://quasar.dev/), [Electron](https://www.electronjs.org/), and [Vue](https://vuejs.org/) with HTML, CSS and [TypeScript](https://www.typescriptlang.org/) in [VSCode](https://code.visualstudio.com/).

Quasar is a meta-framework for VueJS and is what handles the cofiguration for Electron, Vue, and Vite. Quasar's [configutation file](./quasar.config.js) is almost always the intentional method of updating the project's configuration. Documentation for that can be found on their [docs page](https://quasar.dev/quasar-cli-vite/quasar-config-file), and the configuration file provides IDE autocomplete. Quasar also provides many helpers such as a [`$q` object](https://quasar.dev/options/the-q-object/) (`useQuasar()` in script setup), and [pre-made components](https://quasar.dev/vue-components/ajax-bar) to work with.

Development mode supports hot-code reloading, error reporting etc. via Quasar. [package.json](./package.json) includes common quasar commands, removing/reducing the need to use Quasar's CLI directly, though it is still useful and recommended to know. Documentation [here](https://quasar.dev/quasar-cli-vite/commands-list).

```bash
# Install dependencies
yarn
# In development mode
yarn dev
# Linting
yarn lint
# Building the project on win
```

### Building

Build commands are platform-specific, and you must be on that platform to build for it. The idea here is to automate this via eg. GitHub Actions and publish the build artifacts for each platform that way.

```bash
# Build commands are platform-specific, and you must be on that platform to build for it
yarn build:win
yarn build:linux
yarn build:osx
```
