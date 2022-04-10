<template>
  <ion-app>
    <router-view></router-view>
    <ion-loading v-if="$store.state.isAppWaiting" message="منتظر باشید"></ion-loading>
  </ion-app>
</template>

<script lang="ts">
import { IonApp } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
  },
});
</script>
