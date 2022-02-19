<template>
  <div>
    <slot name="title"></slot>
    <div
      @click="$emit('tapped', collection)"
      style="overflow-x: auto; overflow-y: hidden; white-space: nowrap;"
      class="swiper-no-swiping"
      :class="scrollDirection === 'vertical' ? 'flex flex-column' : 'flex flex-row'">
        <div
          v-for="collection in 20" :key="collection"
          :style="{width: size || '5rem', height: size || '5rem', margin: '0 0.2rem'}"
        >
          <ion-thumbnail
            :style="{
              width: size || '5rem', height: size || '5rem',
              borderRadius: collectionBorderRadius || '4px'
            }">
            <div v-show="!collection.imageLoading">
              <img
                :src="collection.image || 'assets/images/Fadaei.jpg'"
              />
              <slot name="content"></slot>
            </div>
            <ion-skeleton-text
              v-show="collection.imageLoading"
              animated
            />
          </ion-thumbnail>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RecommendedCollection } from '@/classes/Library/query/RecommendedCollection';
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'collection',
  emits: ['tapped'],
  props: {
    scrollDirection: Object as PropType<'horizontal' | 'vertical'>,
    size: String,
    collectionBorderRadius: String,
    collections: Object as PropType<RecommendedCollection>,
  },
})
</script>
