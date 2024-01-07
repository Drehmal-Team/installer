<template>
  <div class="this-div">
    <span class="label">{{ downloadLabel }}</span>
    <q-linear-progress
      size="30px"
      :value="downloadProgress"
      color="accent"
      class="bar"
      animation-speed="200"
      rounded
    />
    <span class="label">{{ extractLabel }}</span>
    <q-linear-progress
      size="30px"
      :value="extractProgress"
      color="accent"
      class="bar"
      animation-speed="200"
      rounded
    />
    <span class="this-btn">
      <img
        src="../assets/images/icons/buttons/down-button-purple.png"
        :class="{ clickable: !isClicked, disabled: buttonDisabled }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @click="if (!isClicked) click();"
        v-if="!isClicked && !hover"
        width="50px"
        height="30px"
        no-spinner
        loading="eager"
        :img-style="{ transition: '0.01s ease' }"
      />
      <img
        src="../assets/images/icons/buttons/down-button-yellow.png"
        :class="{ clickable: !isClicked, disabled: buttonDisabled }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @click="if (!isClicked) click();"
        v-if="!isClicked && hover"
        width="50px"
        height="30px"
        no-spinner
        loading="eager"
        :img-style="{ transition: '0.01s ease' }"
      />
      <img
        src="../assets/images/icons/buttons/down-button-grey.png"
        class="disabled"
        v-if="isClicked && extractProgress < 1"
        width="50px"
        height="30px"
        no-spinner
        loading="eager"
        :img-style="{ transition: '0.01s ease' }"
      />
      <img
        src="../assets/images/icons/buttons/small-button-check.png"
        class="disabled"
        v-if="isClicked && extractProgress === 1"
        width="50px"
        height="30px"
        no-spinner
        loading="eager"
        :img-style="{ transition: '0.01s ease' }"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps([
  'totalSize',
  'downloaded',
  'downloadLabel',
  'downloadProgress',
  'downloadPercent',
  'extractCount',
  'extracted',
  'extractLabel',
  'extractProgress',
  'extractPercent',
  'img',
  'buttonClick',
  'buttonDisabled',
]);

let isClicked = ref(false);
let hover = ref(false);

const click = async () => {
  isClicked.value = true;
  props.buttonClick();
};
</script>
<style scoped>
.this-div {
  display: flex;
  flex-direction: column;
  background-color: #8151c4;
  border: 3px solid #511f95;
  border-radius: 10px;
  padding: 5px 0px;
  height: 200px;
}
.this-btn {
  text-align: right;
  padding-right: 2%;
  padding-bottom: 0px;
  padding-top: 0px;
  /* height: 20px; */
}
.bar {
  margin: auto;
  width: 96%;
}
.label {
  text-align: left;
  padding-top: 1%;
  padding-left: 2%;
  font-size: 13px;
}
</style>
