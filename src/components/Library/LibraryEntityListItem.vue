<template>
  <ion-item @click="tapped" :color="color">
    <div>
      <ion-skeleton-text
        v-if="imageLoading"
        animated
        style="width: 5rem; height: 4rem;"
      ></ion-skeleton-text>
      <ion-thumbnail v-else slot="start">
        <img :src="imageDataURL || 'assets/images/disc.png'">
      </ion-thumbnail>
    </div>
    <div class="space-h">
      <div v-if="contentLoading">
        <ion-skeleton-text
          v-if="contentLoading"
          animated
          style="width: 12rem; height: 1rem"
        ></ion-skeleton-text>
        <ion-skeleton-text
          v-if="contentLoading"
          animated
          style="width: 6rem"
        ></ion-skeleton-text>
      </div>
      <div v-else class="space-v">
        <b>{{title}}</b>
        <library-entity-rate
          :rate="rate"
          size="1rem"
        />
      </div>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LibraryEntityRate from './LibraryEntityRate.vue'

export default defineComponent({
  components: { LibraryEntityRate },
  name: 'library-entity-list-item',
  emits: ['tapped'],
  props: {
    imageLoading: Boolean,
    contentLoading: Boolean,
    image: Blob,
    id: String,
    title: String,
    rate: Number,
  },
  computed: {
    color() {
      return this.$store.state.player.currentTrack &&
        this.$store.state.player.currentTrack.id === this.id &&
        'primary';
    },
    imageDataURL() {
      return this.image ? URL.createObjectURL(this.image) : '';
    },
  },
  methods: {
    tapped() {
      if(this.title) this.$emit('tapped');
    },
  },
})
</script>
