<template>

  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="$router.back()" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b class="text-center">جستجو</b>
        <ion-icon style="opacity: 0;" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <ion-searchbar
      class="text-center"
      v-model="searchTerm"
      ref="searchInput"
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
      />
    </ion-list>

    <ion-infinite-scroll
      v-show="showItemsList"
      class="space-2-v"
      @ionInfinite="fetchMore($event)">
      <ion-infinite-scroll-content
        loading-text="منتظر باشید..."
        loading-spinner="bubbles">
      </ion-infinite-scroll-content>
    </ion-infinite-scroll>

    <div v-show="showLoader">
      <div v-for="i in 7" :key="i" class="flex space-2">
        <ion-skeleton-text animated style="width: 3rem; height: 3rem;" />
        <div class="flex flex-column justify-content-center space-h">
          <ion-skeleton-text animated style="width: 5rem; height: 1.4rem;" />
          <ion-skeleton-text animated style="width: 9rem; height: 1rem;" />
        </div>
      </div>
    </div>

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

    <div v-show="showPlaceholder">
      <div style="opacity: 0.2" class="flex justify-content-center align-items-center">
          <h1>هرچی سرچ کنی اینجاست...</h1><br/>
      </div>
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
import { chevronForwardCircleOutline } from 'ionicons/icons';

export default defineComponent({
  components: { LibraryEntityListItem },
  data() {
    return {
      searchTerm: '',
      limit: 20,
      offset: 0,
      fetchedItems: [],
      waitingForInput: false,
      timerId: 0,
      searchHistoryItems: [],
      showLoader: false,
      chevronForwardCircleOutline,
    }
  },
  computed: {
    showItemsList() {
      return this.searchTerm.length > 0 && this.fetchedItems.length > 0;
    },
    showNoResultPlaceholder() {
      return !this.showLoader && this.searchTerm.length > 0 && this.fetchedItems.length === 0 && !this.waitingForInput;
    },
    showSearchHistory() {
      return this.searchTerm.length === 0 && this.searchHistoryItems.length > 0;
    },
    showPlaceholder() {
      return this.searchTerm.length === 0 && this.fetchedItems.length === 0 && this.searchHistoryItems.length === 0;
    },
  },
  methods: {
    async fetch() {
      try {
        this.showLoader = true;
        const dto = new GetLibraryEntitiesByFilters({
          searchTerm: this.searchTerm,
          limit: this.limit,
          offset: this.offset,
        });
        const fetched = await LibraryService.getLibraryEntitiesByFilters(dto);
        this.fetchedItems.push(...fetched);
      } finally {
        this.showLoader = false;
      }
    },
    async fetchMore(ev: CustomEvent) {
      this.offset += this.limit;
      await this.fetch();
      ev.target['complete']();
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
        this.fetchedItems = [];
        this.fetch();
        clearTimeout(this.timerId);
        this.waitingForInput = false;
      }, 1000);
    },
    async fetchSearchHistory() {
      this.searchHistoryItems =
        await DatabaseManager
          .searchHistory
          .limit(10)
          .reverse()
          .sortBy('searchedAt');
    },
    async searchHistoryItemTapped(entityId: string) {
      await this.$router.push({ name: 'LibraryEntityDetails', query: { id: entityId } });
    },
  },
  mounted() {
    this.fetchSearchHistory();
    this.$refs.searchInput.$el.focus();
  },
})
</script>
