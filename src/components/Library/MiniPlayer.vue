<template>
  <div v-if="!$store.state.player.isStopped" class="flex flex-column" style="height: 3.5rem; backdrop-filter: blur(20px);">
    <div class="flex" style="height: 95%;">
      <div @click="buttonTapped" class="flex justify-content-center align-items-center" style="width: 20%">
        <ion-icon
          :icon="icon"
          style="font-size: 2.7rem"
        ></ion-icon>
      </div>
      <div @click="titleTapped" class="flex flex-column" style="width: 80%;">
        <text-banner :animate="currentTrack.title.length > 15">
          <b>{{currentTrack.title}}</b>
        </text-banner>
        <small>{{currentTrack.artist.title}}</small>
      </div>
    </div>
    <div id="mini-player-seek-line" :style="{width: `${seekPosition}%`, height: '5%'}"></div>
  </div>
</template>

<style scoped>
#mini-player-seek-line {
  border: 2px solid var(--ion-color-primary);
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  playCircleOutline,
  pauseCircleOutline,
} from 'ionicons/icons';
import { modalController } from '@ionic/vue';
import MainPlayerModal from './MainPlayerModal.vue';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';

export default defineComponent({
  name: 'mini-player',
  computed: {
    currentTrack() {
      return this.$store.state.player.currentTrack;
    },
    seekPosition() {
      const currentDuration = this.$store.state.player.currentDuration;
      const totalDuration = this.$store.state.player.totalDuration;
      return (currentDuration * 100) / totalDuration;
    },
    icon() {
      return this.$store.state.player.isPlaying ? pauseCircleOutline : playCircleOutline;
    },
  },
  methods: {
    async titleTapped() {
      const modal = await modalController.create({
        component: MainPlayerModal,
        swipeToClose: true,
      });
      await modal.present();
    },
    buttonTapped() {
      this.$store.dispatch(
        this.$store.state.player.isPlaying ? ACTION_TYPES.PAUSE : ACTION_TYPES.RESUME
      );
    },
  }
})
</script>
