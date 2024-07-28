<template>
  <q-page>
    <div v-if="installType === 'singleplayer' || installType === 'multiplayer'">
      <client-configuration />
    </div>

    <div v-else-if="installType === 'server'">
      <server-configuration />
    </div>
  </q-page>
</template>

<script setup lang="ts">
const { ipcRenderer } = require('electron');
import { DiskSpace } from 'check-disk-space';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import ClientConfiguration from 'src/components/ClientConfiguration.vue';
import ServerConfiguration from 'src/components/ServerConfiguration.vue';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useStateStore } from 'src/stores/StateStore';
import { onMounted } from 'vue';

const { installType, disableNextNav } = storeToRefs(useStateStore());
const { drehmalDir, requiredSpaceInGb } = storeToRefs(useInstallerStore());
const q = useQuasar();

const installerSpaceNeeded = requiredSpaceInGb.value.installer;
const drehmalSpaceNeeded = requiredSpaceInGb.value[installType.value];

// disable next navigation button until disk space is checked
// disableNextNav.value = true;
disableNextNav.value = false; // NOTE: check disabled due to inconsistency

// check if user has enough disk space for the installer itself and drehmal
async function checkDiskSpace() {
  // first, check for installer space. this includes any logfiles, electron files, java runtime etc.
  let enoughInstallerSpace = false;
  // use main process to check space on the appdata drive
  const userDiskSpace = (await ipcRenderer.invoke(
    'checkDiskSpace',
    await ipcRenderer.invoke('getAppDataPath')
  )) as DiskSpace;

  const userSpaceFreeGb = +(userDiskSpace.free / Math.pow(1024, 3)).toFixed(2);

  console.log(
    `Checking space on "${userDiskSpace.diskPath}", ${userSpaceFreeGb}/${installerSpaceNeeded}GB free for installer`
  );

  if (userSpaceFreeGb > installerSpaceNeeded) {
    // if there is enough space, log a message and continue
    console.log(`Enough space on "${userDiskSpace.diskPath}" for installer!`);
    enoughInstallerSpace = true;
  } else {
    // otherwise, log error message and display persistent dialogue. rerun this entire check after the user clicks ok
    console.log(
      `Not enough space on "${userDiskSpace.diskPath}" for installer, displaying warning notice...`
    );
    // await a new promise until user clicks ok, otherwise the dialog is spammed
    await new Promise<void>((resolve) => {
      q.dialog({
        title: 'Not Enough Space',
        html: true,
        message:
          `Not enough space on drive <span style="color: #ffde00">${userDiskSpace.diskPath}</span> for installer functionality. ` +
          `The installer needs <span style="color: #ffde00">${installerSpaceNeeded}GB</span> of space to function but you only have <span style="color: #ffde00">${userSpaceFreeGb}GB</span> free.` +
          '<br/><br/>' +
          'Please free up some space and click the button below. ',
        ok: 'I have cleared some space', // text for the ok button
        persistent: true,
        dark: true,
      }).onOk(() => resolve()); // resolve promise on ok button click
    });
  }

  // then, check for the required space for the drehmal files. this changes based on installation type
  // includes, the map, client configuration, client mods etc.
  let enoughDrehmalSpace = false;
  // use main process to check space on the drehmal drive
  const drehmalDiskSpace = (await ipcRenderer.invoke(
    'checkDiskSpace',
    drehmalDir.value
  )) as DiskSpace;

  const drehmalDiskSpaceFreeGb = +(
    drehmalDiskSpace.free / Math.pow(1024, 3)
  ).toFixed(2);

  console.log(
    `Checking space on "${drehmalDiskSpace.diskPath}", ${drehmalDiskSpaceFreeGb}/${drehmalSpaceNeeded}GB for ${installType.value}`
  );

  if (drehmalDiskSpaceFreeGb > drehmalSpaceNeeded) {
    // if there is enough space, log a message and continue
    console.log(
      `Enough space on "${drehmalDiskSpace.diskPath}" for ${installType.value} game installation!`
    );
    enoughDrehmalSpace = true;
  } else {
    // otherwise, log error message and display persistent dialogue. rerun this entire check after the user clicks ok
    console.log(
      `Not enough space on "${drehmalDiskSpace.diskPath}" for ${installType.value} game installation, displaying warning notice...`
    );
    // await a new promise until user clicks ok, otherwise the dialog is spammed
    await new Promise<void>((resolve) => {
      q.dialog({
        title: 'Not Enough Space',
        html: true,
        message:
          `Not enough space on drive <span style="color: #ffde00">${drehmalDiskSpace.diskPath}</span> to install Drehmal. ` +
          `A ${installType.value} installation requires <span style="color: #ffde00">${drehmalSpaceNeeded}GB</span> of space to function but you only have <span style="color: #ffde00">${drehmalDiskSpaceFreeGb}GB</span> free.` +
          '<br/><br/>' +
          'Please free up some space and click the button below. ',
        ok: 'I have cleared some space', // text for the ok button
        persistent: true,
        dark: true,
      }).onOk(() => resolve()); // resolve promise on ok button click
    });
  }

  // if both checks pass, enable the next navigation button. this is only ran once both while loops are satisfied
  // if (enoughInstallerSpace && enoughDrehmalSpace) disableNextNav.value = false; // NOTE: check disabled due to inconsistency
  disableNextNav.value = false;
}

// after component is fully mounted, run the async function to check disk space
// promise-based code cannot be ran top level in component code
onMounted(checkDiskSpace);
</script>
<style scoped lang="sass"></style>
