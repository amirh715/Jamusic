<template>
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between">
        <ion-icon @click="$router.back()" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b>تغییر رمز</b>
        <ion-icon :icon="chevronForwardCircleOutline" size="large" style="opacity: 0;" class="space-h"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-card>
      <ion-card-content>
        <div class="flex flex-column">
          <div>
            <div :class="[v$.currentPassword.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
              <label class="space-2-h">رمز فعلی</label>
              <ion-input
                type="password"
                placeholder="********"
                v-model="currentPassword"
                @change="v$.currentPassword.$touch"
              />
            </div>
            <error-displayer :errors="v$.currentPassword.$errors" />
          </div>
          <div>
            <div :class="[v$.newPassword.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
              <label class="space-2-h">رمز جدید</label>
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
              <label class="space-2-h">تکرار رمز جدید</label>
              <ion-input
                type="password"
                placeholder="********"
                @change="v$.newPasswordAgain.$touch"
                v-model="newPasswordAgain"
              />
            </div>
            <error-displayer :errors="v$.newPasswordAgain.$errors" />
          </div>
          <div class="flex justify-content-center space-2-v">
            <ion-button @click="submit" :disabled="v$.$invalid">
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
import { helpers, sameAs } from '@vuelidate/validators';
import { User } from '@/validators';
import useVuelidate from '@vuelidate/core';

export default defineComponent({
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      newPasswordAgain: '',
      showPasswordNotice: true,
      chevronForwardCircleOutline,
    }
  },
  validations() {
    return {
      currentPassword: { currentPassword: helpers.withMessage('رمز باید حداقل ۸ کاراکتر باشد.', User.password) },
      newPassword: { newPassword: helpers.withMessage('رمز باید حداقل ۸ کاراکتر باشد.', User.password) },
      newPasswordAgain: { newPasswordAgain: helpers.withMessage(() => 'تکرار رمز با رمز یکسان نیست.', sameAs(this.newPassword)) },
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
  },
})
</script>
