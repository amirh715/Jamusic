<template>
  <div v-if="artwork && hasAtLeastOneProperty" class="flex">
    <p v-if="artwork.producer">
      تهیه کننده: {{artwork.producer}}
    </p>
    <p v-if="artwork.recordLabel">
      رکورد لیبل: {{artwork.recordLabel}}
    </p>
    <p v-if="artwork.releaseDate">
      تاریخ انتشار: {{artwork.releaseDate}}
    </p>
  </div>
  <div v-else class="flex">
    <ion-skeleton-text
      animated
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ArtworkDetailsDTO } from '@/classes/Library/query/ArtworkDetailsDTO'

export default defineComponent({
  name: 'artwork-details',
  props: {
    artwork: Object,
  },
  computed: {
    hasAtLeastOneProperty() {
      return this.artwork.producer || this.artwork.recordLabel || this.artwork.releaseDate;
    },
  },
})
</script>
