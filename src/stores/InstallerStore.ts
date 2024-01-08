import { defineStore } from 'pinia';
import { ref } from 'vue';
const path = require('path');

export const useInstallerStore = defineStore('installer', () => {
  // Use empty values for now, this will be overwritten with *actual* defaults on app launch using electron
  const homeDir = ref('');
  const appDir = ref('');
  const shardsDir = ref('');

  const minecraftDir = ref(path.join('', '.minecraft'));
  const serverDir = ref(path.join('', 'Drehmal Server'));

  const memory = ref(
    parseInt(process.env.MINECRAFT_MEMORY ? process.env.MINECRAFT_MEMORY : '4')
  );

  return {
    homeDir,
    appDir,
    minecraftDir,
    serverDir,
    shardsDir,
    memory,
  };
});
