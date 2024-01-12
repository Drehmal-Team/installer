<template>
  <div class="this-div">
    <span class="label">{{ label }}</span>
    <q-linear-progress
      size="15px"
      :value="progress"
      color="accent"
      class="q-mt-sm bar"
      animation-speed="200"
    />
    <span class="this-btn">
      <img
        src="../assets/images/icons/buttons/down-button-purple.png"
        :class="{ clickable: !isClicked, disabled: buttonDisabled }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @click="if (!isClicked) click();"
        v-show="!isClicked && !hover"
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
        v-show="!isClicked && hover"
        width="50px"
        height="30px"
        no-spinner
        loading="eager"
        :img-style="{ transition: '0.01s ease' }"
      />
      <img
        src="../assets/images/icons/buttons/down-button-grey.png"
        class="disabled"
        v-show="isClicked && progress < 1"
        width="50px"
        height="30px"
        no-spinner
        loading="eager"
        :img-style="{ transition: '0.01s ease' }"
      />
      <img
        src="../assets/images/icons/buttons/small-button-check.png"
        class="disabled"
        v-show="isClicked && progress === 1"
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
  'label',
  'progress',
  'percent',
  'buttonClick',
  'img',
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
  gap: 8px;
  background-color: #8151c4;
  border: 3px solid #511f95;
  border-radius: 10px;
  padding: 5px 0px;
  height: 100px;
}
.this-btn {
  text-align: right;
  padding-right: 5%;
  padding-top: 0px;
}
.bar {
  margin: auto;
  width: 94%;
}
.label {
  text-align: left;
  padding-left: 3%;
  font-size: 13px;
}
img {
  transition: 0.2s ease;
}
</style>
