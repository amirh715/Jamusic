<template>
  <div class="flex flex-column">
    <div v-if="artwork && hasAtLeastOneProperty" class="flex justify-content-around space-2">
      <p v-if="artwork.producer">
        تهیه کننده: <b class="space-h">{{artwork.producer}}</b>
      </p>
      <p v-if="artwork.recordLabel">
        رکورد لیبل: <b class="space-h">{{artwork.recordLabel}}</b>
      </p>
      <!-- <p v-if="artwork.releaseDate">
        تاریخ انتشار: <date-time-displayer :value="artwork.releaseDate" />
      </p> -->
    </div>
    <div class="flex justify-content-between">
      <ion-icon @click="$emit('addToPlaylist', artwork)" :icon="addCircleOutline" size="large"></ion-icon>
      <ion-icon @click="playArtwork" :icon="playCircleOutline" size="large"></ion-icon>
    </div>
  </div>
  <!-- <div v-else class="flex">
    <ion-skeleton-text
      animated
    />
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { addCircleOutline, removeCircleOutline, playCircleOutline } from 'ionicons/icons';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';
import { AlbumDetailsDTO } from '@/classes/Library/query/AlbumDetailsDTO';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';

export default defineComponent({
  name: 'artwork-details',
  emits: ['addToPlaylist'],
  props: {
    artwork: Object,
  },
  data() {
    return {
      addCircleOutline,
      removeCircleOutline,
      playCircleOutline,
    };
  },
  computed: {
    hasAtLeastOneProperty() {
      return this.artwork.producer || this.artwork.recordLabel || this.artwork.releaseDate;
    },
  },
  methods: {
    playArtwork() {
      let tracksToAdd = [];
      if(this.artwork instanceof TrackDetailsDTO) {
        tracksToAdd.push(this.artwork);
      }
      if(this.artwork instanceof AlbumDetailsDTO) {
        tracksToAdd.push(this.artwork.tracks);
      }
      this.$store.dispatch(ACTION_TYPES.FILL_PLAY_QUEUE, tracksToAdd);
    },
  },
})
</script>
