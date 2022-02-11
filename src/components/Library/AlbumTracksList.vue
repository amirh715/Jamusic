<template>
  <ion-list>
    <ion-item
      v-for="item in tracks"
      :key="item.id"
    >
      {{item.title}}
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO'

export default defineComponent({
  name: 'album-tracks-list',
  props: {
    tracks: [],
  },
})
</script>
