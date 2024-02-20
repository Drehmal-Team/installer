# Drehmal 2.2: Apotheosis Installer

[![Discord](https://img.shields.io/discord/695817407557795910?style=for-the-badge&label=Drehmal%202.2%3A%20Apotheosis)](https://discord.gg/xFsRQsDnuj)

An installer made for Drehmal 2.2: Apotheosis to simplify the map's installation process.

## Features

- Multiple installation types
  - The classic singleplayer experience
  - Multiplayer installation for playing with friends on a server
  - Server setup for running your own Drehmal serever
- Dedicated Minecraft Launcher profile for client-side installations
- Lightweight and easy-to-use with a low memory footprint

## How-To

- Ensure you've downloaded the [Minecraft Launcher](https://www.minecraft.net/en-us/download) and ran it _at least once_
- Download the [latest release for your platform](https://github.com/Drehmal-Team/installer/releases/latest)
  - Windows: `.exe`
  - MacOS: `.dmg`, `.zip`
  - Linux: `.AppImage`, `.deb`, `.tar.gz`
- Run the installer, following the instructions provided by the application
- You may install Drehmal for a singleplayer, multiplayer, or server hosting
  - **NOTE**: If you plan on hosting a Drehmal server, you must handle port forwarding, domain names etc. yourself. The installer _will not_ manage that on your behalf. The installer will provide all files necessary for running the server.

## Bugs

If you encounter issues with the installer, please check [open bug reports](https://github.com/Drehmal-Team/installer/issues?q=is%3Aissue+is%3Aopen+label%3A%22bug%22) to see if your issue has already been reported, if there are any updates, workarounds etc.

If there isn't an open report for your issue, then [please fill out a bug report](https://github.com/Drehmal-Team/installer/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D+Bug+Title) with the requested information.

The most helpful part is uploading your log file, so please don't forget to do that. Logs can be found at one of these locations:

- Widows: `%APPDATA%/Drehmal Installer/logs`
- Other: `~/Drehmal Installer/logs`

Thanks in advance <3

## Credits

This project was created using [Quasar](https://quasar.dev/), [Electron](https://www.electronjs.org/), and [Vue](https://vuejs.org/) with HTML, CSS and [TypeScript](https://www.typescriptlang.org/) in [VSCode](https://code.visualstudio.com/).

### Mods

Massive thanks to each of the following Minecraft mods for enhancing the experience and immersiveness of the map!

- [Animatica](https://modrinth.com/mod/animatica)
- [CIT Resewn](https://modrinth.com/mod/cit-resewn)
- [Cull Leaves](https://modrinth.com/mod/cull-leaves)
- [Dynamic FPS](https://modrinth.com/mod/dynamic-fps)
- [Entity Culling](https://modrinth.com/mod/entity-culling)
- [Fabric API](https://modrinth.com/mod/fabric-api)
- [FabricSkyboxes](https://modrinth.com/mod/fabricskyboxes)
- [Indium](https://modrinth.com/mod/indium)
- [Iris Shaders](https://modrinth.com/mod/iris)
- [LambDynamicLights](https://modrinth.com/mod/lambdynamiclights)
- [Lazy DFU](https://modrinth.com/mod/lazydfu)
- [Lithium](https://modrinth.com/mod/lithium)
- [Starlight](https://modrinth.com/mod/starlight)
- [Sodium](https://modrinth.com/mod/sodium)
- [Sodium Extra](https://modrinth.com/mod/sodium-extra)
- [Reese's Sodium Options](https://modrinth.com/mod/reeses-sodium-options)
- [WI Zoom](https://modrinth.com/mod/wi-zoom)
- [Entity Texture Features](https://modrinth.com/mod/entitytexturefeatures)
- [CEM](https://modrinth.com/mod/cem)
  - [Modified Version](https://github.com/YoungSoulluoS/cem_Fork): YoungSoulluoS for creating a modified version with additional compatabilities!

### Shaders

Additional thanks goes out to Sildur for creating [Sildur's Enhanced Default](https://sildurs-shaders.github.io/)!

## Development

Created using [Quasar](https://quasar.dev/), [Electron](https://www.electronjs.org/), and [Vue](https://vuejs.org/) with HTML, CSS and [TypeScript](https://www.typescriptlang.org/) in [VSCode](https://code.visualstudio.com/).

Quasar is a meta-framework for VueJS and is what handles the cofiguration for Electron, Vue, and Vite. Quasar's [configutation file](./quasar.config.js) is almost always the intentional method of updating the project's configuration. Documentation for that can be found on their [docs page](https://quasar.dev/quasar-cli-vite/quasar-config-file), and the configuration file provides IDE autocomplete. Quasar also provides many helpers such as a [`$q` object](https://quasar.dev/options/the-q-object/) (`useQuasar()` in script setup), and [pre-made components](https://quasar.dev/vue-components/ajax-bar) to work with.

Development mode supports hot-code reloading, error reporting etc. via Quasar. [package.json](./package.json) includes common quasar commands, removing/reducing the need to use Quasar's CLI directly, though it is still useful and recommended to know. Documentation [here](https://quasar.dev/quasar-cli-vite/commands-list).

```bash
# Install dependencies
yarn
# build the project in development mode (hot reloading, auto-recompilation etc.)
yarn dev
# lint project for errors or warnings
yarn lint
# clean re-install: removes /node_modules, /dist etc. and re-fetches deps
yarn clean
```

### Building

Build commands are platform-specific, and you must be on that platform to build for it. This is automated via GitHub actions using [this workflow](/.github/workflows/build.yml) when a new tag is created. To begin the workflow, [draft a new release](https://github.com/Drehmal-Team/installer/releases/new) with a _new tag_. Choose an appropriate title and description. GitHub will build for all platforms and add each platform's files to the newly created release.

If you would like to build a release locally for your current platform, you may use one of the following commands (after cloning the repo).

```bash
# you must be on that platform to build a release for it
yarn build:win
yarn build:linux
yarn build:osx
```
