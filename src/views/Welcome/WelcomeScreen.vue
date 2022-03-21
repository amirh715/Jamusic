<template>
  <ion-content>
    <swiper
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :grabCursor="true"
      dir="rtl"
      style="height: 100vh; overflow-y: hidden;"
    >
      <!-- Slide 1 -->
      <swiper-slide>
        <div style="width: 100vw; height: 90vh;" class="flex flex-column justify-content-between space-4">
          <div>
            <h1 class="text-right">اَپلیکیشن جَم</h1>
            <p class="text-right">
              یک سرویس آزمایشیِ موزیک آنلاینه که امکان دسترسی به هزاران آهنگ و آلبوم از صد ها هنرمند و ده ها 
              سبک مختلف رو فراهم می کنه.<br/>
              تنها کافیه نام هنرمند، آلبوم، یا آهنگ مورد نظرت رو جستجو کنی تا به راحتی پیداش کنی.<br/>
            </p>
            <p v-if="!isAppInstalled" class="text-right">اما قبل از هر کاری باید اَپلیکیشن رو نصب کنی :)</p>
          </div>
          <div>
            <div v-if="!isAppInstalled"></div>
            <div v-else>
              <ion-icon :icon="checkmarkCircleOutline" style="font-size: 9rem; opacity: 0.2;"></ion-icon>
            </div>
          </div>
          <div>
            <div v-if="!isRunningStandalone">
              <ion-button v-if="!isAppInstalled" @click="install" class="space-4-v" size="large" expand="block">
                <ion-icon :icon="phonePortraitOutline"></ion-icon>
                <b class="space-h">نصب</b>
              </ion-button>
              <b v-else>اَپلیکیشن روی گوشی شما نصب شده است. از مرورگر خارج و وارد اَپلیکیشن شوید.</b>
            </div>
            <div v-else>
            </div>
          </div>
        </div>
      </swiper-slide>
      <!-- ####### -->
      <!-- Slide 2 -->
      <swiper-slide>
        <div class="content flex flex-column justify-content-center space-4">
          <p class="text-right">
            بعد از اینکه سلیقه ات دستمون اومد پیشنهاد هایی هم مخصوص خودت بهت می دیم.
          </p>
        </div>
      </swiper-slide>
      <!-- ####### -->
      <!-- Slide 3 -->
      <swiper-slide>
        <div class="content flex flex-column justify-content-center space-4">
          <p class="text-right">
            ایجاد پلی لیست های جدید و دسترسی به اونها هم بسیار آسونه.
          </p>
        </div>
      </swiper-slide>
      <!-- ####### -->
      <!-- Slide 4 -->
      <swiper-slide>
        <div class="content flex flex-column justify-content-between space-4">
          <div></div>
          <h1 class="text-right">و در آخر...</h1>
          <p class="text-right">
            یادت باشه حتما این اَپلیکیشن رو به دوستانت هم معرفی کنی :)
          </p>
          <ion-button @click="$router.push({ name: 'Signup' })" fill="outline" class="space-2-v" size="large" expand="block">
            <ion-icon :icon="arrowBack"></ion-icon>
            <span class="space-h">ایجاد اکانت</span>
            <ion-icon :icon="arrowBack"></ion-icon>
          </ion-button>
        </div>
      </swiper-slide>
      <!-- ####### -->
    </swiper>
  </ion-content>
</template>

<style scoped>
.content {
  width: 100vw;
  height: 90vh;
}
</style>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { Swiper } from 'swiper/types';
import { phonePortraitOutline, arrowBack, checkmarkCircleOutline } from 'ionicons/icons';

export default defineComponent({
  setup() {
    const swiper: Ref<Swiper> = ref(null);
    const onSwiper = (instance: Swiper) => {
      swiper.value = instance;
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
      arrowBack,
      checkmarkCircleOutline,
    }
  },
  computed: {
    isAppInstalled() {
      return this.isRunningStandalone;
    },
    isRunningStandalone() {
      return window.matchMedia('(display-mode: standalone)').matches;
    },
  },
  methods: {
    async install() {
      await this.deferredPrompt.prompt();
    },
    onSlideChange() {
      console.log('onSlideChange');
    },
  },
  created() {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
    });
  },
})
</script>
