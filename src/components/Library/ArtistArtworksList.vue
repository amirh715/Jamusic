<template>
  <ion-slides>
    <ion-slide>
      <ion-list style="width: 100%">
        <ion-list-header class="space-v">آلبوم ها</ion-list-header>
        <ion-item
          v-for="item in albumsList"
          :key="item.id"
          @click="goToLibraryEntity(item.id)"
        >
          <div>
            <ion-thumbnail v-if="false">
              <img :src="item.image" />
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
    </ion-slide>
    <ion-slide>
      <ion-list style="width: 100%;">
        <ion-list-header class="space-v">تک آهنگ ها</ion-list-header>
        <ion-item
          v-for="item in singleTracksList"
          :key="item.id"
          @click="goToLibraryEntity(item.id)"
        >
          <div>
            <ion-thumbnail v-if="false">
              <img :src="item.image" />
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
    </ion-slide>
  </ion-slides>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as _ from 'lodash';
import { LibraryService } from '@/services/LibraryService';
import { GetLibraryEntitiesByFilters } from '@/classes/Library/commands/GetLibraryEntitiesByFiltersDTO';
import LibraryEntityRate from '@/components/Library/LibraryEntityRate.vue';

export default defineComponent({
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
      try {
        console.log('err');
      } catch(err) {
        console.log(err);
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
  mounted() {
    this.fetchArtworks();
  },
})
</script>
