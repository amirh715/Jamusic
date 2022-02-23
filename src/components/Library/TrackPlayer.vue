<template>
  <div class="flex justify-content-around align-items-center">
    <div style="width: 90%">
      <ion-range
        ref="range"
        :value="currentSeekPosition"
        @ionFocus="isRangeFocused = true"
        @ionBlur="isRangeFocused = false"
        @ionChange="seekPositionChanged"
        min="0" max="100">
          <ion-label slot="end" style="min-width: 45px;">
            <duration-displayer :durationInSec="currentDuration" />
          </ion-label>
          <ion-label slot="start">
            <duration-displayer :durationInSec="totalDuration" />
          </ion-label>
      </ion-range>
    </div>
    <ion-icon
      style="width: 10%;"
      size="large"
      :icon="playerIcon"
      @click="playPauseButtonClicked"
    ></ion-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { playCircleOutline, pauseCircleOutline } from 'ionicons/icons'
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';

export default defineComponent({
  name: 'track-player',
  props: {
    track: TrackDetailsDTO,
  },
  data() {
    return {
      isRangeFocused: false,
      playCircleOutline,
      pauseCircleOutline,
    };
  },
  computed: {
    currentDuration() {
      return this.$store.state.player.currentDuration
    },
    totalDuration() {
      return this.$store.state.player.totalDuration;
    },
    currentSeekPosition() {
      const currentDuration = this.$store.state.player.currentDuration
      const totalDuration = this.$store.state.player.totalDuration;
      return (currentDuration * 100) / totalDuration;
    },
    playerIcon() {
      return this.isThisTrackPlaying ? pauseCircleOutline : playCircleOutline;
    },
    isThisTrackTheCurrentTrack() {
      return this.$store.state.player.currentTrack && this.$store.state.player.currentTrack.id === this.track.id;
    },
    isThisTrackPlaying() {
      return this.isThisTrackTheCurrentTrack && this.$store.state.player.isPlaying;
    },
  },
  methods: {
    playPauseButtonClicked() {
      if(this.isThisTrackTheCurrentTrack) {
        if(this.isThisTrackPlaying) {
          this.$store.dispatch(ACTION_TYPES.PAUSE);
        } else {
          this.$store.dispatch(ACTION_TYPES.RESUME);
        }
      } else {
        this.$store.dispatch(ACTION_TYPES.PLAY, this.track);
      }
    },
    seekPositionChanged(ev: CustomEvent) {
      this.$refs.range.$el.blur();
      if(this.isRangeFocused)
        this.$store.dispatch(ACTION_TYPES.SEEK, ev.detail.value);
    },
  },
})
</script>
