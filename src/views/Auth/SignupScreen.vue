<template>
  <div id="signup-background" class="flex flex-column justify-content-center" style="height: 100vh;">
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
              @change="v$.mobile.$touch"
            />
            <error-displayer :errors="v$.mobile.$errors" />
          </div>
          <div>
            <label>اسم شما</label>
            <ion-input
              class="text-center"
              type="text"
              v-model="name"
              @change="v$.name.$touch"
            />
            <error-displayer :errors="v$.name.$errors" />
          </div>
          <div>
            <label>رمز</label>
            <ion-input
              class="text-center"
              type="password"
              v-model="password"
              @ionFocus="passwordInputFocused"
              @change="v$.password.$touch"
            />
            <error-displayer :errors="v$.password.$errors" />
          </div>
          <div>
            <label>تکرار رمز </label>
            <ion-input
              class="text-center"
              type="password"
              ref="password"
              v-model="passwordAgain"
              @change="v$.passwordAgain.$touch"
            />
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

<style scoped>
#signup-background {
  background-size: cover;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1000' height='1700' preserveAspectRatio='none' viewBox='0 0 1000 1700'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1048%26quot%3b)' fill='none'%3e%3cpath d='M568 1348L299 1617' stroke-width='6' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M157 451L-349 957' stroke-width='10' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M604 277L956 -75' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M738 264L393 609' stroke-width='8' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M706 1653L1425 934' stroke-width='6' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M571 1468L-97 2136' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M969 1667L1537 1099' stroke-width='10' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M688 1378L1140 926' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M814 807L1378 243' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M580 1508L193 1895' stroke-width='6' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M532 263L1131 -336' stroke-width='8' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M267 1159L985 441' stroke-width='8' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M501 1227L874 854' stroke-width='6' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M158 998L-165 1321' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M279 1304L-105 1688' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M405 1597L-40 2042' stroke-width='10' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M98 72L-521 691' stroke-width='10' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M645 343L81 907' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M732 686L27 1391' stroke-width='10' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M859 828L1123 564' stroke-width='10' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M835 1532L389 1978' stroke-width='10' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M41 1508L-218 1767' stroke-width='8' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M220 479L-359 1058' stroke-width='6' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M219 963L888 294' stroke-width='6' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M798 916L497 1217' stroke-width='6' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M522 978L-30 1530' stroke-width='8' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M785 865L270 1380' stroke-width='6' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M489 513L1009 -7' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M89 571L-205 865' stroke-width='10' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M551 1271L1270 552' stroke-width='6' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M799 778L77 1500' stroke-width='6' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M202 491L854 -161' stroke-width='6' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M161 36L-565 762' stroke-width='10' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M85 1333L553 865' stroke-width='10' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M691 84L1128 -353' stroke-width='6' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M100 603L387 316' stroke-width='8' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M762 1284L305 1741' stroke-width='10' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M636 709L1381 -36' stroke-width='8' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M225 1464L-386 2075' stroke-width='10' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M576 1L868 -291' stroke-width='10' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M988 1586L1274 1300' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M71 1230L548 753' stroke-width='6' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M103 49L427 -275' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M827 1078L148 1757' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M558 241L156 643' stroke-width='8' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M162 533L-117 812' stroke-width='6' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M780 163L1237 -294' stroke-width='10' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M563 1103L813 853' stroke-width='8' stroke='url(%23SvgjsLinearGradient1050)' stroke-linecap='round' class='BottomLeft'%3e%3c/path%3e%3cpath d='M137 875L705 307' stroke-width='10' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3cpath d='M520 1057L-48 1625' stroke-width='8' stroke='url(%23SvgjsLinearGradient1049)' stroke-linecap='round' class='TopRight'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1048'%3e%3crect width='1000' height='1700' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='0%25' y1='100%25' x2='100%25' y2='0%25' id='SvgjsLinearGradient1049'%3e%3cstop stop-color='rgba(255%2c 215%2c 0%2c 0)' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(255%2c 215%2c 0%2c 1)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3clinearGradient x1='100%25' y1='0%25' x2='0%25' y2='100%25' id='SvgjsLinearGradient1050'%3e%3cstop stop-color='rgba(255%2c 215%2c 0%2c 0)' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(255%2c 215%2c 0%2c 1)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e");
}
</style>

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
