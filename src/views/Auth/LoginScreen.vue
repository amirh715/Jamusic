<template>
  <div class="flex flex-column justify-content-center align-items-center" style="height: 100vh;">
    <ion-card style="width: 70%">
      <ion-card-header>
        <h3 class="text-center">ورود</h3>
      </ion-card-header>
      <ion-card-content>
        <div>
          <label>شماره موبایل</label>
          <ion-input
            type="tel"
            v-model="mobile"
          />
        </div>
        <div>
          <label>رمز</label>
          <ion-input
            type="password"
            v-model="password"
          />
        </div>
        <div class="flex justify-content-center space-2-v">
          <ion-button @click="submit">
            <span class="space-2-h">برو</span>
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
    <div class="flex justify-content-center">
      <ion-button @click="$router.push({ name: 'Signup' })" size="small" color="dark" fill="outline">
        <span>اکانت ندارم</span>
      </ion-button>
      <ion-button @click="$router.push({ name: 'ForgotPassword' })" size="small" color="dark" fill="outline">
        <span>رمزم یادم نیست</span>
      </ion-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { toastController } from '@ionic/vue'
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { checkmarkOutline, warning } from 'ionicons/icons';

export default defineComponent({
  data() {
    return {
      mobile: '',
      password: '',
      checkmarkOutline,
      warning,
    };
  },
  methods: {
    async submit() {
      try {
        await this.$store.dispatch(ACTION_TYPES.LOGIN, { mobile: this.mobile, password: this.password });
        const toast = await toastController.create({
          message: 'خوش اومدید :)',
          duration: 3000,
          icon: this.warning,
          color: 'success',
        });
        toast.present();
      } catch(err) {
        const toast = await toastController.create({
          message: err.response.data.message,
          duration: 3000,
          icon: this.warning,
          color: 'danger',
        })
        toast.present();
      }
    },
  },
})
</script>
