<template>
  
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="$router.back()" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b>پروفایل من</b>
        <ion-icon :icon="chevronForwardCircleOutline" style="opacity: 0;" size="large" class="space-h"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <div class="flex flex-column">

      <ion-card @click="$router.push({ name: 'EditProfileInfo' })">
        <ion-card-content>
          
          <div class="flex">

            <div>
              <ion-thumbnail style="width: 8rem; height: 8rem;">
                <img v-if="!profileImageLoading" :src="profileImage || 'assets/images/disc.png'" />
                <ion-skeleton-text
                  v-else
                  animated
                />
              </ion-thumbnail>
            </div>

            <div style="width: 100%" class="flex flex-column justify-content-center align-items-center dir-ltr">
              <h1>{{profile && profile.name}}</h1>
              <number-displayer :value="profile && profile.mobile" />
              <b>{{profile && profile.email}}</b>
            </div>

          </div>
        
        </ion-card-content>
      </ion-card>

      <ion-list>
        <ion-item
          v-if="profile && profile.email && !profile.isEmailVerified"
          @click="openEmailVerificationConfirmationDialog"
          color="warning"
        >
          <div class="flex">
            <ion-icon :icon="alertCircleOutline" size="large"></ion-icon>
            <span class="space-h">برای تایید ایمیل لمس کنید.</span>
          </div>
        </ion-item>
        <ion-item @click="$router.push({ name: 'About' })">
          <div class="flex">
            <ion-icon :icon="informationCircleOutline" size="large"></ion-icon>
            <span class="space-h">درباره جَم</span>
          </div>
        </ion-item>
        <ion-item @click="$router.push({ name: 'ChangePassword' })">
          <div class="flex">
            <ion-icon :icon="keyOutline" size="large"></ion-icon>
            <span class="space-h">تغییر رمز</span>
          </div>
        </ion-item>
        <ion-item id="contactMeTrigger">
          <div class="flex">
            <ion-icon :icon="accessibilityOutline" size="large"></ion-icon>
            <span class="space-h">ارتباط با سازنده</span>
          </div>
          <!-- contact me popover -->
          <ion-popover trigger="contactMeTrigger" :arrow="false" alignment="end" dismiss-on-select>
            <ion-list>
              <ion-item @click="goToLinkedIn">
                <ion-icon :icon="logoLinkedin"></ion-icon>
                <span class="space-h">لینکدین</span>
              </ion-item>
              <ion-item @click="goToInstagram">
                <ion-icon :icon="logoInstagram"></ion-icon>
                <span class="space-h">اینستاگرام</span>
              </ion-item>
            </ion-list>
          </ion-popover>
          <!--  -->
        </ion-item>
        <ion-item @click="$router.push({ name: 'NewReport' })">
          <div class="flex">
            <ion-icon :icon="bugOutline" size="large"></ion-icon>
            <span class="space-h">گزارش اشکال</span>
          </div>
        </ion-item>
        <ion-item @click="openSupportMeDialog">
          <div class="flex">
            <ion-icon :icon="cafeOutline" size="large"></ion-icon>
            <span class="space-h">حمایت کنید</span>
          </div>
        </ion-item>
        <ion-item @click="deleteSearchHistory">
          <div class="flex">
            <ion-icon :icon="searchOutline" size="large"></ion-icon>
            <span class="space-h">حذف سوابق جستجو</span>
          </div>
        </ion-item>
        <ion-item @click="openLogoutDialog">
          <div class="flex">
            <ion-icon :icon="logInOutline" size="large"></ion-icon>
            <span class="space-h">خروج</span>
          </div>
        </ion-item>
      </ion-list>

    </div>

    <div style="width: 100%; height: 3rem; position: absolute; bottom: 0">
      <p class="text-center" style="font-size: small; opacity: 0.1">v1.0.0</p>
    </div>
    
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  alertCircleOutline,
  informationCircleOutline,
  keyOutline,
  accessibilityOutline,
  logoLinkedin,
  logoInstagram,
  bugOutline,
  cafeOutline,
  logInOutline,
  closeCircleOutline,
  chevronForwardCircleOutline,
  checkmarkCircleOutline,
  searchOutline,
} from 'ionicons/icons';
import { AlertButton, alertController, toastController, ToastOptions } from '@ionic/vue';
import { ProfileService } from '@/services/ProfileService';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import { AuthService } from '@/services/AuthService';
import { DatabaseManager } from '@/services/DatabaseManager';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';

