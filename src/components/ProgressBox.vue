<template>
  <div class="border">
    <div class="this-div">
      <span class="label">{{ label }}</span>

      <q-linear-progress
        size="15px"
        :value="progress"
        color="accent"
        class="q-mt-sm bar"
        animation-speed="200"
      />
      <!-- <q-btn
        size="10px"
        color="secondary"
        label="Download Shards"
        class="this-btn"
      /> -->
      <span class="this-btn">
        <!-- <div
          class="nav-button"
          :style="{ 'background-image': 'url(' + img + ')' }"
          @click="if (!clicked) click();"
        /> -->
        <img
          :src="hover && !isClicked ? hoverImg : img"
          :class="{ clickable: !isClicked, disabled: buttonDisabled }"
          @mouseenter="if (!isClicked) hover = true;"
          @mouseleave="if (!isClicked) hover = false;"
          @click="if (!isClicked) click();"
        />
      </span>
    </div>
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
const defaultImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVRYhd2YTU7bYBCGn7GyoF0Eu17EpyARS1hEogeI1IXbs/QAvUpJFogcAESkwhIBvQRUMna9ABaQr4tgk9j5lSd1zLNybI8y7ze/shx3z+j4bfq9gaGCdPy29HsDxBhDvzcwIoLtfCjbr5WIwkeMMXT8tshx98wAWJawbVdLyN/okeFwlEg1AOfTx/Sh69bL8WpFgiBODz68fxgJSUhEbNVrecsN4il+xnXrBEGc3rOyL226CJjuo4WU4Ik2Apa8AyUC1KDY+PD3TiZ+9y4+r9VuFoULouU56fXVbbh2u1kUFvL9aBeAH18uaXlOetKzTtjfO0GApudwfRvSLRiJBPUW1fIcru+iuc9TFMtTTch4ZJoNOxeZb/unDI2h5Tn8/hPx89eB1l8Dkp8jWkycPLDTsNN7yVqhh9FPrWzNfN0/xbxG4uYu4vBcMxJvFBayqLibDTu9Hpp8JBbZL4tK+53WPscjM68mZtmvikqNLGo+L+o1kUelRua5mURm3VhT0rZyGKOUWpaUv3iqrSjZJXAZRISuUjtWmyPZAbgMGt0qQX1FKYu1rSj/m5yQp/i5DD9WYpqPE6kVBDGuW6+EmPEvKPAqJLx/AEbft7IvbDKJ3zBKrfKHQHEkSS0BzLjCCiEA/wAmNq0sQ6WYFQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC';
// TODO: replace with yellow hover button
const hoverImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAACCUlEQVRYhd2YPXPaQBCGnxUUQQWxowq3TpMZjDWeJC0/gY5k/AM9gcr8A9OSxOMQu5NqKhlHhfBMbF2KizR8Bmt0jFCeSl/L7Xu7e7ecXPau6HTbDPpDRQnpdNsy6A8RpRSD/lCJCAeHtaL9ysTDdIZSik63LXLZu1IAliW8PiiXkF8PM+JYJ1IV4PCNnb50nHoxXmUkCMJ04qf3kRaSkIh4Va+uWu4Rj+ETjlMnCML0mbX80b6LgPU+WkgBnphGwJL/QIkAVci3fTTG5wv3k9bFTu02kbsgbHeUXkc3H7PZxRaIIvrxIa8b+YX4sQfAsfUW2x3RuNEzvWmGG+NzpPIMJxDdnjFpfoFWXi/WrFp5mY/Qpve15rW+ic0Nb2yt3RaZo7suKq7AKUQ/z5g0e0YioRHzEUlYjkzt5Br79Gs6sFmUuYgkrERm/FmnkAvR+L2uiabpUQ2kVrKMbipuu/Utl/1LyZ1atjsCWd2L/NhLozO7c/FjT0djnb0BzNSI2pLzzxUjw/wLMzWyJiIJfuztpCaWsVQp/+AuopSh1JLqbxM/kwszLco7OLr9pDe8lyIKlOC3PCMbo7F9pNb6ntkmS5O5DeMtSiaMtSg7aBqLYkXIY/hUhB+ZWOfjQmoFQYjj1EshZv4EBf4Kmd5HgD7fWv5gn0n8Bp1a5T99AElSSwA1r7BECMAf+ce1GhZxP3cAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';
const clickedImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAByklEQVRYhd2YTVLCQBCFX6dYqIsIztyHI7DjGpYuRV2ouNTyGGRFbgD3yRDMAlhQtIs4KfKHhEwS4rcKSaboN6+7pys0ncwwGPbhOnNGCxkM++Q6cxAzw3XmTETo9i6bjqsQS38NZsZg2CeaTmYMAJZFuO62S8j3co3dLkykDgD0bq6ih0LYzURVEKWCaOP9xSoUotEiLuxOeuUZsQm2EMKGUkF0z0q+dO4igOwYLVADkZiGAIv+gRIC0AHKHR+jh6fY7/H7a6Xr8ihdEFLK6NrzvMrX5UGuM+NuL2y/QtgnF/vnx1csqLwd1k5IKeF53slObIJt1LWW/qq8I0mklFBKHXxeBcYc0eQ58zh6BjNHQt/GL6X+J+7IOn2OmCK580KI6B6z6fmUzTui0c4opYw6oTFeI7p484pWCBFdZznx1/pjMdJ+s9rn3f0tgNCZQ07krS9KZTWyj/maSFP5hKidqRqrhs2qHGZDqUXU/OBZOrV06iSHwGMgImPt2FiNnDJ6mOhWGmNC6irqPGppv3WQErIJtk3EUYisGGOppVQAIexWiNn/ggL8CvEXKwDh963kC+eMjhsIU6v5Q6A8pFOLAPC+whZBAPAD4SrOvdEMgKQAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';
const finishedImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAACqElEQVRYhdVYzY7SUBT+Tu1CTWRaG4UncKMOxOWMhhg37khYwBgT43P4ADyIiSawMLBzA0LUWRLGv4VPwMwECjVhiJYeF6W1pTBD7+2Mw7e67b0993733HvOd0r1ahuFUh6NWoexgSiU8tSodUDMjEatw0QETb/2v9cVCyPzBMyMQilPVK+2GQAUhbClbRaR8egEjuMeJBUA9JvX/U7DSElP8OJp59T+1+/z0nMMBpa/8eZw4hLx4JG4mlKjX8ZALqOv7Ov1TWn7U8uGYaQwGFj+u4hFkUnKO02/zQBq+09OHb+324LDDFpz/LI1Ti079E4FxbKxFPfSGq6Qa+jn8NeZ47fTmt/u9U35BRCgkgST8m4TzPF39NW7B6HnZw9bmDkc244HAqC4zhVDNq1DIXmX3r+tQVXk7Ciyi0jgZCYCKSIOMxTJnfRAkp4VioOVYhffjsZ4++mx0KSlQJQjANX53agUu+j1TaG7IhzQbccR/TSUZw4OE4haIHEiIijvtsDMyGV0KY9GwRdLJBvIHw4nK7YTIbI332lvaYtnPOiJ78djvPmYlCf+IREiwUz95XAU6c+mNZ/kzDmfsicRIl6mrhS72E5roagEuES/Ho1Q/SyWudeBMBFVWZ2CglGJ4YZYGSm0DqhebbNXjxhGKpb6fZnvYPLHjtyJSrHrtw/6pp8nVqG00wQRYnlsatm+jDeHE7nMfse4kYjWymV0Xz2L4lzC76K6vQjIi8ZLohqlPOLtvFeXeDhLKy1GNdE6JIhEjlY2HdBOa1R8yWutJUSmlh27bl+8E88ffcDM4YgMUYjgsHglGFzjIkIrHgwsGEZq6cA4uHtra+n737MZfhxb0vYBhP6gAPM84j0E/29tAszhxG8ruDzVqgzIO1oEgIMMNwgEAH8Bhif2yStQayoAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';
// let img = ref(defaultImg);

const click = async () => {
  isClicked.value = true;
  props.buttonClick();
};
</script>
<style scoped>
.border {
  width: 340px;
  height: 100px;
  background-color: #8151c4;
  border: 3px solid #511f95;
  border-radius: 10px;
  padding: 5px 0px;
}
.this-div {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.this-btn {
  text-align: right;
  padding-right: 5%;
  padding-top: 0px;
}
.bar {
  margin: auto;
  width: 90%;
}
.label {
  text-align: left;
  padding-left: 5%;
  font-size: 13px;
}
</style>
