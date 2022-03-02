<template>
  <div>
    <slot name="title"></slot>
    <div
      style="overflow-x: auto; overflow-y: hidden; white-space: nowrap;"
      class="swiper-no-swiping"
      :class="scrollDirection === 'vertical' ? 'flex flex-column' : 'flex flex-row'">
        <div
          v-for="item in items" :key="item.id"
          @click="$emit('tapped', item)"
          :style="{width: size || '5rem', height: size || '6.5rem', margin: '0 0.2rem'}"
        >
          <ion-thumbnail
            :style="{
              width: size || '5rem', height: size || '5rem', maxHeight: size || '5rem',
              borderRadius: collectionBorderRadius || '4px'
            }">
            <div v-if="!item.imageLoading" :style="{
              width: size || '5rem', maxHeight: size || '5rem',
              }">
                <img
                  :src="item.image ? toObjectURL(item.image) : 'assets/images/disc.png'"
                />
                <h3 style="position: relative; bottom: 8px; left: 16px;">Show me!!</h3>
            </div>
            <ion-skeleton-text
              v-else
              animated
            />
          </ion-thumbnail>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ShowcaseDetails } from '@/classes/Showcase/ShowcaseDetails';

export default defineComponent({
  name: 'showcase-collection',
  emits: ['tapped'],
  props: {
    scrollDirection: Object as PropType<'horizontal' | 'vertical'>,
    size: String,
    collectionBorderRadius: String,
    items: Object as PropType<ShowcaseDetails[]>,
  },
  methods: {
    toObjectURL(blob: Blob) {
      return URL.createObjectURL(blob);
    },
  },
})
</script>
