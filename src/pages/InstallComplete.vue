<template>
  <div class="border-body">
    <q-layout view="hHh lpR fFf">
      <q-header>
        <div class="border-header">
          <div class="header">
            <img src="../assets/images/title-img.png" alt="" />
          </div>
        </div>
      </q-header>

      <q-page-container>
        <div class="body">
          <hr />
          <p>
            Thanks for downloading Drehmal! To get started, open the Minecraft
            launcher and select the Drehmal Apotheosis profile, then hit play.
          </p>
          <img
            src="../assets/images/transparent-logo.png"
            style="max-width: 224px"
          />
          <!-- <p>
            Next steps:
            <q-list bordered separator dense padding>
              <q-item>Open the Minecraft Launcher</q-item>
              <q-item>From the profile list, select Drehmal Apotheosis</q-item>
              <q-item>Press play!</q-item>
            </q-list>
          </p>
          <p>Check out our socials using any of the buttons below</p> -->
        </div>
      </q-page-container>

      <q-footer>
        <!-- don't touch these class names-->
        <div class="border-footer">
          <div class="footer">
            <!-- Footer Content -->
            <div class="nav-footer">
              <!-- <next-button path="/path/"></next-button> -->
              <div>
                <q-btn
                  size="20px"
                  color="secondary"
                  @click="closeInstaller"
                  label="Close Installer"
                  class="close-btn"
                >
                </q-btn>
                <socials-grid />
              </div>
            </div>
          </div>
        </div>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import log from 'electron-log';
const { ipcRenderer } = require('electron');
import SocialsGrid from '../components/SocialsGrid.vue';

const closeInstaller = () => {
  log.info('Opening Minecraft Launcher and closing process');

  // Send call to main process to close application
  ipcRenderer.invoke('quit');
};
</script>

<style scoped>
.nav-footer {
  /* display: flex; */
  /* flex-direction: column; */
  /* gap: 50px; */
  margin-bottom: 10px;
}
.close-btn {
  margin-bottom: 20px;
}
.nav-footer img {
  height: 128px;
  width: 128px;
}
</style>
