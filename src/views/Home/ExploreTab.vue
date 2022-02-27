<template>
  <!-- <ion-content> -->
    <div class="flex flex-column" style="width: 100%; overflow-x: hidden">

      <!-- search bar -->
      <div>
        <ion-searchbar
          placeholder="جستجو کنید..."
          @ionFocus="$router.push({ name: 'Search' })"
        />
      </div>

      <!-- showcases -->
      <div class="flex flex-column">
        <collection @tapped="showcaseItemTapped(collection)" size="10rem" :items="showcases" style="margin: 1rem;">
          <template v-slot:title>
            <h2 class="text-right">&#128165; ویترین</h2>
          </template>
          <template v-slot:content>
            <h2>Title</h2>
          </template>
        </collection>
      </div>

      <!-- collections -->
      <div class="flex flex-column space-2">
        
        <collection
          v-for="collection in collections"
          :key="collection"
          size="6rem"
          :items="collection"
        >
          <template v-slot:title>
            <h5 class="text-right">{{collection.title}}</h5>
          </template>
        </collection>

      </div>

    </div>
  <!-- </ion-content> -->
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Collection from '@/components/common/Collection.vue'
import { RecommendedCollection } from '@/classes/Library/query/RecommendedCollection';
import { ShowcaseService } from '@/services/ShowcaseService';
import { LibraryService } from '@/services/LibraryService';
import { ShowcaseDetails } from '@/classes/Showcase/ShowcaseDetails';

export default defineComponent({
  name: 'explore-tab',
  components: { Collection },
  props: {
    loading: Boolean,
  },
  data() {
    return {
      showcases: [],
      collections: []
    }
  },
  methods: {
    showcaseItemTapped(showcase: ShowcaseDetails) {
      ShowcaseService.itemClicked(showcase.id);
    },
  },
  async mounted() {
    this.showcases = await ShowcaseService.getShowcases();
    this.collections = await LibraryService.getAllCollections();
    for(let i=0; i<this.showcases.length; i++) {
      const showcase = this.showcases[i] as ShowcaseDetails;
      this.showcases[i].image = ShowcaseService.getShowcaseImageById(showcase.id);
      this.showcases[i].imageLoading = false;
    }
    for(let i=0; i<this.collections.length; i++) {
      const collection = this.collections[i] as RecommendedCollection;
      for(let j=0; j<collection.items.length; j++) {
        const item = collection.items[j];
        // this.collections[i].items[j].image = LibraryService.getLibraryEntityImageById(item.id);
        // this.collections[i].items[j].imageLoading = false;
      }
    }
  },
})
</script>
