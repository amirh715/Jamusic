<template>
  <div class="flex" style="height: 3.5rem; backdrop-filter: blur(20px);">
    <div @click="$emit('titleTapped')" style="width: 80%">
      <text-banner
        :text="title"
        :animate="false"
      />
    </div>
    <div @click="$emit('buttonTapped')" class="flex justify-content-center align-items-center" style="width: 20%">
      <ion-icon
        :icon="icon"
        style="font-size: 2.7rem"
      ></ion-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  playCircleOutline,
  pauseCircleOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'mini-player',
  emits: ['titleTapped', 'buttonTapped'],
  props: {
    isPlaying: Boolean,
    title: String,
    waiting: Boolean,
  },
  computed: {
    icon() {
      return this.isPlaying ? pauseCircleOutline : playCircleOutline;
    },
  },
})
</script>
