<template>
  <div class="flex flex-column" style="width: 100%; height: 100%; overflow-x: hidden">
    
    <ion-searchbar
      v-if="playlists.length !== 0"
      @input="searchForPlaylists($event.target.value)"
      class="text-center"
      placeholder="جستجو کنید..."
    />

    <h3 class="text-right space-2">پلی لیست های من</h3>

    <ion-card v-for="item in shownPlaylists" :key="item.id">
      
      <ion-card-header>
        <div class="flex justify-content-between align-items-center">
          <div class="flex align-items-center">
            <text-banner :animate="item.title.length > 10" style="width: 6rem">
              <h5>
                {{item.title}}
              </h5>
            </text-banner>
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

    <!-- placeholder for empty list of playlists  -->
    <div class="flex flex-column justify-content-center" id="test" v-if="playlists.length == 0 && !loading">
      <h3  style="opacity: 0.2;">پلی لیست های شما اینجا خواهند بود</h3>
      <b  style="opacity: 0.2;">با + اولین پلی لیست خودت رو درست کن :)</b>
    </div>

    <ion-fab vertical="bottom" horizontal="start" slot="fixed">
      <ion-fab-button @click="$router.push({ name: 'NewPlaylist' })">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <ion-card v-for="i in 4" :key="i" v-show="loading">
      <ion-card-content>
        <ion-skeleton-text
          animated
          style="width: 40%; height: 2rem;"
        />
        <ion-skeleton-text
          animated
          class="space-v"
          style="width: 60%; height: 1rem;"
        />
      </ion-card-content>
    </ion-card>

  </div>
</template>

<style scoped>
#test {
  width: 100%;
  height: 70vh;
  bottom: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='150' height='300' preserveAspectRatio='none' viewBox='0 0 150 300'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1097%26quot%3b)' fill='none'%3e%3cpath d='M70.812%2c260.445C79.027%2c260.942%2c87.101%2c257.177%2c91.433%2c250.179C95.994%2c242.812%2c96.721%2c233.315%2c92.174%2c225.94C87.813%2c218.867%2c79.118%2c216.474%2c70.812%2c216.736C63.018%2c216.982%2c55.349%2c220.346%2c51.666%2c227.22C48.149%2c233.784%2c50.385%2c241.468%2c54.103%2c247.92C57.828%2c254.384%2c63.366%2c259.994%2c70.812%2c260.445' fill='rgba(255%2c 215%2c 0%2c 1)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M33.498%2c294.047C43.111%2c294.18%2c51.33%2c288.091%2c56.407%2c279.927C61.835%2c271.198%2c64.684%2c260.548%2c60.026%2c251.385C54.966%2c241.431%2c44.664%2c234.852%2c33.498%2c234.859C22.343%2c234.866%2c11.945%2c241.405%2c7.026%2c251.417C2.571%2c260.484%2c6.331%2c270.727%2c11.66%2c279.309C16.626%2c287.306%2c24.086%2c293.917%2c33.498%2c294.047' fill='rgba(255%2c 215%2c 0%2c 1)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M27.657%2c96.978C43.198%2c97.353%2c58.088%2c89.287%2c65.601%2c75.677C72.891%2c62.471%2c70.33%2c46.55%2c62.666%2c33.558C55.141%2c20.801%2c42.468%2c11.271%2c27.657%2c11.353C12.971%2c11.434%2c0.467%2c21.115%2c-6.687%2c33.941C-13.645%2c46.416%2c-14.073%2c61.375%2c-7.239%2c73.918C-0.09%2c87.04%2c12.718%2c96.617%2c27.657%2c96.978' fill='rgba(255%2c 215%2c 0%2c 1)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M45.451%2c212.082C51.772%2c211.921%2c57.44%2c207.982%2c60.195%2c202.291C62.655%2c197.209%2c60.59%2c191.557%2c57.749%2c186.678C54.932%2c181.841%2c51.038%2c177.31%2c45.451%2c176.973C39.327%2c176.603%2c33.502%2c179.8%2c30.281%2c185.021C26.89%2c190.518%2c26.19%2c197.441%2c29.348%2c203.075C32.571%2c208.825%2c38.861%2c212.25%2c45.451%2c212.082' fill='rgba(255%2c 215%2c 0%2c 1)' class='triangle-float2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1097'%3e%3crect width='150' height='300' fill='white'%3e%3c/rect%3e%3c/mask%3e%3cstyle%3e %40keyframes float1 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-10px%2c 0)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float1 %7b animation: float1 5s infinite%3b %7d %40keyframes float2 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-5px%2c -5px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float2 %7b animation: float2 4s infinite%3b %7d %40keyframes float3 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(0%2c -10px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float3 %7b animation: float3 6s infinite%3b %7d %3c/style%3e%3c/defs%3e%3c/svg%3e");
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import { addOutline, closeCircleOutline, playCircleOutline, ellipsisVerticalOutline } from 'ionicons/icons';
import { LibraryService } from '@/services/LibraryService';
import { toastController, alertController } from '@ionic/vue';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { PlaylistDetailsDTO } from '@/classes/Library/query/PlaylistDetailsDTO';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { filter } from 'lodash';

export default defineComponent({
  name: 'playlist-tab',
  data() {
    return {
      playlists: [],
      shownPlaylists: [],
      loading: false,
      addOutline,
      playCircleOutline,
      ellipsisVerticalOutline
    };
  },
  methods: {
    async getAllPlaylists() {
      this.loading = true;
      try {
        this.playlists = await LibraryService.getAllOfMyPlaylists();
        this.shownPlaylists = this.playlists;
      } catch(err) {
        const toast = await toastController.create({
          message: err.message,
          color: 'danger',
          icon: closeCircleOutline,
          duration: 4000,
        });
        await toast.present();
      } finally {
        this.loading = false;
      }
    },
    searchForPlaylists(searchTerm: string) {
      if(searchTerm) {
        this.shownPlaylists = filter(this.playlists, (playlist: PlaylistDetailsDTO) => playlist.title === searchTerm);
      } else {
        this.shownPlaylists = this.playlists;
      }
    },
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
                await this.getAllPlaylists();
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
  },
  async mounted() {
    this.getAllPlaylists();
  },
})
</script>
