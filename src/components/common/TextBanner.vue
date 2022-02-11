<template>
  <div :style="divStyle">
    <p :style="pStyle">{{text}}</p>
  </div>
</template>

<style scoped>
/* Move it (define the animation) */
@keyframes scroll-left {
  0% {
  transform: translateX(100%); 		
  }
  100% {
  transform: translateX(-100%); 
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'text-banner',
  props: {
    text: String,
    animate: Boolean,
    animationSpeed: String,
    height: String,
    background: String,
    textStyle: Object,
  },
  computed: {
    divStyle() {
      return {
        height: '50px',
        overflow: 'hidden',
        position: 'relative',
      }
    },
    pStyle() {
      return {
        position: 'absolute',
        width: '100%',
        height: '100%',
        margin: 0,
        ...this.textStyle,
        'line-height': '50px',
        /* Starting position */
        transform: `${this.animate ? 'translateX(100%)' : ''}`,
        animation: `${this.animate ? `scroll-left ${this.animationSpeed || '9s'} linear infinite` : ''}`,
      }
    }
  },
})
</script>
