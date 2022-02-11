<template>
  <div>
    <ion-slides>
      <ion-slide>
        <ion-card>
          <ion-card-content>
            <label>شماره موبایل</label>
            <ion-input
              type="tel"
            />
            <div class="flex justify-content-center">
              <ion-button @click="submitRequest">
                <span class="space-2-h">برو!</span>
              </ion-button>
            </div>
          </ion-card-content>
          <ion-card-subtitle>
            <p class="text-center">کد بازنشانی رمز برای شما پیامک خواهد شد.</p>
          </ion-card-subtitle>
        </ion-card>
      </ion-slide>
      <ion-slide>
        <ion-card>
          <ion-card-content>
            <label>کد بازنشانی رمز</label>
            <ion-input
              type="number"
            />
            <label>رمز جدید</label>
            <ion-input
              type="password"
            />
            <label>تکرار رمز جدید</label>
            <ion-input
              type="password"
            />
            <div class="flex justify-content-center">
              <ion-button @click="submitReset">
                <span class="space-2-h">برو!</span>
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-slide>
    </ion-slides>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { toastController } from '@ionic/vue'
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';

export default defineComponent({
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
          { mobile: this.mobile }
        );
        const toast = await toastController.create({
          message: 'کد بازنشانی رمز اکانت برای شما پیامک شد.',
          icon: checkmarkCircleOutline,
          color: 'success',
          duration: 4000,
        });
        await toast.present();
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
    // async submitReset() {
    //   try {

    //   } catch(err) {

    //   }
    // },
  },
})
</script>
