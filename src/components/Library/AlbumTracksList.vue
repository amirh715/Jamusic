<template>
  <ion-list>
    <ion-item
      v-for="item in tracks"
      :key="item.id"
      @click="playTrack(item)"
      :color="currentTrack && currentTrack.id === item.id"
    >
      <b>{{item.title}}</b>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO'
import { ACTION_TYPES } from '@/store/ACTION_TYPES'

export default defineComponent({
  name: 'album-tracks-list',
  props: {
    tracks: Object as PropType<TrackDetailsDTO[]>,
  },
  computed: {
    currentTrack() {
      return this.$store.state.player.currentTrack;
    },
  },
  methods: {
    playTrack(trackToPlay: TrackDetailsDTO) {
      this.$store.dispatch(ACTION_TYPES.ADD_TO_PLAY_QUEUE, trackToPlay);
      this.$store.dispatch(ACTION_TYPES.PLAY);
    },
  },
})
</script>
