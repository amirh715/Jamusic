<template>
  
  <ion-content>

    <ion-toolbar>
      <b>پلی لیست های من</b>
    </ion-toolbar>

    <ion-searchbar
      v-if="playlists.length !== 0"
      @input="searchForPlaylists($event.target.value)"
      class="text-center"
      placeholder="جستجو"
    />

    <ion-card v-for="item in shownPlaylists" :key="item.id">
      
      <ion-card-header>
        <div class="flex justify-content-between align-items-center">
          <div class="flex align-items-center">
            <text-banner :text="item.title" :animate="item.title.length > 1" />
            <p class="space-h">( <number-displayer :value="item.tracks.length" /> آهنگ )</p>
          </div>
          <ion-icon
            size="large"
            :icon="ellipsisVerticalOutline"
            :id="'optionsButton' + item.id"
          ></ion-icon>

          <ion-popover :trigger="'optionsButton' + item.id" dismiss-on-select :arrow="false">
            <ion-content>
              <ion-list>
                <ion-item @click="goToEditPlaylist(item)">
                  <ion-icon :icon="pencilOutline"></ion-icon>
                  <span class="space-h">تغییر</span>
                </ion-item>
                <ion-item @click="deletePlaylist(item)" color="danger">
                  <ion-icon :icon="trashBinOutline"></ion-icon>
                  <span class="space-h">حذف</span>
                </ion-item>
              </ion-list>
            </ion-content>
          </ion-popover>
        </div>
      </ion-card-header>

      <ion-card-content>
        <div class="flex justify-content-between align-items-center">
          <div class="flex align-items-center">
            <span
              v-for="i in 2" :key="i"
              style="margin: 0.2rem"
            >{{item.tracks[i-1] && item.tracks[i-1].title}}</span>
            <span v-if="item.tracks.length > 2">و...</span>
          </div>
          <div @click="playPlaylist(item)">
            <ion-icon size="large" :icon="playCircleOutline"></ion-icon>
          </div>
        </div>
      </ion-card-content>
    </ion-card>

    <ion-fab vertical="bottom" horizontal="start" slot="fixed">
      <ion-fab-button @click="$router.push({ name: 'NewPlaylist' })">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <ion-card v-for="i in 5" :key="i" v-show="loading">
      <ion-content>
        <ion-skeleton-text animated />
        <ion-skeleton-text animated />
      </ion-content>
    </ion-card>

  </ion-content>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { alertController } from '@ionic/vue';
import { LibraryService } from '@/services/LibraryService';
import { ellipsisVerticalOutline, playCircleOutline, pencilOutline, trashBinOutline, addOutline } from 'ionicons/icons';
import { PlaylistDetailsDTO } from '@/classes/Library/query/PlaylistDetailsDTO';
import { filter } from 'lodash';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';

export default defineComponent({
  data() {
    return {
      playlists: [],
      shownPlaylists: [],
      loading: true,
      ellipsisVerticalOutline,
      playCircleOutline,
      pencilOutline,
      trashBinOutline,
      addOutline,
    };
  },
  methods: {
    goToEditPlaylist(playlist: PlaylistDetailsDTO) {
      this.$router.push({ name: 'EditPlaylist', query: { id: playlist.id } });
    },
    async playPlaylist(playlist: PlaylistDetailsDTO) {
      try {
        await this.$store.dispatch(ACTION_TYPES.FILL_PLAY_QUEUE, playlist.tracks);
      } catch(err) {
        console.log(err);
      }
    },
    async deletePlaylist(playlist: PlaylistDetailsDTO) {
      try {
        const alert = await alertController.create({
          message: 'آیا می خواهید این پلی لیست را پاک کنید؟',
          header: 'حذف پلی لیست',
          buttons: [
            {
              text: 'بیخیال',
            },
            {
              text: 'بله',
              handler: async () => {
                this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
                await LibraryService.deletePlaylist(playlist.id);
                await this.fetchAllPlaylists();
                this.$store.commit(COMMIT_TYPES.APP_WAITING, false);
              },
            },
          ],
        });
        alert.present();
      } catch(err) {
        console.log(err);
      }
    },
    async fetchAllPlaylists() {
      try {
        this.playlists = await LibraryService.getAllOfMyPlaylists();
        this.shownPlaylists = this.playlists;
      } catch(err) {
        console.log('');
      }
    },
    searchForPlaylists(searchTerm: string) {
      if(searchTerm) {
        this.shownPlaylists = filter(this.playlists, (playlist: PlaylistDetailsDTO) => playlist.title === searchTerm);
      } else {
        this.shownPlaylists = this.playlists;
      }
    },
  },
  async mounted() {
    try {
      this.loading = true;
      this.playlists = await LibraryService.getAllOfMyPlaylists();
      this.shownPlaylists = this.playlists;
    } catch(err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }
})
</script>
