<template>
  
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon style="opacity: 0" size="large" class="space-h" :icon="personCircleOutline"></ion-icon>
        <div class="flex align-items-center">
          <img src="assets/icons/ios/1024.png" style="width: 1.7rem; height: 1.7rem;" />
        </div>
        <ion-icon
          size="large"
          :icon="personCircleOutline"
          @click="goToProfile"
          class="space-h"
        ></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <swiper
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :grabCursor="true"
      dir="rtl"
    >
      <swiper-slide>
        <explore-tab />
      </swiper-slide>
      <swiper-slide>
        <playlist-tab />
      </swiper-slide>
    </swiper>

    <div
      :style="{position: 'absolute', bottom: '0', width: '100%', height: isPlayerStopped ? '3.5rem' : '7rem'}"
      id="tab-buttons"
      slot="fixed"
    >

      <div style="border-bottom: 1px solid black; opacity: 0.1;"></div>
      <mini-player
        style="width: 100%; height: 50%;"
        v-if="!$store.state.player.isStopped"
        :isPlaying="$store.state.player.isPlaying"
        title="Night at the Beach"
        @titleTapped="$router.push({ name: 'LibraryEntityDetails', query: { id: currentTrack.id } })"
        @buttonTapped="$store.dispatch(ACTION_TYPES.PLAY)"
      />

      <div style="border-bottom: 1px solid black; opacity: 0.1;"></div>

      <div
        class="flex"
        :style="{width: '100%', height: isPlayerStopped ? '100%' : '50%'}"
      >
        <div @click="tabButtonClicked(0)" style="width: 50%">
          <div style="height: 100%" class="flex justify-content-center align-items-center">
            <ion-icon size="large" :color="tabIndex === 0 ? 'primary' : ''" :icon="tabIndex === 1 ? planetOutline : planet"></ion-icon>
          </div>
        </div>

        <div style="border-right: 1px solid black; opacity: 0.1;"></div>
        
        <div style="width: 50%;" @click="tabButtonClicked(1)">
          <div style="height: 100%" class="flex justify-content-center align-items-center">
            <ion-icon size="large" :color="tabIndex === 1 ? 'primary' : ''" :icon="tabIndex === 0 ? albumsOutline : albums"></ion-icon>
          </div>
        </div>
      </div>

    </div>

  </ion-content>

  <ion-fab
    :style="{ marginBottom: !$store.state.player.isStopped ? '7rem' : '3.5rem' }"
    vertical="bottom" horizontal="start" slot="fixed">
      <ion-fab-button v-show="showNewPlaylistButton" @click="$router.push({ name: 'NewPlaylist' })">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
  </ion-fab>

</template>

<style>
#tab-buttons {
  backdrop-filter: blur(20px);
}
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MiniPlayer from '@/components/Library/MiniPlayer.vue'
import ExploreTab from './ExploreTab.vue';
import PlaylistTab from './PlaylistTab.vue';
import { Swiper as SwiperJs } from 'swiper/types';
import {
  planetOutline,
  planet,
  albumsOutline,
  albums,
  personCircleOutline,
  addOutline,
} from 'ionicons/icons'
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';

export default defineComponent({
  setup() {
    const swiper = ref(null);
    const onSwiper = (swiperInstance: SwiperJs) => {
      swiper.value = swiperInstance;
    };
    return {
      onSwiper,
      swiper,
      planetOutline,
      planet,
      albumsOutline,
      albums,
      personCircleOutline,
    }
  },
  components: { ExploreTab, PlaylistTab, MiniPlayer, },
  data() {
    return {
      collections: [],
      addOutline,
    }
  },
  computed: {
    currentTrack() {
      return this.$store.state.player.currentTrack;
    },
    isPlayerStopped() {
      return this.$store.state.player.isStopped;
    },
    tabIndex() {
      return this.$store.state.homeScreenTabIndex;
    },
    showNewPlaylistButton() {
      return this.tabIndex === 1;
    },
  },
  methods: {
    tabButtonClicked(index: number) {
      (this.swiper as SwiperJs).slideTo(index);
    },
    onSlideChange(swiper: SwiperJs) {
      this.$store.commit(COMMIT_TYPES.HOME_SCREEN_TAB_INDEX, swiper.activeIndex);
    },
    goToProfile() {
      this.$router.push({ name: 'ProfileInfo' });
    },
  },
})
</script>
