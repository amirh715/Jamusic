<template>
  <ion-content>
    <swiper
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :grabCursor="true"
      dir="rtl"
      style="height: 100vh;"
    >
      <swiper-slide>
        <div class="content flex flex-column justify-content-between space-4">
          <div>
            <h1 class="text-right">اَپلیکیشن جَم</h1>
            <p class="text-right">یک سرویس آزمایشیِ موزیک آنلاین است که امکان دسترسی به هزاران آهنگ و آلبوم را از صد ها هنرمند و ده ها سبک مختلف فراهم می کند.</p><br/>
          </div>
          <div>
            <ion-button v-if="deferredPrompt" @click="install" class="space-2-v" size="large" expand="block">
              <ion-icon :icon="phonePortraitOutline"></ion-icon>
              <b class="space-h">نصب</b>
            </ion-button>
            <ion-button v-else class="space-2-v" color="danger" size="large" expand="block">
              <b>منتظر باشید...</b>
            </ion-button>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <h1>Slide 2</h1>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <h1>Slide 3</h1>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <h1>Slide 4</h1>
        </div>
      </swiper-slide>
    </swiper>
  </ion-content>
</template>

<style scoped>
.content {
  width: 100vw;
  height: 100vh;
}
</style>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { Swiper } from 'swiper/types';
import { phonePortraitOutline } from 'ionicons/icons';

export default defineComponent({
  setup() {
    const swiper: Ref<Swiper> = ref(null);
    const onSwiper = (instance: Swiper) => {
      swiper.value = instance;
      swiper.value.allowTouchMove = false;
    };
    return {
      onSwiper,
      swiper,
    }
  },
  data() {
    return {
      deferredPrompt: null,
      phonePortraitOutline,
    }
  },
  methods: {
    onSlideChange() {
      console.log('Slide');
    },
    async dismiss() {
      this.deferredPrompt = null;
    },
    async install() {
      this.deferredPrompt.prompt();
    },
  },
  created() {
    console.log('created');
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      console.log('beforeinstallprompt');
      this.deferredPrompt = e;
    });
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
    });
  },
})
</script>
