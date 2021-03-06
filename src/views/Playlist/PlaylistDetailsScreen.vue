<template>
  
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="$router.back()" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b>{{playlist && playlist.title}}</b>
        <ion-icon @click="playPlaylist" :icon="playCircleOutline" size="large" class="space-h"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list v-if="playlist && playlist.tracks">
      <ion-item v-for="track in playlist.tracks" :key="track.id"
        :color="currentTrack && currentTrack.id === track.id ? 'primary' : ''">
          <div class="flex justify-content-between align-items-center" style="width: 100%;">
            <div @click="playTrack(track)" class="flex align-items-center" style="width: 90%;">
              <ion-thumbnail class="space-v">
                <img v-if="!track.imageLoading" :src="track.image ? toObjectURL(track.image) : 'assets/images/disc.png'" />
                <ion-skeleton-text v-else animated />
              </ion-thumbnail>
              <div class="flex flex-column space-h">
                <b>{{track.title}}</b>
                <small>{{track.artist.title}}</small>
              </div>
            </div>
            <div @click="openActionSheet(track)" style="width: 10%;">
              <ion-icon :icon="ellipsisVerticalOutline" size="large"></ion-icon>
            </div>
          </div>
      </ion-item>
    </ion-list>
  </ion-content>

  <mini-player />

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  chevronForwardCircleOutline,
  playCircleOutline,
  closeCircleOutline,
  ellipsisVerticalOutline,
  createOutline,
  trashOutline,
  personOutline,
  discOutline,
} from 'ionicons/icons';
import { LibraryService } from '@/services/LibraryService';
import { actionSheetController, toastController } from '@ionic/vue';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { EditPlaylistDTO } from '@/classes/Library/commands/EditPlaylistDTO';
import { drop, fill, filter, findIndex } from 'lodash';
import { PlaylistDetailsDTO } from '@/classes/Library/query/PlaylistDetailsDTO';

export default defineComponent({
  data() {
    return {
      playlist: null,
      loading: false,
      chevronForwardCircleOutline,
      playCircleOutline,
      ellipsisVerticalOutline,
      createOutline,
      trashOutline,
    }
  },
  computed: {
    currentTrack() {
      return this.$store.state.player.currentTrack;
    },
  },
  methods: {
    async playPlaylist() {
      this.$store.dispatch(ACTION_TYPES.PLAY, this.playlist.tracks);
    },
    async playTrack(track: TrackDetailsDTO) {
      const allTracksInPlaylist = this.playlist.tracks as TrackDetailsDTO[];
      const selectedTracksIndex = findIndex(allTracksInPlaylist, (t) => t.id === track.id);
      const tracksToPlay = drop(allTracksInPlaylist, selectedTracksIndex);
      await this.$store.dispatch(ACTION_TYPES.PLAY, tracksToPlay);
    },
    async openActionSheet(track: TrackDetailsDTO) {
      const actionSheet = await actionSheetController.create({
        header: track.title,
        buttons: [
          {
            text: 'برو به آهنگ',
            icon: discOutline,
            handler: () => this.$router.push({ name: 'LibraryEntityDetails', query: { id: track.id } }),
          },
          {
            text: 'برو به هنرمند',
            icon: personOutline,
            handler: () => this.$router.push({ name: 'LibraryEntityDetails', query: { id: track.artist.id } }),
          },
          {
            text: 'حذف آهنگ از پلی لیست',
            icon: trashOutline,
            handler: () => this.removeTrackFromPlaylist(track),
            role: 'destructive',
          },
          {
            text: 'بیخیال',
            role: 'cancel',
          },
        ]
      });
      await actionSheet.present();
    },
    async removeTrackFromPlaylist(trackToRemove: TrackDetailsDTO) {
      try {
        this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
        const dto = new EditPlaylistDTO({
          id: this.playlist.id,
          title: this.playlist.title,
          trackIds: filter(this.playlist.tracks, track => track.id !== trackToRemove.id),
        });
        await LibraryService.editPlaylist(dto);
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
    toObjectURL(blob: Blob) {
      return URL.createObjectURL(blob);
    },
  },
  async mounted() {
    this.loading = true;
    try {
      const playlistId = this.$route.query.id;
      this.playlist = await LibraryService.getPlaylistById(playlistId, { initImageLoadingValue: true });
      const playlistTracksCount = this.playlist.tracks.length;
      if(playlistTracksCount === 0) {
        this.$router.push({ name: 'EditPlaylist', query: { id: playlistId } });
      }
      for(let i=0; i<playlistTracksCount; i++) {
        try {
          const track = (this.playlist as PlaylistDetailsDTO).tracks[i];
          this.playlist.tracks[i].image = await LibraryService.getLibraryEntityImageById(track.id);
        } catch(err) {
          continue;
        } finally {
          this.playlist.tracks[i].imageLoading = false;
        }
      }
    } catch(err) {
      this.$router.push({ name: 'Home' });
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
