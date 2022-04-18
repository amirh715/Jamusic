<template>
  <div style="dir: ltr">
    <swiper @swiper="onSwiper" style="height: 100vh;" loop>
      <swiper-slide>
        <ion-card>
          <ion-card-header>
            <b>شماره موبایل خود را وارد کنید.</b>
          </ion-card-header>
          <ion-card-content>
            <div>
              <div :class="[v$.mobile.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
                <label>شماره موبایل</label>
                <ion-input
                  type="tel"
                  v-model="mobile"
                  inputmode="tel"
                  placeholder="09121234567"
                  @change="v$.mobile.$touch"
                />
              </div>
              <error-displayer :errors="v$.mobile.$errors" />
            </div>
            <div class="flex justify-content-center space-v">
              <ion-button @click="submitRequest" :disabled="v$.mobile.$invalid">
                <span class="space-2-h">برو!</span>
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </swiper-slide>
      <swiper-slide>
        <ion-card>
          <ion-card-header>
            <b>بازنشانی رمز اکانت</b>
          </ion-card-header>
          <ion-card-content>
            <div>
              <div :class="[v$.resetCode.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
                <label>کد بازنشانی رمز</label>
                <ion-input
                  type="number"
                  inputmode="decimal"
                  placeholder="1234"
                  @input="(ev) => resetCode = ev.target.value"
                  @change="v$.resetCode.$touch"
                />
              </div>
              <error-displayer :errors="v$.resetCode.$errors" />
            </div>
            <div>
              <div :class="[v$.newPassword.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
                <label>رمز جدید</label>
                <ion-input
                  type="password"
                  v-model="newPassword"
                  placeholder="********"
                  @change="v$.newPassword.$touch"
                  @ionFocus="newPasswordFocused"
                />
              </div>
              <error-displayer :errors="v$.newPassword.$errors" />
            </div>
            <div>
              <div :class="[v$.newPasswordAgain.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
                <label>تکرار رمز جدید</label>
                <ion-input
                  type="password"
                  v-model="newPasswordAgain"
                  placeholder="********"
                  @change="v$.newPasswordAgain.$touch"
                />
              </div>
            </div>
            <error-displayer :errors="v$.newPasswordAgain.$errors" />
            <div class="flex justify-content-center">
              <ion-button @click="submitReset" :disabled="v$.$invalid">
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
import { alertController, toastController } from '@ionic/vue'
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import { Swiper as SwiperJs } from 'swiper/types';
import useVuelidate from '@vuelidate/core';
import { helpers, sameAs } from '@vuelidate/validators';
import { User } from '@/validators';

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
      v$: useVuelidate(),
    };
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  validations() {
    return {
      mobile: { mobile: helpers.withMessage(() => 'شماره موبایل درست نیست.', User.mobile) },
      resetCode: { resetCode: helpers.withMessage(() => 'کد بازنشانی درست نیست.', User.passwordResetCode) },
      newPassword: { newPassword: helpers.withMessage(() => 'رمز باید حداقل ۸ کاراکتر باشد.', User.password) },
      newPasswordAgain: { newPasswordAgain: helpers.withMessage(() => 'تکرار رمز با رمز یکسان نیست.', sameAs(this.newPassword)) },
    }
  },
  data() {
    return {
      mobile: '',
      resetCode: '',
      newPassword: '',
      newPasswordAgain: '',
      showPasswordNotice: true,
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
    async newPasswordFocused() {
      if(!this.showPasswordNotice) return;
      const alert = await alertController.create({
        header: 'هشدار',
        message: 'علیرغم اینکه رمز اکانت شما رمزگذاری می شود، برای احتیاط بیشتر از رمز های معمول خود استفاده نکنید.',
        buttons: [
          {
            text: 'باشه',
          },
        ],
      });
      await alert.present();
      this.showPasswordNotice = false;
    },
  },
})
</script>
