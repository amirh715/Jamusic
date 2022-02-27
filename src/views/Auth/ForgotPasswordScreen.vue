<template>
  <div style="dir: ltr">
    <swiper @swiper="onSwiper" style="height: 100vh;" loop>
      <swiper-slide>
        <ion-card>
          <ion-card-content>
            <label>شماره موبایل</label>
            <ion-input
              type="tel"
              v-model="mobile"
              placeholder="۰۹۱۲۴۹۷۴۱۶۳"
            />
            <div class="flex justify-content-center">
              <ion-button @click="submitRequest">
                <span class="space-2-h">برو!</span>
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </swiper-slide>
      <swiper-slide>
        <ion-card>
          <ion-card-content>
            <label>کد بازنشانی رمز</label>
            <ion-input
              type="number"
              @input="(ev) => resetCode = ev.target.value"
            />
            <label>رمز جدید</label>
            <ion-input
              type="password"
              v-model="newPassword"
            />
            <label>تکرار رمز جدید</label>
            <ion-input
              type="password"
              v-model="newPasswordAgain"
            />
            <div class="flex justify-content-center">
              <ion-button @click="submitReset">
                <span class="space-2-h">برو!</span>
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { toastController } from '@ionic/vue'
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import { Swiper as SwiperJs } from 'swiper/types';

export default defineComponent({
  setup() {
    const swiper = ref(null);
    const onSwiper = (swiperInstance: SwiperJs) => {
      swiperInstance.allowTouchMove = false;
      swiper.value = swiperInstance;
    };
    return {
      onSwiper,
      swiper,
    };
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      mobile: '',
      resetCode: '',
      newPassword: '',
      newPasswordAgain: '',
      checkmarkCircleOutline,
      closeCircleOutline,
    };
  },
  methods: {
    async submitRequest() {
      try {
        await this.$store.dispatch(
          ACTION_TYPES.REQUEST_PASSWORD_RESET,
          this.mobile,
        );
        const toast = await toastController.create({
          message: 'کد بازنشانی رمز اکانت برای شما پیامک شد.',
          icon: checkmarkCircleOutline,
          color: 'success',
          duration: 4000,
        });
        await toast.present();
        this.swiper.slideNext();
      } catch(err) {
        const toast = await toastController.create({
          message: err.message,
          icon: closeCircleOutline,
          color: 'danger',
          duration: 4000,
        });
        await toast.present();
      }
    },
    async submitReset() {
      try {
        await this.$store.dispatch(ACTION_TYPES.RESET_PASSWORD,
          {
            mobile: this.mobile,
            code: this.resetCode,
            newPassword: this.newPassword,
          }
        );
        const toast = await toastController.create({
          message: 'رمز اکانت شما بازنشانی شد. لطفا وارد شوید.',
          icon: checkmarkCircleOutline,
          color: 'success',
          duration: 4000,
        });
        await toast.present();
        await this.$router.push({ name: 'Login' });
      } catch(err) {
          const toast = await toastController.create({
          message: err.message,
          icon: closeCircleOutline,
          color: 'danger',
          duration: 4000,
        });
        await toast.present();
      }
    },
  },
})
</script>
