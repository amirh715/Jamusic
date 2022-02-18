<template>
  <div class="flex justify-content-around align-items-center">
    <ion-range></ion-range>
    <ion-icon
      size="large"
      :icon="playerIcon"
      @click="playPauseButtonClicked"
    ></ion-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { playCircleOutline, pauseCircleOutline } from 'ionicons/icons'
import { ACTION_TYPES } from '@/store/ACTION_TYPES';

export default defineComponent({
  name: 'track-player',
  props: {
    trackId: String,
  },
  data() {
    return {
      currentDuration: 0,
      totalDuration: 0,
      playCircleOutline,
      pauseCircleOutline,
    };
  },
  computed: {
    playerIcon() {
      return this.$store.state.isPlaying ? pauseCircleOutline : playCircleOutline;
    },
  },
  methods: {
    playPauseButtonClicked() {
      if(this.$store.state.player.isPlaying) {
        // this track is now playing, thus the player must be paused
        if(this.$store.state.player.currentTrack.id === this.trackId)
          return this.$store.dispatch(ACTION_TYPES.PAUSE);
      }
      // play this track (by adding it to the play queue)
      this.$store.dispatch(ACTION_TYPES.ADD_TO_PLAY_QUEUE);
    },
  },
})
</script>
