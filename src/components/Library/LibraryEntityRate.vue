<template>
  <div class="flex">
    <ion-icon
      v-for="i in 5"
      :key="i"
      :icon="icons[i]"
      :style="{margin: 'auto 0.1rem', fontSize: size}"
    ></ion-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as _ from 'lodash';
import {
  star,
  starHalf,
  starOutline
} from 'ionicons/icons'

export default defineComponent({
  name: 'library-entity-rate',
  data() {
    return {
      star,
      starHalf,
      starOutline,
    }
  },
  props: {
    rate: Number,
    size: String,
  },
  computed: {
    icons() {
      let iconNames = [];
      for(let i = 1; i < 6; i++) {
        if(this.rate < i + 0.3)
          iconNames[i] = this.starOutline;
        else if(this.rate < i + 0.6)
          iconNames[i] = this.starHalf;
        else
          iconNames[i] = this.star;
      }
      return iconNames;
    },
  }
})
</script>
