<template>
  <div class="flex flex-column" style="height: 3.5rem; backdrop-filter: blur(20px);">
    <div class="flex" style="height: 95%;">
      <div @click="$emit('buttonTapped')" class="flex justify-content-center align-items-center" style="width: 20%">
        <ion-icon
          :icon="icon"
          style="font-size: 2.7rem"
        ></ion-icon>
      </div>
      <div @click="$emit('titleTapped')" class="flex flex-column" style="width: 80%;">
        <text-banner :animate="currentTrack.title.length > 15">
          <b>{{currentTrack.title}}</b>
        </text-banner>
        <small>{{currentTrack.artist.title}}</small>
      </div>
    </div>
    <div :style="{width: `${seekPosition}%`, height: '5%', border: '2px solid red'}"></div>
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
  computed: {
    currentTrack() {
      return this.$store.state.player.currentTrack;
    },
    seekPosition() {
      const currentDuration = this.$store.state.player.currentDuration;
      const totalDuration = this.$store.state.player.totalDuration;
      return (currentDuration * 100) / totalDuration;
    },
    icon() {
      return this.$store.state.player.isPlaying ? pauseCircleOutline : playCircleOutline;
    },
  },
})
</script>
