<template>

  <swiper>
    <swiper-slide>
      <ion-list style="width: 100%">
        <ion-list-header class="space-v">آلبوم ها</ion-list-header>
        <ion-item
          v-for="item in albumsList"
          :key="item.id"
          @click="goToLibraryEntity(item.id)"
        >
          <div>
            <ion-thumbnail v-if="item.image">
              <img :src="URL.createObjectURL(item.image)" />
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
          @click="goToLibraryEntity(item.id)"
        >
          <div>
            <ion-thumbnail v-if="item.image">
              <img :src="URL.createObjectURL(item.image)" />
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
    albumsList() {
      return _.filter(this.artworks, artwork => artwork.type === 'A');
    },
    singleTracksList() {
      return _.filter(this.artworks, artwork => artwork.type === 'T' && !artwork.album);
    },
  },
  methods: {
    async fetchArtworks() {
      try {
        const artistsArtworks = new GetLibraryEntitiesByFilters({
          artistId: this.artistId,
          offset: this.offset,
        });
        this.artworks = await LibraryService.getLibraryEntitiesByFilters(artistsArtworks);
      } catch(err) {
        console.log(err);
      }
    },
    async fetchArtworksImages() {
      for(const artwork of (this.artworks as ArtworkDetailsDTO[])) {
        try {
          const blob = await LibraryService.getLibraryEntityImageById(artwork.id);
          artwork.image = blob;
        } catch(err) {
          // if(err.request.status === 404) {
            
          // }
        }
      }
    },
    async goToLibraryEntity(id: string) {
      try {
        await this.$router.push({ name: 'LibraryEntityDetails', query: { id } });
      } catch(err) {
        console.log(err);
      }
    },
  },
  async mounted() {
    await this.fetchArtworks();
    await this.fetchArtworksImages();
  },
})
</script>
