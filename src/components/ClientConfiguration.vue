<template>
  <div class="white center full-width">
    <div class="body">
      <p>
        If you're capable of running shaders, you may choose to install them
        here. The installer will download, configure and enable the map's
        recommended shader pack when you install mods. You can configure shader
        settings further in the Video Settings in-game.
        <br />
        <br />
        The bundled shader pack,
        <a href="https://sildurs-shaders.github.io/" style="color: #3f9ae4"
          >Sildur's Enhanced Default</a
        >, is officially recommended and will be configured to work correctly
        with the map. You may choose to use another shader pack, but you may run
        into issues with blindness effects and skyboxes later in the map.
        <br />
        <br />
        If you choose to install shaders but are unable to run them, you may
        re-run the installer and unselect the shaders option, or manually
        disable them in-game through Video Settings.
      </p>
    </div>
    <div class="toggle-box">
      <q-toggle
        v-model="shaders"
        color="accent"
        label="Install Shaders?"
        left-label
        size="lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';

const { shaders } = storeToRefs(useInstallerStore());
</script>
<style scoped lang="sass">
.shader-box
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 20px

.body p
  padding: 10px

.toggle-box
  padding: 1rem

  background-color: #7e57c2

  border-radius: 0.3rem

  font-size: 17px
  text-align: center
  font-weight: bold
  line-height: 32px
  width: 60%
  height: 80px
  max-height: 80px
</style>
