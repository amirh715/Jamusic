<template>

  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="goBack" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b>تغییر پلی لیست {{title}}</b>
        <ion-icon :icon="chevronForwardCircleOutline" size="large" class="space-h" style="opacity: 0;"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <ion-card>
      <ion-card-content>
        <div class="flex align-items-center space">
          <label class="space-h">عنوان</label>
          <ion-input
            type="text"
            placeholder="عنوان پلی لیست"
            v-model="title"
          />
        </div>
        <div>
          <ion-searchbar
            @ionInput="searchTermChanged"
            placeholder="جستجو"
            class="text-center"
          />
        </div>
        <div>
          <ion-list v-show="loading">
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

          <ion-list v-show="!loading">
            <ion-list-header v-show="tracks.length > 0">
              <number-displayer :value="selectedTracks.length" />
            </ion-list-header>
            <ion-item v-for="track in listedItems" :key="track.value.id">
              <div class="flex justify-content-between align-items-center" style="width: 100%">
                <div class="flex justify-content-between align-items-center">
                  <ion-thumbnail class="space-v">
                    <img
                      v-show="!track.imageLoading"
                      :src="track.image ? URL.createObjectURL(track.image) : 'assets/images/disc.png'"
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
        <div class="flex justify-content-center space-v">
          <ion-button @click="submit">
            <span class="space-h">برو</span>
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>

  </ion-content>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import PlaylistTracksList from '@/components/Playlist/PlaylistTracksList.vue';
import { EditPlaylistDTO } from '@/classes/Library/commands/EditPlaylistDTO';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';
import { LibraryService } from '@/services/LibraryService';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { CheckboxChangeEventDetail, toastController } from '@ionic/vue';
import { filter, find, map, unionBy } from 'lodash';
import { closeCircleOutline, chevronForwardCircleOutline } from 'ionicons/icons';
import { GetLibraryEntitiesByFilters } from '@/classes/Library/commands/GetLibraryEntitiesByFiltersDTO';

export default defineComponent({
  data() {
    return {
      searchTerm: '',
      playlistId: this.$route.query.id,
      title: '',
      selectedTracks: [],
      tracks: [],
      loading: false,
      limit: 20,
      offset: 0,
      chevronForwardCircleOutline,
    };
  },
  computed: {
    // union of tracks available for selection and tracks already in the playlist
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
  },
  methods: {
    async submit() {
      this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
      try {
        const dto = new EditPlaylistDTO({
          id: this.playlistId,
          title: this.title,
          trackIds: map(this.selectedTracks, (item: TrackDetailsDTO) => item.id),
        });
        await LibraryService.editPlaylist(dto);
        await this.$router.push({ name: 'Home' });
      } catch(err) {
        const toast = await toastController.create({
          message: err.message,
          icon: closeCircleOutline,
          color: 'danger',
          duration: 4000,
        });
        await toast.present();
      } finally {
        this.$store.commit(COMMIT_TYPES.APP_WAITING, false);
      }
    },
    selectedTracksChanged(track: TrackDetailsDTO, checked: boolean) {
      const isItemAlreadySelected = find(this.selectedTracks, (item: TrackDetailsDTO) => item.id === track.id);
      if(isItemAlreadySelected) {
        if(!checked) {
          this.selectedTracks = filter(this.selectedTracks, (item: TrackDetailsDTO) => item.id !== track.id);
        }
      } else {
        if(checked) {
          this.selectedTracks.push(track);
        }
      }
    },
    async searchTermChanged(ev) {
      this.searchTerm = ev.target.value;
      this.tracks = await this.searchForTracks(this.searchTerm);
    },
    async searchForTracks(searchTerm: string) {
      const dto = new GetLibraryEntitiesByFilters({
        searchTerm: searchTerm,
        limit: this.limit,
        offset: this.offset,
        type: 'T',
      });
      const results = await LibraryService.getLibraryEntitiesByFilters(dto);
      return filter(results, (entity) => entity.type === 'T');
    },
    async loadMore(ev) {
      this.offset += this.limit;
      this.tracks.push(await this.searchForTracks(this.searchTerm));
      ev.target.complete();
    },
    goBack() {
      if(this.selectedTracks.length > 0)
        this.$router.back();
      else
        this.$router.push({ name: 'Home' });
    },
  },
  async mounted() {
    this.loading = true;
    try {
      const playlist = await LibraryService.getPlaylistById(this.playlistId);
      this.title = playlist.title;
      this.selectedTracks = playlist.tracks;
    } catch(err) {
      await this.$router.push({ name: 'Home' });
      const toast = await toastController.create({
        message: err.message,
        icon: closeCircleOutline,
        color: 'danger',
        duration: 4000,
      });
      await toast.present();
    } finally {
      this.loading = false;
    }
  },
})
</script>
