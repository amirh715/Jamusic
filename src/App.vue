<template>
  <ion-app>
    <ion-router-outlet />
    <ion-loading v-if="$store.state.isAppWaiting" message="منتظر باشید"></ion-loading>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  }
});
</script>