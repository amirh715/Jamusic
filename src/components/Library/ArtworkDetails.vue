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
    <div class="flex justify-content-start">
      <ion-icon @click="$emit('addToPlaylist', artwork)" :icon="addCircleOutline" size="large"></ion-icon>
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
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'artwork-details',
  emits: ['addToQueue', 'addToPlaylist'],
  props: {
    artwork: Object,
  },
  data() {
    return {
      addCircleOutline,
      removeCircleOutline,
    };
  },
  computed: {
    hasAtLeastOneProperty() {
      return this.artwork.producer || this.artwork.recordLabel || this.artwork.releaseDate;
    },
  },
})
</script>
