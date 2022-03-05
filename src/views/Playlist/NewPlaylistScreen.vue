<template>

  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="$router.back()" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b>پلی لیست جدید</b>
        <ion-icon :icon="chevronForwardCircleOutline" size="large" style="opacity: 0;" class="space-h"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <div>

      <ion-card style="height: 100%">
        <ion-card-content>

          <div class="flex flex-column">

            <div class="flex align-items-center">
              <label class="space-2-h">عنوان</label>
              <ion-input
                v-model="title"
              />
            </div>

            <ion-searchbar
              class="text-center"
              placeholder="جستجو"
              v-model="searchTerm"
              @input="searchForTracks"
            />

            <playlist-tracks-list
              :tracks="tracks"
              :loading="loading"
              @selectedTracks="(items) => selectedTracks = items"
              @loadMore="loadMore"
            />

            <div class="flex justify-content-center space-3-v">
              <ion-button @click="submit">
                <span class="space-h">برو</span>
              </ion-button>
            </div>

          </div>

        </ion-card-content>
      </ion-card>

    </div>

  </ion-content>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { map, concat, find, remove, intersectionBy, filter } from 'lodash';
import { ToastOptions } from '@ionic/core';
import { toastController } from '@ionic/vue';
import { checkmarkCircleOutline, closeCircleOutline, chevronForwardCircleOutline } from 'ionicons/icons';
import { LibraryService } from '@/services/LibraryService';
import { CreateNewPlaylistDTO } from '@/classes/Library/commands/CreateNewPlaylistDTO';
import { GetLibraryEntitiesByFilters } from '@/classes/Library/commands/GetLibraryEntitiesByFiltersDTO';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';
import PlaylistTracksList from '@/components/Playlist/PlaylistTracksList.vue';

export default defineComponent({
  components: { PlaylistTracksList },
  // components: { LibraryEntityRate },
  data() {
    return {
      title: '',
      selectedTracks: [] as Array<TrackDetailsDTO>, // items already in the playlist
      tracks: [] as Array<TrackDetailsDTO>, // items returned from API as a result of user search term
      searchTerm: '',
      loading: false,
      limit: 20,
      offset: 0,
      chevronForwardCircleOutline,
    };
  },
  methods: {
    async submit() {
      let options: ToastOptions;
      try {
        const dto = new CreateNewPlaylistDTO({
          title: this.title,
          trackIds: map(this.selectedTracks, (item) => item.id),
        });
        await LibraryService.createNewPlaylist(dto);
        await this.$router.push({ name: 'Home' });
        options = {
          message: 'پلی لیست ایجاد شد. :)',
          color: 'success',
          icon: checkmarkCircleOutline,
          duration: 4000,
        }
      } catch(err) {
        options = {
          message: err.message,
          color: 'danger',
          icon: closeCircleOutline,
          duration: 4000,
        }
      } finally {
        const toast = await toastController.create(options);
        await toast.present();
      }
    },
    async searchForTracks() {
      this.loading = true;
      try {
        const dto = new GetLibraryEntitiesByFilters({
          searchTerm: this.searchTerm,
          limit: this.limit,
          type: 'T',
        });
        const results = await LibraryService.getLibraryEntitiesByFilters(dto);
        this.tracks = filter(results, (item) => item instanceof TrackDetailsDTO);
      } finally {
        this.loading = false;
      }
    },
    async loadMore(ev) {
      try {
        const dto = new GetLibraryEntitiesByFilters({
          searchTerm: this.searchTerm,
          type: 'T',
          limit: this.limit,
          offset: this.offset + this.limit,
        });
        const loadedItems = await LibraryService.getLibraryEntitiesByFilters(dto);
        this.tracks = concat(this.tracks, loadedItems);
      } finally {
        ev.target.complete();
      }
    },
  },
})
</script>
