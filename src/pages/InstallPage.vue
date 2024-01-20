<template>
  <q-page class="q-pa-sm flex flex-center">
    <div v-if="installType === 'singleplayer'" class="full-width">
      <singleplayer-install />
    </div>
    <div v-else-if="installType === 'multiplayer'" class="full-width">
      <multiplayer-install />
    </div>
    <div v-else-if="installType === 'server'" class="full-width">
      <server-install />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import MultiplayerInstall from 'src/components/MultiplayerInstall.vue';
import ServerInstall from 'src/components/ServerInstall.vue';
import SingleplayerInstall from 'src/components/SingleplayerInstall.vue';

import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useStateStore } from 'src/stores/StateStore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const fs = require('fs');
const path = require('path');

const { installType } = storeToRefs(useStateStore());
console.log(`Using install type: ${installType.value}`);

const { minecraftDir } = storeToRefs(useInstallerStore());
const router = useRouter();

const q = useQuasar();
const launcherProfilesPath = path.join(
  minecraftDir.value,
  'launcher_profiles.json'
);

async function validateLauncher() {
  console.log(`Checking launcher profile file: ${launcherProfilesPath}`);
  if (!fs.existsSync(launcherProfilesPath))
    await new Promise<void>((resolve) => {
      console.log('Launcher profile file not found...');
      q.dialog({
        title: 'Profile file not found',
        html: true,
        message:
          'Minecraft Launcher profile file not found. ' +
          "Please ensure you've run Minecraft at least once or select an appropriate installation folder!<br/><br/>" +
          'Use the button below to go back and either launch then close Minecraft, or select a different installation folder.',
        ok: 'Go Back',
        persistent: true,
        dark: true,
      }).onOk(() => {
        // resolve promise, then return to previous page
        resolve();
        router.back();
      });
    });
  else console.log('Launcher profile file found!');
}

// Only validate launcher profile file if installing singleplayer or multiplayer
if (installType.value === 'singleplayer' || installType.value === 'multiplayer')
  onMounted(validateLauncher);
</script>
<style scoped lang="sass"></style>
