<template>
  <q-page padding>
    <p>
      In order to host a Drehmal multiplayer server, you will need the map, and
      server jar.
      <br />
      <br />
      You may configure the server installation directory and memory allocation
      below. The installer will create a folder called "Drehmal Server" in the
      directory you select.
      <br />
      <br />
      The server will be configured to support Drehmal, but feel free to edit
      the server.properties file after installation.
    </p>
    <div class="options-div">
      <server-path />
      <memory-select />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ServerPath from 'src/components/ServerPath.vue';
import MemorySelect from 'src/components/MemorySelect.vue';
</script>

<style scoped lang="sass">
.body p
  margin: 10px
  margin-bottom: 40px

.options-div
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 20px
</style>
