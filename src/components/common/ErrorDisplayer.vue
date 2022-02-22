<template>
  <div v-for="error in errors" :key="error" class="flex justify-content-start align-items-center error space">
    <ion-icon color="danger" :icon="alertCircleOutline" style="font-size: 1.5rem;"></ion-icon>
    <ion-text class="space-h" color="danger">{{error.$message}}</ion-text>
  </div>
</template>

<style scoped>
.error {
  /* border: 1px solid tomato;
  border-radius: 4px; */
  font-size: 0.8rem;
  font-weight: bold;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import { alertCircleOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'error-displayer',
  props: {
    errors: Object,
  },
  data() {
    return {
      alertCircleOutline,
    }
  },
})
</script>
