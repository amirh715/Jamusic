<template>
  <!-- <ion-content> -->
    <div class="flex flex-column" style="width: 100%; overflow-x: hidden; margin-bottom: 150px;">

      <!-- search bar -->
      <div>
        <ion-searchbar
          placeholder="جستجو کنید..."
          @ionFocus="$router.push({ name: 'Search' })"
        />
      </div>

      <!-- showcases -->
      <div class="flex flex-column">
        
        <showcase-collection
          :items="showcases"
          @tapped="showcaseItemTapped"
          size="12rem">
            <template v-slot:title>
              <h2 v-show="showShowcaseTitle" class="text-right space-2">&#128142; ویترین &#128165;</h2>
            </template>
        </showcase-collection>

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
import ShowcaseCollection from '@/components/Showcase/ShowcaseCollection.vue';

export default defineComponent({
  name: 'explore-tab',
  components: { ShowcaseCollection, Collection, },
  props: {
    loading: Boolean,
  },
  data() {
    return {
      showcases: [],
      collections: []
    }
  },
  computed: {
    showShowcaseTitle() {
      return this.showcases.length > 0;
    },
  },
  methods: {
    showcaseItemTapped(showcase: ShowcaseDetails) {
      ShowcaseService.itemClicked(showcase.id);
      window.open(showcase.route, '_self');
    },
  },
  async mounted() {
    this.showcases = await ShowcaseService.getShowcases({ initImageLoadingValue: true });
    this.collections = await LibraryService.getAllCollections({ initImageLoadingValue: true });
    for(let i=0; i<this.showcases.length; i++) {
      try {
        const showcase = this.showcases[i] as ShowcaseDetails;
        this.showcases[i].imageLoading = true;
        this.showcases[i].image = await ShowcaseService.getShowcaseImageById(showcase.id);
      } catch(err) {
        continue;
      } finally {
        this.showcases[i].imageLoading = false;
      }
    }
    for(let i=0; i<this.collections.length; i++) {
      const collection = this.collections[i] as RecommendedCollection;
      for(let j=0; j<collection.items.length; j++) {
        try {
          const item = collection.items[j];
          this.collections[i].items[j].imageLoading = true;
          this.collections[i].items[j].image = await LibraryService.getLibraryEntityImageById(item.id);
        } catch(err) {
          continue;
        } finally {
          this.collections[i].items[j].imageLoading = false;
        }
      }
    }
  },
})
</script>
