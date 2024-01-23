<template>
  <q-page>
    <div class="body">
      <p>
        To play Drehmal on a server, you will need the resource pack and
        client-side mods. Drehmal's files will be installed in it's own
        directory alongside the default Minecraft location to preserve existing
        game data.
        <br />
        <br />
        You may configure the installation directory and memory allocation for
        Drehmal below. If you are unsure, use the default options.
      </p>

      <div class="options-div">
        <folder-select />
        <memory-select />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import FolderSelect from 'src/components/FolderSelect.vue';
import MemorySelect from 'src/components/MemorySelect.vue';
</script>

<style scoped lang="sass">
.body p
  padding: 10px

.options-div
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 20px
</style>
