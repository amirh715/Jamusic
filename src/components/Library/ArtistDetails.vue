<template>
  <div @click="goToInstagram" class="flex">
    <ion-icon :icon="logoInstagram" size="large"></ion-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { logoInstagram } from 'ionicons/icons';

export default defineComponent({
  name: 'artist-details',
  props: {
    instagramId: String,
  },
  data() {
    return {
      logoInstagram,
    }
  },
  methods: {
    goToInstagram() {
      window.open(`https://instagram.com/${this.instagramId}`);
    },
  },
})
</script>
