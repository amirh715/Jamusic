<template>
  <ion-list>
    <ion-item
      v-for="item in tracks"
      :key="item.id"
      @click="playTrack(item)"
      :color="currentTrack && currentTrack.id === item.id"
    >
      <ion-thumbnail style="width: 1.7rem; height: 1.7rem;">
        <ion-skeleton-text v-if="item.imageLoading" />
        <img v-else :src="item.image ? toObjectURL(item.image) : 'assets/images/disc.png'" />
      </ion-thumbnail>
      <b class="space-h">{{item.title}}</b>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO'
import { ACTION_TYPES } from '@/store/ACTION_TYPES'
import { drop, findIndex } from 'lodash';

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
      const allTracksInPlaylist = this.tracks as TrackDetailsDTO[];
      const selectedTracksIndex = findIndex(allTracksInPlaylist, (t) => t.id === trackToPlay.id);
      const tracksToPlay = drop(allTracksInPlaylist, selectedTracksIndex);
      this.$store.dispatch(ACTION_TYPES.PLAY, tracksToPlay);
    },
  },
})
</script>
