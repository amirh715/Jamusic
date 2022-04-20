<template>
  <div class="flex flex-column justify-content-center meteor-background" style="height: 100vh;">
    <div>
      <h3 class="space-4-h">به جَم ما خوش اومدی :)</h3>
    </div>
    <ion-card>
      <ion-card-header>
        <h3 class="text-center">ایجاد اکانت</h3>
      </ion-card-header>
      <ion-card-content>
        <div class="flex flex-column">
          <div class="space">
            <div :class="[v$.mobile.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
              <label>شماره موبایل</label>
              <ion-input
                class="text-center"
                type="tel"
                v-model="mobile"
                placeholder="09121234567"
                @change="v$.mobile.$touch"
              />
            </div>
            <error-displayer :errors="v$.mobile.$errors" />
          </div>
          <div class="space">
            <div :class="[v$.name.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
              <label>اسم شما</label>
              <ion-input
                class="text-center"
                type="text"
                v-model="name"
                placeholder="Armin"
                @change="v$.name.$touch"
              />
            </div>
            <error-displayer :errors="v$.name.$errors" />
          </div>
          <div>
            <div :class="[v$.password.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
              <label>رمز</label>
              <ion-input
                class="text-center"
                type="password"
                v-model="password"
                placeholder="********"
                @ionFocus="passwordInputFocused"
                @change="v$.password.$touch"
              />
            </div>
            <error-displayer :errors="v$.password.$errors" />
          </div>
          <div>
            <div :class="[v$.passwordAgain.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
              <label>تکرار رمز </label>
              <ion-input
                class="text-center"
                type="password"
                placeholder="********"
                ref="password"
                v-model="passwordAgain"
                @change="v$.passwordAgain.$touch"
              />
            </div>
            <error-displayer :errors="v$.passwordAgain.$errors" />
          </div>
          <div class="flex justify-content-center space-2-v">
            <ion-button @click="submit" :disabled="v$.$invalid">
              <span class="space-2-h">برو</span>
            </ion-button>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
    <div class="flex justify-content-center">
      <ion-button @click="$router.push({ name: 'Login' })" size="small" color="dark" fill="outline">
        <span>اکانت دارم</span>
      </ion-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { alertController, toastController, ToastOptions } from '@ionic/vue';
import { SignupRequestDTO } from '@/classes/Auth/commands/SignupRequestDTO'
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { helpers, sameAs } from '@vuelidate/validators';
import { User } from '@/validators';
import useVuelidate from '@vuelidate/core';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';

export default defineComponent({
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      mobile: '',
      name: '',
      password: '',
      passwordAgain: '',
      showPasswordNotice: true,
    };
  },
  validations() {
    return {
      mobile: { mobile: helpers.withMessage(() => 'شماره موبایل درست نیست.', User.mobile) },
      name: { name: helpers.withMessage(() => 'اسم شما باید حداقل یک کاراکتر باشد.', User.name) },
      password: { password: helpers.withMessage(() => 'رمز باید حداقل ۸ کاراکتر باشد.', User.password) },
      passwordAgain: { passwordAgain: helpers.withMessage(() => 'تکرار رمز با رمز یکسان نیست.', sameAs(this.password)) }
    }
  },
  methods: {
    async submit() {
      let toastOptions: ToastOptions;
      try {
        const dto = new SignupRequestDTO({
          mobile: this.mobile,
          name: this.name,
          password: this.password,
        });
        await this.$store.dispatch(ACTION_TYPES.SIGNUP, dto);
        toastOptions = {
          message: 'اکانت شما ایجاد شد. یک پیامک حاوی کد تایید برای شما ارسال می شود.',
          icon: checkmarkCircleOutline,
          color: 'success',
          duration: 4000,
        }
      } catch(err) {
        toastOptions = {
          message: err.message,
          icon: closeCircleOutline,
          color: 'danger',
          duration: 4000,
        }
      } finally {
        const toast = await toastController.create(toastOptions);
        await toast.present();
      }
    },
    async passwordInputFocused() {
      if(this.showPasswordNotice) {
        const alert = await alertController.create({
          header: 'توجه',
          message: 'علیرغم اینکه رمز اکانت شما رمزگذاری می شود، برای احتیاط بیشتر از رمز های معمول خود استفاده نکنید.',
          buttons: [{
            text: 'باشه',
          }],
        });
        await alert.present();
        this.showPasswordNotice = false;
      }
    },
  },
})
</script>
