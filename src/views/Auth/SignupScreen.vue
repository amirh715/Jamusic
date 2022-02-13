<template>
  <div class="flex flex-column justify-content-center" style="height: 100vh;">
    <div>
      <h3>به جَم ما خوش اومدی :)</h3>
    </div>
    <ion-card>
      <ion-card-header>
        <h3 class="text-center">ایجاد اکانت</h3>
      </ion-card-header>
      <ion-card-content>
        <div class="flex flex-column">
          <div>
            <label>شماره موبایل</label>
            <ion-input
              class="text-center"
              type="tel"
              v-model="mobile"
            />
          </div>
          <div>
            <label>اسم شما</label>
            <ion-input
              class="text-center"
              type="text"
              v-model="name"
            />
          </div>
          <div>
            <label>رمز</label>
            <ion-input
              class="text-center"
              type="password"
              v-model="password"
              @ionFocus="passwordInputFocused"
            />
          </div>
          <div>
            <label>تکرار رمز </label>
            <ion-input
              class="text-center"
              type="password"
              ref="password"
              v-model="passwordAgain"
            />
          </div>
          <div class="flex justify-content-center space-2-v">
            <ion-button @click="submit">
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
import { alertController } from '@ionic/vue';
import { SignupRequestDTO } from '@/classes/Auth/commands/SignupRequestDTO'
import { ACTION_TYPES } from '@/store/ACTION_TYPES';

export default defineComponent({
  data() {
    return {
      mobile: '',
      name: '',
      password: '',
      passwordAgain: '',
      loading: false,
      showPasswordNotice: true,
    };
  },
  methods: {
    async submit() {
      try {
        this.loading = true;
        const dto = new SignupRequestDTO({
          mobile: this.mobile,
          name: this.name,
          password: this.password,
        });
        await this.$store.dispatch(ACTION_TYPES.SIGNUP, dto);
      } catch(err) {
        console.log(err);
      } finally {
        this.loading = false;
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
