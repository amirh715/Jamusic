<template>
  <router-view :key="$route.query.id" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
})
</script>
