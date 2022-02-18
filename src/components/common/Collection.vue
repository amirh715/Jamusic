<template>
  <div class="swiper-no-swiping" style="overflow-x: auto; overflow-y: hidden; white-space: nowrap;">
    <slot name="title"></slot>
    <div :class="scrollDirection === 'vertical' ? 'flex flex-column' : 'flex flex-row'">
      <div
        v-for="collections in 20" :key="collections"
        :style="{width: size || '5rem', height: size || '5rem', margin: '0 0.2rem'}"
      >
        <ion-thumbnail
          :style="{
            width: size || '5rem', height: size || '5rem',
            borderRadius: collectionBorderRadius || '4px'
          }">
          <div v-show="!collections.imageLoading">
            <img
              :src="collections.image || 'assets/icon/icon.png'"
            />
            <slot name="content"></slot>
          </div>
          <ion-skeleton-text
            v-show="collections.imageLoading"
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
  emits: ['itemClicked'],
  props: {
    scrollDirection: Object as PropType<'horizontal' | 'vertical'>,
    size: String,
    collectionBorderRadius: String,
    collections: Object as PropType<RecommendedCollection>,
  },
  methods: {
    onItemClicked(item: RecommendedCollection) {
      this.$emit('itemClicked', item);
    },
  },
})
</script>
