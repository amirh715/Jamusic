<template>
  <div :style="style">
    <h2 class="text-center">{{title}}</h2>
    <p>{{description}}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'background-placeholder',
  props: {
    title: String,
    description: String,
    image: Blob,
  },
  computed: {
    style() {
      if(!this.image) return {};
      const imageSrc = URL.createObjectURL(this.image);
      return {
        backgroundImage: `${this.image ? 'url(' + imageSrc + ')' : ''}`,
      }
    },
  },
})
</script>
