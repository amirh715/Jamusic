<template>
  <div :style="divStyle">
    <div :style="pStyle">
      <slot></slot>
    </div>
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
  },
  computed: {
    divStyle() {
      return {
        width: '100%',
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
        'line-height': '50px',
        /* Starting position */
        transform: `${this.animate ? 'translateX(100%)' : ''}`,
        animation: `${this.animate ? `scroll-left ${this.animationSpeed || '9s'} linear infinite` : ''}`,
      }
    }
  },
})
</script>
