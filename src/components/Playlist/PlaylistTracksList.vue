<template>
  <div>
    <ion-list v-if="loading">
      <ion-item v-for="i in 7" :key="i">
        <ion-skeleton-text
          class="space"
          style="width: 3rem; height: 3rem;"
          animated
        />
        <div>
          <ion-skeleton-text
            style="width: 8rem; height: 1.5rem"
            animated
          />
          <ion-skeleton-text
            style="width: 3rem; height: 1rem"
            animated
          />
        </div>
      </ion-item>
    </ion-list>

    <ion-list v-else>
      <ion-list-header v-show="tracks.length > 0">
        <number-displayer :value="selectedTracks.length" />
      </ion-list-header>
      <ion-item v-for="track in listedItems" :key="track.value.id">
        <div class="flex justify-content-between align-items-center" style="width: 100%">
          <div class="flex justify-content-between align-items-center">
            <ion-thumbnail class="space-v">
              <img
                v-show="!track.imageLoading"
                :src="track.image ? URL.createObjectURL(track.image) : 'assets/images/DiscPlaceholder.png'"
              />
              <ion-skeleton-text
                v-show="track.imageLoading"
                animated
              />
            </ion-thumbnail>
            <div>
              <div class="flex">
                <b class="space-h">{{track.value.title}}</b>
                <small>{{(track.value.album && `(از آلبوم ${track.value.album.title})`) || ''}}</small>
              </div>
              <small class="space-h">{{track.value.artist.title}}</small>
              </div>
            </div>
          <ion-checkbox
            color="primary"
            @update:modelValue="selectedTracksChanged(track.value, $event)"
            :modelValue="track.checked"
          ></ion-checkbox>
        </div>
      </ion-item>
    </ion-list>

    <ion-infinite-scroll
      v-show="tracks.length !== 0"
      class="space-2-v"
      @ionInfinite="loadMore" 
      threshold="100px"
    >
      <ion-infinite-scroll-content
        loading-spinner="bubbles"
        loading-text="منتظر باشید...">
      </ion-infinite-scroll-content>
    </ion-infinite-scroll>
  </div>

</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { map, find, remove, intersectionBy, filter, unionBy } from 'lodash';
import { CheckboxChangeEventDetail } from '@ionic/core';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';

export default defineComponent({
  name: 'playlist-tracks-list',
  emits: ['selectedTracks', 'loadMore'],
  props: {
    tracks: Object as PropType<TrackDetailsDTO[]>,
    preSelectedTracks: Object as PropType<TrackDetailsDTO[]>,
    loading: Boolean,
  },
  data() {
    return {
      selectedTracks: this.preSelectedTracks || [],
    }
  },
  computed: {
    // items to show on the list
    listedItems(): Array<CheckboxChangeEventDetail<TrackDetailsDTO>> {
      // tracks returned from API as a result of user search term (which are not selected)
      const tracksMarkedAsUnchecked: Array<CheckboxChangeEventDetail<TrackDetailsDTO>>
        = map(
          this.tracks,
          (track: TrackDetailsDTO) => {
            return {
              value: track,
              checked: false,
            } as CheckboxChangeEventDetail;
          });
      // tracks selected by user
      const selectedTracksMarkedAsChecked: Array<CheckboxChangeEventDetail<TrackDetailsDTO>>
        = map(
          this.selectedTracks,
          (selectedItem: TrackDetailsDTO) => {
            return {
              value: selectedItem,
              checked: true,
            } as CheckboxChangeEventDetail;
          });
      // list of selected items at the top and tracks at the bottom
      const itemsToShow = unionBy(
        [...selectedTracksMarkedAsChecked, ...tracksMarkedAsUnchecked],
        (item) => item.value.id
      );
      return itemsToShow;
    },
    selectedTracksCount() {
      return filter(this.selectedTracks, (item) => item instanceof TrackDetailsDTO).length;
    },
  },
  // watch: {
  //   selectedTracks(selectedTracks: TrackDetailsDTO[]) {
      
  //   },
  // },
  methods: {
    selectedTracksChanged(track: TrackDetailsDTO, checked: boolean) {
      const isItemAlreadySelected = find(this.selectedTracks, (item: TrackDetailsDTO) => item.id === track.id);
      if(isItemAlreadySelected) {
        if(!checked) {
          this.selectedTracks = remove(this.selectedTracks, (item: TrackDetailsDTO) => item.id === track.id);
          this.$emit('selectedTracks', this.selectedTracks);
        }
      } else {
        if(checked) {
          this.selectedTracks.push(track);
          this.$emit('selectedTracks', this.selectedTracks);
        }
      }
    },
    loadMore(ev) {
      this.$emit('loadMore', ev);
    },
  },
})
</script>
