<template>
  <div style="max-height: 15rem; overflow-y: scroll">
    {{lyrics}}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'track-lyrics',
  props: {
    lyrics: String,
  },
})
</script>
