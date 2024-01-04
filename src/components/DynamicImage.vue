<template>
  <img :src="imagePath" alt="img" />
</template>

<script>
export default {
  props: {
    item: String,
  },
  data() {
    return {
      imagePath: null,
    };
  },
  async mounted() {
    this.imagePath = await import(
      // `src/assets/images/icons/socials/${this.item}-purple.png`
      `../assets/images/${this.item}.png`
    );
  },
};
</script>
