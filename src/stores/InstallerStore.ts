import { defineStore } from 'pinia';
import { ref } from 'vue';
const path = require('path');
const os = require('os');
// export const usePathStore = defineStore('path', () => {
//   const count = ref(0);
//   const name = ref('Jimmy');
//   const doubleCount = computed(() => count.value * 2);
//   function increment() {
//     count.value++;
//   }
//   return { count, name, doubleCount, increment };
// });

// https://pinia.vuejs.org/core-concepts/#Setup-Stores
// In Setup Stores:
// ref()s become state properties
// computed()s become getters
// function()s become actions

export const useInstallerStore = defineStore('installer', () => {
  // Set default directory paths
  const homeDir = ref(
    process.platform === 'win32'
      ? (process.env.APPDATA as string)
      : os.homedir()
  );
  const appDir = ref(path.join(homeDir.value, 'Drehmal Installer'));
  const minecraftDir = ref(path.join(homeDir.value, '.minecraft'));
  const shardsDir = ref(path.join(appDir.value, 'shards'));
  const minecraftDirIsDefault = ref(true);
  const memory = ref(4);
  // const getHomeDir = computed(() => homeDir.value);
  // const getMinecraftDir = computed(() => minecraftDir.value);
  // const getMinecraftMemory = computed(() => memory.value);
  // function setHomeDir(path: string) {
  //   homeDir.value = path;
  // }
  // function setMinecraftDir(path: string) {
  //   minecraftDir.value = path;
  // }
  // function setMemory(newMemory: number) {
  //   memory.value = newMemory;
  // }
  return {
    homeDir,
    appDir,
    minecraftDir,
    shardsDir,
    minecraftDirIsDefault,
    memory,
    // getHomeDir,
    // getMinecraftDir,
    // setHomeDir,
    // setMinecraftDir,
    // setMemory,
  };
});
