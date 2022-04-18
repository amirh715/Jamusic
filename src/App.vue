<template>
  <ion-app>
    <router-view></router-view>
    <ion-loading v-if="$store.state.isAppWaiting" message="منتظر باشید"></ion-loading>
    <!-- <div id="out-of-service-background" class="flex justify-content-center align-items-center">
      <h2 class="text-center">موقتا در دسترس نیست :(</h2>
    </div> -->
  </ion-app>
</template>

<style lang="scss" scoped>
#out-of-service-background {
  width: 100%;
  height: 100%;
  color: whitesmoke;
  background: rgb(2,0,36);
  background: linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(126,105,18,1) 59%, rgba(255,215,0,1) 100%, rgba(0,212,255,1) 100%);
}
</style>

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
