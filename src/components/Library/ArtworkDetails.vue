<template>
  <div class="flex flex-column">
    <div v-if="artwork && hasAtLeastOneProperty" class="flex justify-content-around space-2">
      <p v-if="artwork.producer">
        تهیه کننده: <b class="space-h">{{artwork.producer}}</b>
      </p>
      <p v-if="artwork.recordLabel">
        رکورد لیبل: <b class="space-h">{{artwork.recordLabel}}</b>
      </p>
      <p v-if="artwork.releaseDate">
        تاریخ انتشار: <date-time-displayer :value="artwork.releaseDate" />
      </p>
    </div>
    <div class="flex justify-content-between space-v">
      <div>
        <ion-icon @click="$emit('addToPlaylist', artwork)" :icon="addCircleOutline" size="large"></ion-icon>
        <ion-icon @click="$emit('openOptions', artwork)" :icon="ellipsisHorizontalCircle" size="large"></ion-icon>
      </div>
      <ion-icon @click="playArtwork" :icon="playButtonIcon" size="large"></ion-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { findIndex } from 'lodash';
import {
  addCircleOutline,
  removeCircleOutline,
  playCircleOutline,
  pauseCircleOutline,
  ellipsisHorizontalCircle
} from 'ionicons/icons';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';
import { AlbumDetailsDTO } from '@/classes/Library/query/AlbumDetailsDTO';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';

export default defineComponent({
  name: 'artwork-details',
  emits: ['addToPlaylist', 'openOptions'],
  props: {
    artwork: Object,
  },
  data() {
    return {
      addCircleOutline,
      removeCircleOutline,
      playCircleOutline,
      ellipsisHorizontalCircle,
    };
  },
  computed: {
    hasAtLeastOneProperty() {
      return this.artwork.producer || this.artwork.recordLabel || this.artwork.releaseDate;
    },
    playButtonIcon() {
      let iconName: string;
      if(this.$store.state.isPlaying) {
        const trackBeingPlayed: TrackDetailsDTO = this.$store.state.currentTrack;
        if(this.artwork instanceof AlbumDetailsDTO) {
          const isTrackBeingPlayedFromThisAlbum = findIndex(this.artwork.tracks, (track: TrackDetailsDTO) => track.id === trackBeingPlayed.id);
          if(isTrackBeingPlayedFromThisAlbum === -1) {
            iconName = playCircleOutline;
          } else {
            iconName = pauseCircleOutline;
          }
        }
        if(this.artwork instanceof TrackDetailsDTO && this.artwork.id === trackBeingPlayed.id) {
          iconName = pauseCircleOutline;
        } else {
          iconName = playCircleOutline;
        }
      } else {
        iconName = playCircleOutline;
      }
      return iconName;
    },
  },
  methods: {
    playArtwork() {
      this.$store.dispatch(ACTION_TYPES.PLAY, this.artwork);
    },
  },
})
</script>
