<template>
  <ion-content style="max-height: 100vh;">
    <swiper
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :pagination="showSliderPagination"
      :clickable="true"
      :grabCursor="true"
      dir="rtl"
      direction="vertical"
      id="background-gradient"
      :style="{height: isAppInstalled ? '100vh' : '100%'}"
    >
      <!-- Slide 1 -->
      <swiper-slide>
        <div style="width: 100vw; height: 85vh;" class="flex flex-column justify-content-between space-4">
          <div>
            <h1 class="text-right">اَپلیکیشن جَم</h1>
            <p class="text-right">
              یک سرویس آزمایشیِ موزیک آنلاینه که امکان دسترسی به هزاران آهنگ و آلبوم از صد ها هنرمند و ده ها 
              سبک مختلف رو فراهم می کنه.<br/>
              تنها کافیه نام هنرمند، آلبوم، یا آهنگ مورد نظرت رو جستجو کنی تا به راحتی پیداش کنی.<br/>
            </p>
          </div>
          <!-- <ion-button v-if="!isAppInstalled" @click="install" class="space-4-v" size="large" expand="block">
            <ion-icon :icon="phonePortraitOutline"></ion-icon>
            <b class="space-h">نصب</b>
          </ion-button> -->
          <img class="logo-background" src="assets/icons/ios/1024.png"/>
        </div>
      </swiper-slide>
      <!-- ####### -->
      <!-- Slide 2 -->
      <swiper-slide>
        <div class="content flex flex-column justify-content-center space-4">
          <p class="text-right">
            بعد از اینکه سلیقه ات دستمون اومد پیشنهاد هایی هم مخصوص خودت بهت می دیم که توی 
            صفحه
            <span style="font-size: 1.5rem;">
              <ion-icon :icon="planetOutline"></ion-icon>
            </span>
            می تونی اونارو ببینی.
          </p>
          <p class="text-right">
            ایجاد پلی لیست های جدید و دسترسی به اونها هم بسیار آسونه و می تونی اینکارو از 
            طریق صفحه 
            <span style="font-size: 1.5rem;">
              <ion-icon :icon="albumsOutline"></ion-icon>
            </span>
            به راحتی انجام بدی.
          </p>
        </div>
      </swiper-slide>
      <!-- ####### -->
      <!-- Slide 3 -->
      <swiper-slide>
        <div class="content flex flex-column justify-content-center space-4">
          <h1 class="text-right">و در آخر...</h1>
          <p class="text-right">
            یادت باشه حتما این اَپلیکیشن رو به دوستانت هم معرفی کنی :)
          </p>
        </div>
      </swiper-slide>
      <!-- ####### -->
      <!-- Slide 4 -->
      <swiper-slide>
        <div class="content flex flex-column justify-content-between space-4">
          <p v-show="!isAppInstalled" class="text-right">
            اما قبل از هر کاری باید اَپلیکیشن رو نصب کنید...<br/>
            <b>
              بعد از اینکه اینکارو کردید از مرورگر خارج شید، وارد اَپلیکیشن شید، و اکانت ایجاد کنید.
            </b>
          </p>
          <ion-button v-if="isAppInstalled" @click="$router.push({ name: 'Signup' })" fill="outline" class="space-2-v" size="large" expand="block">
            <ion-icon :icon="personOutline"></ion-icon>
            <span class="space-h">ایجاد اکانت</span>
          </ion-button>
          <div v-else>
            <ion-button @click="install" class="space-2-v" size="large" expand="block">
              <span class="space-h">نصب</span>
              <ion-icon :icon="phonePortraitOutline"></ion-icon>
            </ion-button>
            <ion-button @click="$router.push({ name: 'Signup' })" v-show="showSignupButton" fill="outline" size="small">
              <span>هیچ اتفاقی نمیوفته؟ بدون نصب استفاده کنید.</span>
            </ion-button>
          </div>
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
#background-gradient {
  color: whitesmoke;
  background: rgb(2,0,36);
  background: linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(126,105,18,1) 59%, rgba(255,215,0,1) 100%, rgba(0,212,255,1) 100%);
}
.logo-background {
  position: fixed;
  z-index: -1;
  bottom: 10px;
  right: -120px;
  opacity: 0.1;
}
</style>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { Swiper } from 'swiper/types';
import {
  phonePortraitOutline,
  arrowBack,
  checkmarkCircleOutline,
  planetOutline,
  albumsOutline,
  personOutline,
} from 'ionicons/icons';

export default defineComponent({
  setup() {
    const swiper = ref(null);
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
      isAppInstalled: false,
      showSignupButton: false,
      phonePortraitOutline,
      arrowBack,
      checkmarkCircleOutline,
      planetOutline,
      albumsOutline,
      personOutline
    }
  },
  computed: {
    showInstallButton() {
      return !this.isAppInstalled;
    },
    showSliderPagination() {
      return true;
    },
  },
  methods: {
    async install() {
      setTimeout(() => {
        this.showSignupButton = true;
      }, 2000);
      await this.deferredPrompt.prompt();
    },
    isRunningStandalone() {
      return window.matchMedia('(display-mode: standalone)').matches;
    },
  },
  created() {
    if(this.isRunningStandalone()) {
      this.isAppInstalled = true;
    }
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.isAppInstalled = true;
    });
  },
})
</script>
