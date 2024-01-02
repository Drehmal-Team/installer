<template>
  <div class="border-body">
    <q-layout view="hHh lpR fFf">
      <q-header>
        <div class="border-header">
          <div class="header">
            <img src="src/assets/title-img.png" alt="" />
          </div>
        </div>
      </q-header>

      <q-page-container>
        <div class="body">
          <hr />
          <p>
            Welcome to the Drehmal v2.2: Apotheosis installer. This is designed
            to help set up all mods, saves, and resource packs you may need to
            play the greatest survival exploration experience in Minecraft!
          </p>
        </div>
      </q-page-container>

      <q-footer>
        <!-- don't touch these class names-->
        <div class="border-footer">
          <div class="footer">
            <!-- Footer Content -->
            <div class="nav-footer">
              <next-button path="/path/"></next-button>
            </div>
          </div>
        </div>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import NextButton from 'src/components/NextButton.vue';
import { useInstallerStore } from 'src/stores/InstallerStore';

const installerStore = useInstallerStore();
const { homeDir, appDir, memory, minecraftDir, minecraftDirIsDefault } =
  installerStore;
console.log('Loaded Paths store with defaults:', {
  homeDir,
  appDir,
  memory,
  minecraftDir,
  minecraftDirIsDefault,
});
</script>

<style scoped>
.body {
  font-size: 18px;
}
hr {
  height: 5px;
}
</style>
