<template>
  
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between">
        <ion-icon :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b>{{playlist && playlist.title}}</b>
        <ion-icon :icon="playCircleOutline" size="large" class="space-h"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div v-if="playlist && playlist.tracks">
      <ion-list v-for="track in playlist.tracks" :key="track.id">
        <div class="flex justify-content-between align-items-center">
          <div class="flex align-items-center" style="width: 90%;">
            <ion-thumbnail class="space">
              <img v-if="!track.imageLoading" :src="track.image || 'assets/images/disc.png'" />
              <ion-skeleton-text v-else animated />
            </ion-thumbnail>
            <div class="flex flex-column space-h">
              <b>{{track.title}}</b>
              <small>{{track.artist.title}}</small>
            </div>
          </div>
          <div style="width: 10%;">
            <ion-icon :icon="ellipsisVerticalOutline" size="large"></ion-icon>
          </div>
        </div>
      </ion-list>
    </div>
  </ion-content>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  chevronForwardCircleOutline,
  playCircleOutline,
  closeCircleOutline,
  ellipsisVerticalOutline,
} from 'ionicons/icons';
import { LibraryService } from '@/services/LibraryService';
import { toastController } from '@ionic/vue';

export default defineComponent({
  data() {
    return {
      playlist: null,
      loading: false,
      chevronForwardCircleOutline,
      playCircleOutline,
      ellipsisVerticalOutline,
    }
  },
  async mounted() {
    this.loading = true;
    try {
      const playlistId = this.$route.query.id;
      this.playlist = await LibraryService.getPlaylistById(playlistId);
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
