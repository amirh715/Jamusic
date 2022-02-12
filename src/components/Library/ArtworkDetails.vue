<template>
  <div v-if="artwork && hasAtLeastOneProperty" class="flex flex-column space-2">
    <p v-if="artwork.producer">
      تهیه کننده: {{artwork.producer}}
    </p>
    <p v-if="artwork.recordLabel">
      رکورد لیبل: {{artwork.recordLabel}}
    </p>
    <p v-if="artwork.releaseDate">
      تاریخ انتشار: <release-date-displayer :value="artwork.releaseDate" />
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
import ReleaseDateDisplayer from '../common/ReleaseDateDisplayer.vue';

export default defineComponent({
  components: { ReleaseDateDisplayer },
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
