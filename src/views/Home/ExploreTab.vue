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
        <collection size="9rem" :items="[]" style="margin: 1rem;">
        </collection>
      </div>

      <!-- collections -->
      <div class="flex flex-column">
        
        <collection
          v-for="item in collections"
          :key="item"
          size="6rem"
          :items="item"
        >
          <template v-slot:title>
            <h5 class="text-right">{{item.title}}</h5>
          </template>
        </collection>

        <!-- <collection size="6rem" :items="[]" style="margin: 1rem">
          <template v-slot:title>
            <h5 class="text-right">پیشنهاد جَم برای شما</h5>
          </template>
        </collection>
        <collection size="6rem" :items="[]" style="margin: 1rem">
          <template v-slot:title>
            <h5 class="text-right">دیگران گوش می دهند</h5>
          </template>
        </collection>
        <collection size="6rem" :items="[]" style="margin: 1rem">
          <template v-slot:title>
            <h5 class="text-right">قفلی زدی</h5>
          </template>
        </collection>
        <collection size="6rem" :items="[]" style="margin: 1rem">
          <template v-slot:title>
            <h5 class="text-right">قفلی زدی</h5>
          </template>
        </collection> -->

      </div>

    </div>
  <!-- </ion-content> -->
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Collection from '@/components/common/Collection.vue'
import { RecommendedCollection } from '@/classes/Library/query/RecommendedCollection';

export default defineComponent({
  name: 'explore-tab',
  components: { Collection },
  props: {
    collections: Object as PropType<RecommendedCollection[]>,
    showcases: Object as PropType<RecommendedCollection>,
    loading: Boolean,
  },
})
</script>
