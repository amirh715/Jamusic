<template>

  <swiper
    :grabCursor="true"
    dir="rtl"
  >
    <swiper-slide>
      <ion-list style="width: 100%">
        <ion-list-header class="space-v">آلبوم ها</ion-list-header>
        <ion-item
          v-for="item in albumsList"
          :key="item.id"
          :color="currentTrack && currentTrack.album && currentTrack.album.id === item.id ? 'primary' : ''"
          @click="goToLibraryEntity(item.id)"
        >
          <div class="space-v">
            <ion-thumbnail v-if="!item.imageLoading">
              <img :src="item.image ? toObjectURL(item.image) : 'assets/images/disc.png'" />
            </ion-thumbnail>
            <ion-skeleton-text
              v-else
              style="width: 2.5rem; height: 2.5rem"
              animated
            />
          </div>
          <span class="space-h">{{item.title}}</span>
          <library-entity-rate :rate="item.rate" />
        </ion-item>
      </ion-list>
    </swiper-slide>
    <swiper-slide>
      <ion-list style="width: 100%;">
        <ion-list-header class="space-v">تک آهنگ ها</ion-list-header>
        <ion-item
          v-for="item in singleTracksList"
          :key="item.id"
          :color="currentTrack && currentTrack.id === item.id ? 'primary' : ''"
          @click="goToLibraryEntity(item.id)"
        >
          <div class="space-v">
            <ion-thumbnail v-if="!item.imageLoading">
              <img :src="item.image ? toObjectURL(item.image) : 'assets/images/disc.png'" />
            </ion-thumbnail>
            <ion-skeleton-text
              v-else
              style="width: 2.5rem; height: 2.5rem"
              animated
            />
          </div>
          <span class="space-h">{{item.title}}</span>
          <library-entity-rate :rate="item.rate" />
        </ion-item>
      </ion-list>
    </swiper-slide>
  </swiper>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as _ from 'lodash';
import { LibraryService } from '@/services/LibraryService';
import { GetLibraryEntitiesByFilters } from '@/classes/Library/commands/GetLibraryEntitiesByFiltersDTO';
import LibraryEntityRate from '@/components/Library/LibraryEntityRate.vue';
import { Swiper } from 'swiper/types';
import { ArtworkDetailsDTO } from '@/classes/Library/query/ArtworkDetailsDTO';

export default defineComponent({
  setup() {
    const swiper = ref(null);
    const onSwiper = (swiperInstance: Swiper) => { swiper.value = swiperInstance; };
    return {
      onSwiper,
      swiper,
    };
  },
  name: 'artist-artworks-list',
  components: {
    LibraryEntityRate,
  },
  props: {
    artistId: String,
  },
  data() {
    return {
      artworks: [],
      offset: 0,
    };
  },
  computed: {
    currentTrack() {
      return this.$store.state.player.currentTrack;
    },
    albumsList() {
      return _.filter(this.artworks, artwork => artwork.type === 'A');
    },
    singleTracksList() {
      return _.filter(this.artworks, artwork => artwork.type === 'T' && !artwork.album);
    },
  },
  methods: {
    async fetchArtworks() {
      const artistsArtworks = new GetLibraryEntitiesByFilters({
        artistId: this.artistId,
        offset: this.offset,
      });
      this.artworks = await LibraryService.getLibraryEntitiesByFilters(artistsArtworks);
    },
    async fetchArtworksImages() {
      for(let i = 0; i < this.artworks.length; i++) {
        (this.artworks[i] as ArtworkDetailsDTO).imageLoading = true;
        try {
          const blob = await LibraryService.getLibraryEntityImageById(this.artworks[i].id);
          (this.artworks[i] as ArtworkDetailsDTO).image = blob;
        } finally {
          (this.artworks[i] as ArtworkDetailsDTO).imageLoading = false;
        }
      }
    },
    async goToLibraryEntity(id: string) {
      await this.$router.push({ name: 'LibraryEntityDetails', query: { id } });
    },
    toObjectURL(blob: Blob) {
      return URL.createObjectURL(blob);
    }
  },
  async mounted() {
    await this.fetchArtworks();
    await this.fetchArtworksImages();
  },
})
</script>
