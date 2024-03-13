import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useSourcesStore } from './SourcesStore';
const path = require('path');

export const useInstallerStore = defineStore('installer', () => {
  const { map } = storeToRefs(useSourcesStore());
  // Use empty values for now, this will be overwritten with *actual* defaults on app launch using electron
  const homeDir = ref('');
  const appDir = ref('');
  const configDir = ref('');

  const minecraftDir = ref(path.join('', '.minecraft'));
  const drehmalDir = ref(path.join('', '.minecraft_drehmal'));

  const javaExePath = ref('');
  const javawExePath = ref('');

  const memory = ref(
    parseInt(process.env.MINECRAFT_MEMORY ? process.env.MINECRAFT_MEMORY : '4')
  );

  const shaders = ref(false);
  const serverOpts = ref({
    motd: map.value.versionName,
    pvp: false,
    difficulty: 'normal',
    hardcore: false,
    maxPlayers: 10,
  });

  const requiredSpaceInGb = ref({
    installer: 1,
    singleplayer: 10,
    multiplayer: 1,
    server: 10,
  });

  return {
    homeDir,
    appDir,
    configDir,
    minecraftDir,
    drehmalDir,
    memory,
    javaExePath,
    javawExePath,
    shaders,
    serverOpts,
    requiredSpaceInGb,
  };
});
