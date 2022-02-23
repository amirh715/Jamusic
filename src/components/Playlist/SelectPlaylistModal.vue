<template>
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon :icon="chevronDownCircleOutline" @click="closeModal" size="large" class="space-h"></ion-icon>
        <b>{{title}}</b>
        <ion-icon :icon="chevronDownCircleOutline" size="large" class="space-h" style="opacity: 0;"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <p class="space"></p>
    <ion-radio-group v-if="playlists.length > 0 && !loadingPlaylists" @ionChange="selectionChanged">
      <ion-item>
        <small class="flex align-items-center">با 
          <ion-icon class="space-h" :icon="addCircleOutline"></ion-icon>
           می توانید این اثر را به یک پلی لیست جدید اضافه کنید.</small>
      </ion-item>
      <ion-item v-for="item in playlists" :key="item.id">
        <ion-label>
          <b>{{item.title}}</b>
        </ion-label>
        <ion-radio :value="item.id"></ion-radio>
      </ion-item>
    </ion-radio-group>
    <div v-else-if="loadingPlaylists" v-for="i in 5" :key="i" class="flex justify-content-start">
      <ion-list style="width: 100%">
        <ion-item>
          <ion-skeleton-text style="width: 35%; height: 1.5rem;" class="space" animated />
        </ion-item>
      </ion-list>
    </div>
    <div v-else style="height: 90%; opacity: 0.2;" class="flex flex-column justify-content-center align-items-center">
      <h3>شما هیچ پلی لیستی ندارید</h3>
      <b class="text-center">
        اول باید یک پلی لیست درست کنید<br/>
        برای این کار می توانید از دکمه + استفاده کنید
      </b>
    </div>
    <ion-fab vertical="bottom" horizontal="end">
      <ion-fab-button @click="openCreateNewPlaylistAlert">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PlaylistDetailsDTO } from '@/classes/Library/query/PlaylistDetailsDTO'
import { AlertButton, alertController, AlertInput, modalController, toastController, ToastOptions } from '@ionic/vue'
import { LibraryService } from '@/services/LibraryService';
import {
  addOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  addCircleOutline,
  chevronDownCircleOutline,
} from 'ionicons/icons';
import { CreateNewPlaylistDTO } from '@/classes/Library/commands/CreateNewPlaylistDTO';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';
import { EditPlaylistDTO } from '@/classes/Library/commands/EditPlaylistDTO';

export default defineComponent({
  name: 'select-playlist-modal',
  props: {
    title: String,
    trackToAdd: TrackDetailsDTO,
  },
  data() {
    return {
      playlists: [],
      loadingPlaylists: false,
      addOutline,
      addCircleOutline,
      chevronDownCircleOutline,
    };
  },
  methods: {
    async selectionChanged(playlist: PlaylistDetailsDTO) {
      this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
      try {
        const trackIds = playlist.tracks.map(track => track.id);
        const dto = new EditPlaylistDTO({
          id: playlist.id,
          title: playlist.title,
          trackIds,
        });
        await LibraryService.editPlaylist(dto);
        await this.$router.push({ name: 'Home' });
      } catch(err) {
        console.log(err);
      } finally {
        this.$store.commit(COMMIT_TYPES.APP_WAITING, false);
        modalController.dismiss(playlist);
      }
    },
    async openCreateNewPlaylistAlert() {
      try {
        const playlistTitleInput: AlertInput = {
          type: 'text',
          name: 'title',
          value: '',
          label: 'عنوان پلی لیست',
        }
        const alertButtons: AlertButton[] = [
          {
            text: 'بیخیال',
          },
          {
            text: 'برو',
            handler: async (v) => this.createNewPlaylist(v),
          },
        ]
        const alert = await alertController.create({
          header: 'پلی لیست جدید',
          message: 'عنوان پلی لیست جدید را وارد کنید.',
          inputs: [playlistTitleInput],
          buttons: alertButtons,
        });
        await alert.present();
      } catch(err) {
        const toast = await toastController.create({
          message: err.message,
          icon: closeCircleOutline,
          color: 'danger',
          duration: 4000,
        });
        await toast.present();
      }
    },
    async createNewPlaylist(value) {
      this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
      try {
        const dto = new CreateNewPlaylistDTO({
          title: value.title,
          trackIds: [this.trackToAdd.id],
        });
        await LibraryService.createNewPlaylist(dto);
        this.$router.push({ name: 'Home' });
      } catch(err) {
        console.log(err);
      } finally {
        this.$store.commit(COMMIT_TYPES.APP_WAITING, false);
      }
    },
    async closeModal() {
      modalController.dismiss();
    },
    // async addToPlaylist(playlist: PlaylistDetailsDTO) {
    //   try {

    //   } catch(err) {

    //   } finally {

    //   }
    // },
  },
  async mounted() {
    this.loadingPlaylists = true;
    try {
      this.playlists = await LibraryService.getAllOfMyPlaylists();
    } catch(err) {
      console.log(err);
    } finally {
      this.loadingPlaylists = false;
    }
  },
})
</script>
