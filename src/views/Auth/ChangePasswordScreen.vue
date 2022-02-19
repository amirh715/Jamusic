<template>
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between">
        <ion-icon @click="goBack" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b>تغییر رمز</b>
        <ion-icon :icon="chevronForwardCircleOutline" size="large" style="opacity: 0;" class="space-h"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-card>
      <ion-card-content>
        <div class="flex flex-column">
          <div class="flex align-items-center">
            <label class="space-2-h">رمز فعلی</label>
            <ion-input
              type="password"
              v-model="currentPassword"
            />
          </div>
          <div class="flex align-items-center">
            <label class="space-2-h">رمز جدید</label>
            <ion-input
              type="password"
              v-model="newPassword"
              @ionFocus="newPasswordFocused"
            />
          </div>
          <div class="flex align-items-center">
            <label class="space-2-h">تکرار رمز جدید</label>
            <ion-input
              type="password"
              v-model="newPasswordAgain"
            />
          </div>
          <div class="flex justify-content-center space-2-v">
            <ion-button @click="submit">
              <b>برو</b>
            </ion-button>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { chevronForwardCircleOutline, closeCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { alertController, toastController, ToastOptions } from '@ionic/vue';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { AuthService } from '@/services/AuthService';
import { ChangePasswordRequestDTO } from '@/classes/Auth/commands/ChangePasswordRequestDTO';

export default defineComponent({
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      newPasswordAgain: '',
      showPasswordNotice: true,
      chevronForwardCircleOutline,
    }
  },
  methods: {
    async submit() {
      let options: ToastOptions;
      this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
      try {
        const dto = new ChangePasswordRequestDTO({
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
        });
        await AuthService.changePassword(dto);
        this.$router.push({ name: 'ProfileInfo' });
        options = {
          message: 'رمز اکانت شما تغییر کرد.',
          icon: checkmarkCircleOutline,
          color: 'success',
          duration: 4000,
        };
      } catch(err) {
        options = {
          message: err.message,
          icon: closeCircleOutline,
          color: 'danger',
          duration: 4000,
        };
      } finally {
        const toast = await toastController.create(options);
        await toast.present();
        this.$store.commit(COMMIT_TYPES.APP_WAITING, false);
      }
    },
    async newPasswordFocused() {
      if(this.showPasswordNotice) {
        const alert = await alertController.create({
          header: 'هشدار',
          message: 'علیرغم اینکه رمز اکانت شما رمزگذاری می شود، برای احتیاط بیشتر از رمز های معمول خود استفاده نکنید.',
          buttons: ['باشه'],
        });
        await alert.present();
        this.showPasswordNotice = false;
      }
    },
    goBack() {
      this.$router.push({ name: 'ProfileInfo' });
    },
  },
})
</script>
