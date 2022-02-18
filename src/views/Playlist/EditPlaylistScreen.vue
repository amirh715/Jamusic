<template>
  
  <ion-content>

    <ion-toolbar>
      <b>تغییر پلی لیست {{title}}</b>
    </ion-toolbar>

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
            v-model="searchTerm"
            placeholder="جستجو"
            class="text-center"
            @input="searchForTracks"
          />
        </div>
        <div>
          <playlist-tracks-list
            :tracks="selectedTracks"
            :selectedTracks="selectedTracks"
          />
        </div>
        <div class="flex justify-content-center space-v">
          <ion-button>
            <span class="space-h">برو</span>
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>

  </ion-content>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PlaylistTracksList from '@/components/Playlist/PlaylistTracksList.vue';
import { EditPlaylistDTO } from '@/classes/Library/commands/EditPlaylistDTO';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';
import { LibraryService } from '@/services/LibraryService';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { toastController } from '@ionic/vue';
import { map } from 'lodash';
import { closeCircleOutline } from 'ionicons/icons';
import { GetLibraryEntitiesByFilters } from '@/classes/Library/commands/GetLibraryEntitiesByFiltersDTO';

export default defineComponent({
  components: { PlaylistTracksList },
  data() {
    return {
      playlistId: this.$route.query.id,
      title: '',
      selectedTracks: [],
      tracks: [],
      loading: false,
    };
  },
  methods: {
    async submit() {
      this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
      try {
        const dto = new EditPlaylistDTO({
          id: this.playlistId,
          title: this.title,
          trackIds: map(this.tracks, (item: TrackDetailsDTO) => item.id),
        });
        await LibraryService.editPlaylist(dto);
        await this.$router.push({ name: 'MyPlaylists' });
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
    async searchForTracks() {
      try {
        const dto = new GetLibraryEntitiesByFilters({
          searchTerm: this.searchTerm,
          type: 'T',
        });
        this.tracks = await LibraryService.getLibraryEntitiesByFilters(dto);
      } catch(err) {
        console.log(err);
      }
    },
  },
  async mounted() {
    this.loading = true;
    try {
      const playlist = await LibraryService.getPlaylistById(this.playlistId);
      this.title = playlist.title;
      this.selectedTracks = playlist.tracks;
      this.tracks = playlist.tracks;
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
  }
})
</script>
