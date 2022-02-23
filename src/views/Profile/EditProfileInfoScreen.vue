<template>
  
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="goBack" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b>پروفایل من</b>
        <ion-icon :icon="chevronForwardCircleOutline" style="opacity: 0;" size="large" class="space-h"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <ion-card>
      <ion-card-content>
        <div class="flex flex-column justify-content-center align-items-center">

          <div>
            <ion-thumbnail style="width: 15rem; height: 15rem;">
              <img v-if="!profileImageLoading" :src="profileImage || 'assets/images/Fadaei.jpg'" />
              <ion-skeleton-text v-else animated />
            </ion-thumbnail>

            <ion-fab style="position: relative; bottom: 3rem; right: -1rem;">
              <ion-fab-button>
                <ion-icon :icon="createOutline"></ion-icon>
              </ion-fab-button>
              <ion-fab-list side="start">
                <ion-fab-button v-if="profileImage" @click="removeProfileImageClicked" color="danger">
                  <ion-icon :icon="trashOutline"></ion-icon>
                </ion-fab-button>
                <ion-fab-button @click="openFileDialog" color="primary">
                  <ion-icon :icon="imageOutline"></ion-icon>
                </ion-fab-button>
              </ion-fab-list>
            </ion-fab>
          </div>

          <div class="flex flex-column justify-content-center align-items-center">
            <number-displayer :value="mobile" class="space-4-v dir-ltr" />
            <div>
              <div class="flex align-items-center">
                <label class="space-2-h">اسم شما</label>
                <ion-input
                  type="text"
                  v-model="name"
                  @input="v$.name.$touch"
                />
              </div>
              <error-displayer :errors="v$.name.$errors" />
            </div>
            <div>
              <div class="flex align-items-center soace-4-v">
                <label class="space-2-h">ایمیل</label>
                <ion-input
                  type="text"
                  v-model="email"
                  @change="v$.email.$touch"
                />
              </div>
              <error-displayer v-show="v$.email.$isDirty" :errors="v$.email.$errors" />
            </div>
          </div>

          <input
            type="file"
            ref="fileInput"
            accept="images/png, image/jpeg"
            @change="profileImageChanged"
            style="display: none;"
          />
          <div class="space-2-v">
            <ion-button @click="submit" :disabled="v$.$invalid || !v$.$anyDirty">
              <span class="space-h">برو</span>
            </ion-button>
          </div>

        </div>
      </ion-card-content>
    </ion-card>

  </ion-content>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  chevronForwardCircleOutline,
  closeCircleOutline,
  trashOutline,
  checkmarkCircleOutline,
  createOutline,
  imageOutline,
} from 'ionicons/icons';
import { ProfileService } from '@/services/ProfileService';
import { alertController, modalController, toastController, ToastOptions } from '@ionic/vue';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { EditProfileDTO } from '@/classes/Profile/commands/EditProfileDTO';
import ProfileImageCropperModal from '@/components/Profile/ProfileImageCropperModal.vue';
import useVuelidate from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { User } from '@/validators';

export default defineComponent({
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    return {
      name: { name: helpers.withMessage('اسم شما باید بین ۱ تا ۸۰ کاراکتر باشد. ', User.name) },
      email: { email: helpers.withMessage('ایمیل درست نیست.', User.email) },
    };
  },
  data() {
    return {
      mobile: '',
      name: '',
      email: '',
      profileImage: '',
      profileImageLoading: false,
      chevronForwardCircleOutline,
      trashOutline,
      createOutline,
      imageOutline,
    };
  },
  methods: {
    async submit() {
      let toastOptions: ToastOptions;
      try {
        this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
        const dto = new EditProfileDTO({
          name: this.name,
          email: this.email,
        });
        await ProfileService.editMyProfile(dto);
        toastOptions = {
          message: 'پروفایل شما تغییر کرد',
          icon: checkmarkCircleOutline,
          color: 'success',
          duration: 4000,
        }
        this.$router.push({ name: 'ProfileInfo' });
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
    async getProfileImage() {
      this.profileImageLoading = true;
      try {
        this.profileImage = URL.createObjectURL(await ProfileService.getMyProfileImage());
      } catch(err) {
        console.log(err);
      } finally {
        this.profileImageLoading = false;
      }
    },
    async removeProfileImageClicked() {
      const alert = await alertController.create({
        header: 'حذف عکس پروفایل',
        message: 'عکس پروفایل تان حذف شود؟',
        buttons: [
          {
            text: 'بیخیال',
          },
          {
            text: 'پاک کن',
            handler: async () => this.removeProfileImage(),
          },
        ]
      });
      await alert.present();
    },
    async removeProfileImage() {
      this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
      let toastOptions: ToastOptions;
      try {
        const dto = new EditProfileDTO({ removeProfileImage: true });
        await ProfileService.editMyProfile(dto);
        toastOptions = {
          message: 'عکس پروفایل شما پاک شد.',
          icon: checkmarkCircleOutline,
          color: 'success',
          duration: 4000,
        }
        await this.$router.push({ name: 'ProfileInfo' });
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
    openFileDialog() {
      this.$refs.fileInput.click();
    },
    async profileImageChanged(event: Event) {
      const selectedFile: File = this.$refs.fileInput.files[0];
      if(selectedFile) {
        const modal = await modalController.create({
          component: ProfileImageCropperModal,
          componentProps: {
            image: selectedFile,
            stencilProps: { aspectRatio: 1/1 },
          },
        });
        await modal.present();
        const modalResponse = await modal.onDidDismiss();
        this.profileImage = modalResponse.data && modalResponse.data.image;
        this.changeProfileImage(this.profileImage);
      } else {
        this.profileImage = null;
      }
    },
    async changeProfileImage(profileImage: string) {
      let toastOptions: ToastOptions;
      try {
        this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
        const dto = new EditProfileDTO({ profileImage });
        await ProfileService.editMyProfile(dto);
        toastOptions = {
          message: 'عکس پروفایل با موفقیت تغییر کرد.',
          icon: checkmarkCircleOutline,
          color: 'success',
          duration: 4000,
        }
        this.$router.push({ name: 'ProfileInfo' });
      } catch(err) {
        this.profileImage = null;
        toastOptions = {
          message: err.message,
          icon: closeCircleOutline,
          color: 'danger',
          duration: 4000,
        }
      } finally {
        this.$store.commit(COMMIT_TYPES.APP_WAITING, false);
        const toast = await toastController.create(toastOptions);
        toast.present();
      }
    },
    goBack() {
      this.$router.push({ name: 'ProfileInfo' });
    },
  },
  async mounted() {
    this.getProfileImage();
    try {
      const profile = await ProfileService.getMyProfile();
      this.mobile = profile.mobile;
      this.name = profile.name;
      this.email = profile.email;
    } catch(err) {
      // await this.$router.push({ name: 'ProfileInfo' });
      const toast = await toastController.create({
        message: err.message,
        icon: closeCircleOutline,
        color: 'danger',
        duration: 4000,
      });
      await toast.present();
    }
  },
})
</script>
