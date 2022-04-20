<template>
  <div>
    <slot name="title"></slot>
    <div
      @click="$emit('tapped', items)"
      style="overflow-x: auto; overflow-y: hidden; white-space: nowrap;"
      class="swiper-no-swiping"
      :class="scrollDirection === 'vertical' ? 'flex flex-column' : 'flex flex-row'">
        <div
          @click="$router.push({ name: 'LibraryEntityDetails', query: { id: item.id } })"
          v-for="item in items.items" :key="item"
          :style="{width: size || '5rem', height: size + 2 || '6.5rem', margin: '0 0.2rem'}"
        >
          <ion-thumbnail
            :style="{
              width: size || '5rem', height: size || '5rem',
              borderRadius: collectionBorderRadius || '4px'
            }">
            <div v-if="!item.imageLoading" :style="{
              width: size || '5rem', maxHeight: size || '5rem'
              }">
                <img
                  :src="item.image ? toObjectURL(item.image) : 'assets/images/disc.png'"
                />
            </div>
            <ion-skeleton-text
              v-else
              animated
            />
          </ion-thumbnail>
          <text-banner :animate="item.title.length > 10" animationSpeed="5s">
            <span style="font-size: 0.9rem; font-weight: bold;">{{item.title}}</span>
          </text-banner>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { RecommendedCollection } from '@/classes/Library/query/RecommendedCollection';

export default defineComponent({
  name: 'collection',
  emits: ['tapped'],
  props: {
    scrollDirection: Object as PropType<'horizontal' | 'vertical'>,
    size: String,
    collectionBorderRadius: String,
    items: Object as PropType<RecommendedCollection[]>,
  },
  methods: {
    toObjectURL(blob: Blob) {
      return URL.createObjectURL(blob);
    },
  },
})
</script>
