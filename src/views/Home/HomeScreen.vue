<template>
  
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon style="opacity: 0" size="large" class="space-h" :icon="personCircleOutline"></ion-icon>
        <div class="flex align-items-center">
          <img src="assets/icon/favicon.png" style="width: 1.6rem; height: 1.6rem;" />
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
        <explore-tab
          :collections="collections"
        />
      </swiper-slide>
      <swiper-slide>
        <playlist-tab />
      </swiper-slide>
    </swiper>

    <div
      style="position: absolute; bottom: 0; width: 100%; height: 7rem;"
      id="tab-buttons"
      slot="fixed"
    >

      <div style="border-bottom: 1px solid black; opacity: 0.1;"></div>
      <mini-player
        style="width: 100%; height: 50%;"
        v-if="!$store.state.player.isPlaying"
        :isPlaying="$store.state.player.isPlaying"
        title="Night at the Beach"
        @titleTapped="$router.push({ name: 'LibraryEntityDetails', query: { id: currentTrack.id } })"
        @buttonTapped="$store.dispatch(ACTION_TYPES.PLAY)"
      />

      <div style="border-bottom: 1px solid black; opacity: 0.1;"></div>

      <div
        class="flex"
        style="width: 100%; height: 50%;"
      >
        <div @click="tabButtonClicked(0)" style="width: 50%">
          <div style="height: 100%" class="flex justify-content-center align-items-center">
            <ion-icon size="large" :icon="tabIndex === 1 ? planetOutline : planet"></ion-icon>
          </div>
        </div>

        <div style="border-right: 1px solid black; opacity: 0.1;"></div>
        
        <div style="width: 50%;" @click="tabButtonClicked(1)">
          <div style="height: 100%" class="flex justify-content-center align-items-center">
            <ion-icon size="large" :icon="tabIndex === 0 ? albumsOutline : albums"></ion-icon>
          </div>
        </div>
      </div>

    </div>

  </ion-content>

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
import { planetOutline, planet, albumsOutline, albums, personCircleOutline } from 'ionicons/icons'
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { LibraryService } from '@/services/LibraryService';

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
      tabIndex: 0,
      collections: [],
    }
  },
  computed: {
    currentTrack() {
      return this.$store.state.player.currentTrack;
    },
  },
  methods: {
    tabButtonClicked(index: number) {
      (this.swiper as SwiperJs).slideTo(index);
    },
    onSlideChange(swiper: SwiperJs) {
      this.tabIndex = swiper.activeIndex;
    },
    goToProfile() {
      this.$router.push({ name: 'ProfileInfo' });
    },
    async fetchCollections() {
      try {
        this.collections = await LibraryService.getAllCollections();
      } catch(err) {
        console.log(err);
      }
    },
  },
  async mounted() {
    await this.fetchCollections();
  },
})
</script>
