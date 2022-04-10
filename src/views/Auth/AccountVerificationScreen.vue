<template>
  <div class="flex justify-content-center align-items-center" style="height: 100%;">
    <ion-card>
      <ion-card-header>
        <h4 class="text-center">کد تایید را وارد کنید</h4>
      </ion-card-header>
      <ion-card-content>
        <div class="flex justify-content-center align-items-center">
          <ion-label>کد تایید</ion-label>
          <ion-input
            type="text"
            v-model="code"
            @change="v$.code.$touch"
            placeholder="۱۲۳۴"
            class="text-center"
          />
          <error-displayer :errors="v$.code.$errors" />
        </div>
        <div class="flex justify-content-center">
          <ion-button @click="submit" :disabled="v$.$invalid" class="space-v-4">
            <span class="space-2-h">برو</span>
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { toastController, ToastOptions } from '@ionic/vue';
import { User } from '@/validators';
import { helpers } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { checkmarkOutline, closeCircleOutline } from 'ionicons/icons';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';

export default defineComponent({
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      mobile: this.$route.query['mobile'],
      code: '',
    }
  },
  validations() {
    return {
      code: { code: helpers.withMessage(() => 'کد تایید درست نیست!', User.accountVerificationCode) },
    }
  },
  methods: {
    async submit() {
      let toastOptions: ToastOptions;
      try {
        await this.$store.dispatch(ACTION_TYPES.VERIFY_ACCOUNT, { mobile: this.mobile, code: this.code });
        toastOptions = {
          message: 'اکانت شما فعال شد. لطفا وارد شوید.',
          icon: checkmarkOutline,
          duration: 4000,
          color: 'success',
        }
      } catch(err) {
        toastOptions = {
          message: err.message,
          icon: closeCircleOutline,
          duration: 4000,
          color: 'danger',
        }
      } finally {
        const toast = await toastController.create(toastOptions);
        toast.present();
      }
    },
    async requestAccountVerificationAgain() {
      let toastOptions: ToastOptions;
      this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
      try {
        await this.$store.dispatch(ACTION_TYPES.REQUEST_ACCOUNT_VERIFICATION);
        toastOptions = {
          message: 'کد تایید شماره موبایل برای شما پیامک می شود.',
          icon: checkmarkOutline,
          duration: 4000,
          color: 'success',
        }
      } catch(err) {
        toastOptions = {
          message: err.message,
          icon: closeCircleOutline,
          duration: 4000,
          color: 'danger',
        }
      } finally {
        const toast = await toastController.create(toastOptions);
        await toast.present();
        this.$store.commit(COMMIT_TYPES.APP_WAITING, false);
      }
    },
  }
})
</script>
