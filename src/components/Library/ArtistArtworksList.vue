<template>
  <swiper
    :grabCursor="true"
    :pagination="true"
    dir="rtl"
    style="padding: 40px 0; height: 100%;"
  >
    <swiper-slide>
      <ion-list v-if="albumsList.length > 0" style="width: 100%; height: 90%; overflow-y: scroll;">
        <ion-list-header class="space-v">
          {{albumsList.length > 0 ? 'آلبوم ها' : 'آلبومی ندارد...'}}
        </ion-list-header>
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
      <div v-else class="flex flex-column text-center">
        <h2 class="space-v">هنوز آلبومی ندارد.</h2>
        <p style="opacity: 0.5;">به سمت راست بکشید تا تک آهنگ ها را ببینید.</p>
      </div>
    </swiper-slide>
    <swiper-slide>
      <ion-list v-if="singleTracksList.length > 0" style="width: 100%; height: 90%; overflow-y: scroll;">
        <ion-list-header class="space-v">
          {{singleTracksList.length > 0 ? 'تک آهنگ ها' : 'تک آهنگی ندارد'}}
        </ion-list-header>
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
      <div v-else class="flex flex-column text-center">
        <h2 class="space-v">هنوز تک آهنگی ندارد.</h2>
        <p style="opacity: 0.5;">به سمت چپ بکشید تا آلبوم ها را ببینید.</p>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { filter } from 'lodash';
import { LibraryService } from '@/services/LibraryService';
import { GetLibraryEntitiesByFilters } from '@/classes/Library/commands/GetLibraryEntitiesByFiltersDTO';
import LibraryEntityRate from '@/components/Library/LibraryEntityRate.vue';
import { Swiper } from 'swiper/types';
import { ArtworkDetailsDTO } from '@/classes/Library/query/ArtworkDetailsDTO';

export default defineComponent({
  setup() {
    const swiper = ref(null);
    const onSwiper = (swiperInstance: Swiper) => {
      swiper.value = swiperInstance;
    };
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
      return filter(this.artworks, artwork => artwork.type === 'A');
    },
    singleTracksList() {
      return filter(this.artworks, artwork => artwork.type === 'T' && !artwork.album);
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
    console.log(this.onSwiper);
    this.onSwiper.slideNext();
  },
})
</script>