export default defineComponent({
  data() {
    return {
      profile: null,
      profileImage: null,
      profileImageLoading: false,
      showEmailVerificationNotice: true,
      alertCircleOutline,
      informationCircleOutline,
      keyOutline,
      accessibilityOutline,
      logoLinkedin,
      logoInstagram,
      bugOutline,
      cafeOutline,
      logInOutline,
      chevronForwardCircleOutline,
      checkmarkCircleOutline,
      searchOutline,
    };
  },
  methods: {
    goToLinkedIn() {
      window.open('https://linkedin.com/in/amirh715');
    },
    goToInstagram() {
      window.open('https://instagram.com/amirh715');
    },
    async openEmailVerificationConfirmationDialog() {
      const okButton: AlertButton = {
        text: 'ادامه می دهم',
        handler: async () => {
          this.showEmailVerificationNotice = false;
          this.requestEmailVerification();
        },
      }
      const cancelButton: AlertButton = {
        text: 'بیخیال',
        role: 'cancel',
      }
      const alert = await alertController.create({
        header: 'تایید ایمیل',
        message: 'با این کار یک لینک به ایمیل شما ارسال خواهد شد. ادامه می دهید؟',
        buttons: [cancelButton, okButton],
      });
      alert.present();
    },
    async requestEmailVerification() {
      let toastOptions: ToastOptions;
      try {
        await AuthService.requestEmailVerification();
        toastOptions = {
          message: 'یک لینک برای تایید به ایمیل شما ارسال شد.',
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
    async openSupportMeDialog() {
      const okButton: AlertButton = {
        text: 'پرداخت با آیدی پِی',
        handler: () => {
          window.open('https://idpay.ir/jamusic');
        },
      }
      const cancelButton: AlertButton = {
        text: 'بیخیال',
        role: 'cancel',
      }
      const alert = await alertController.create({
        header: 'حمایت کنید',
        message: 'اپلیکیشن جَم برای ادامه سرویس دهی نیاز به منابع سخت افزاری دارد. شما می توانید در تامین بخشی از این هزینه ها مشارکت کنید.',
        buttons: [cancelButton, okButton],
      });
      await alert.present();
    },
    async openLogoutDialog() {
      const okButton: AlertButton = {
        text: 'بله خارج شو',
        handler: () => {
          this.$store.dispatch(ACTION_TYPES.LOGOUT);
        },
      }
      const cancelButton: AlertButton = {
        text: 'بیخیال',
        role: 'cancel',
      }
      const alert = await alertController.create({
        header: 'خروج',
        message: 'آیا می خواهید از اکانت تان خارج شوید؟',
        buttons: [cancelButton, okButton],
      });
      alert.present();
    },
    async deleteSearchHistory() {
      this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
      let toastOptions: ToastOptions;
      try {
        const history = await DatabaseManager.searchHistory.toArray();
        await DatabaseManager.searchHistory.bulkDelete(history.map(record => record.id));
        toastOptions = {
          message: 'سوابق جستجوی شما پاک شد.',
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
        this.$store.commit(COMMIT_TYPES.APP_WAITING, false);
        const toast = await toastController.create(toastOptions);
        await toast.present();
      }
    },
  },
  async mounted() {
    try {
      this.profile = await ProfileService.getMyProfile();
    } catch(err) {
      await this.$router.push({ name: 'Home' });
      const toast = await toastController.create({
        message: err.message,
        color: 'danger',
        icon: closeCircleOutline,
        duration: 4000,
      });
      await toast.present();
    }
    try {
      const blob = await ProfileService.getMyProfileImage();
      this.profileImage = blob ? URL.createObjectURL(blob) : null;
    } catch(err) {
      if(err.request.status === 404) return;
      const toast = await toastController.create({
        message: err.message,
        color: 'danger',
        icon: closeCircleOutline,
        duration: 4000,
      });
      await toast.present();
    }
  },
})
</script>
