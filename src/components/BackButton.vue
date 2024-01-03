<template>
  <router-link :to="path">
    <div class="nav-button"></div>
  </router-link>
</template>

<script setup lang="ts">
defineProps(['path']);
</script>

<style scoped>
.nav-button {
  height: 44px;
  width: 68px;
  background: url('src/assets/images/back-button-purple.png') no-repeat;
  display: inline-block;
}
.nav-button:hover {
  background: url('src/assets/images/back-button-yellow.png') no-repeat;
}
</style>
