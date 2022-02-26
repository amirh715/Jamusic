<template>

  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="goBack" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b class="text-center">جستجو</b>
        <ion-icon style="opacity: 0;" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <ion-searchbar
      class="text-center"
      v-model="searchTerm"
      placeholder="جستجو کنید..."
      @input="searchTermChanged"
    ></ion-searchbar>

    <ion-list v-show="showItemsList">
      <library-entity-list-item
        v-for="item in fetchedItems"
        :key="item.id"
        @tapped="itemTapped({ entityId: item.id, entityTitle: item.title })"
        :id="item.id"
        :title="item.title"
        :rate="item.rate"
        :imageLoading="false"
      >
      </library-entity-list-item>
    </ion-list>

    <ion-infinite-scroll
      v-show="showItemsList"
      class="space-2-v"
      @ionInfinite="fetchMore($event)">
      <ion-infinite-scroll-content
        loading-spinner="bubbles">
      </ion-infinite-scroll-content>
    </ion-infinite-scroll>

    <h2 v-show="showNoResultPlaceholder" class="text-center">
      چیزی پیدا نشد :(
    </h2>
    <div v-show="showSearchHistory" class="text-center">
      <ion-list style="opacity: 0.5">
        <ion-item
          v-for="item in searchHistoryItems"
          :key="item.id"
          @click="searchHistoryItemTapped(item.entityId)"
        >
          <span>{{item.entityTitle}}</span>
        </ion-item>
      </ion-list>
    </div>

    <div v-if="showPlaceholder">
      <background-placeholder
        title="هرچی سرچ کردی اینجا هست :)"
      />
    </div>

  </ion-content>

  <mini-player />

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { GetLibraryEntitiesByFilters } from '@/classes/Library/commands/GetLibraryEntitiesByFiltersDTO'
import { LibraryService } from '@/services/LibraryService'
import { DatabaseManager } from '@/services/DatabaseManager'
import { ISearchHistory } from '@/services/DatabaseManager/ISearchHistory'
import LibraryEntityListItem from '@/components/Library/LibraryEntityListItem.vue'
import BackgroundPlaceholder from '@/components/common/BackgroundPlaceholder.vue'
import { chevronForwardCircleOutline } from 'ionicons/icons';

export default defineComponent({
  components: { LibraryEntityListItem, BackgroundPlaceholder },
  data() {
    return {
      searchTerm: '',
      limit: 20,
      offset: 0,
      fetchedItems: [],
      waitingForInput: false,
      timerId: 0,
      searchHistoryItems: [],
      chevronForwardCircleOutline,
    }
  },
  computed: {
    showItemsList() {
      return this.searchTerm.length > 0 && this.fetchedItems.length > 0;
    },
    showNoResultPlaceholder() {
      return this.searchTerm.length > 0 && this.fetchedItems.length === 0 && !this.waitingForInput;
    },
    showSearchHistory() {
      return this.searchTerm.length === 0 && this.searchHistoryItems !== 0;
    },
    showPlaceholder() {
      return this.searchTerm.length === 0 && this.searchHistoryItems === 0;
    },
  },
  methods: {
    async fetch() {
      const dto = new GetLibraryEntitiesByFilters({
        searchTerm: this.searchTerm,
        limit: this.limit,
        offset: this.offset,
      });
      this.fetchedItems = await LibraryService.getLibraryEntitiesByFilters(dto);
    },
    async itemTapped(entity: { entityId: string, entityTitle: string }) {
      await this.$router.push({ name: 'LibraryEntityDetails', query: { id: entity.entityId } });
      const addToSearchHistory: ISearchHistory = {
        entityId: entity.entityId,
        entityTitle: entity.entityTitle,
        searchTerm: this.searchTerm,
        searchedAt: new Date(),
      };
      await DatabaseManager.searchHistory.add(addToSearchHistory);
    },
    searchTermChanged() {
      this.waitingForInput = true;
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.fetch();
        clearTimeout(this.timerId);
        this.waitingForInput = false;
      }, 1000);
    },
    async fetchSearchHistory() {
      try {
        this.searchHistoryItems =
          await DatabaseManager
            .searchHistory
            .limit(10)
            .reverse()
            .sortBy('searchedAt');
      } catch(err) {
        console.log(err);
      }
    },
    async searchHistoryItemTapped(entityId: string) {
      try {
        await this.$router.push({ name: 'LibraryEntityDetails', query: { id: entityId } });
      } catch(err) {
        console.log(err);
      }
    },
    goBack() {
      this.$router.push({ name: 'Home' });
    },
  },
  mounted() {
    this.fetchSearchHistory();
  },
})
</script>
