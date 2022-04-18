<template>
  
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="$router.back()" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
        <b>گزارش اشکال</b>
        <ion-icon :icon="chevronForwardCircleOutline" style="opacity: 0;" size="large" class="space-h"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <ion-card>
      <ion-card-content>
        <div class="flex flex-column">
          <div>
            <p v-if="reportedEntityId">
              شما در حال ثبت گزارش درباره <b>{{reportedEntityTitle}}</b>
              هستید. اگر مشکلی که با آن مواجه شده اید در مورد هنرمند یا 
              اثر خاصی نیست از طریق گزینه گزارش اشکال در صفحه پروفایل تان 
              گزارش را ثبت کنید.
            </p>
            <p v-else>
              لطفا اگر مشکلی که با آن مواجه شده اید در مورد یک هنرمند یا اثر خاص است، به صفحه آن هنرمند یا اثر رفته و 
              از طریق گزینه <ion-icon :icon="bugOutline"></ion-icon>
              در بالای صفحه گزارش را ثبت کنید.
            </p>
          </div>
          <div class="flex justify-content-start align-items-center space-v">
            <!-- <ion-label class="space-h">نوع گزارش</ion-label> -->
            <!-- <ion-select
              v-model="reportType"
              cancel-text="بیخیال"
              ok-text="برو"
              title="نوع گزارش"
              @ionChange="v$.reportType.$touch"
              style="width: 8rem">
                <ion-select-option value="TECHNICAL">
                  <span>فنی</span>
                </ion-select-option>
                <ion-select-option value="CONTEsNT">
                  <span>محتوایی</span>
                </ion-select-option>
            </ion-select> -->
            <ion-radio-group
              v-model="reportType"
              @ionChange="v$.reportType.$touch"
              style="width: 100%;"
            >
              <ion-list-header>
                <ion-label>نوع گزارش</ion-label>
              </ion-list-header>
              <ion-item>
                <ion-label><span>فنی</span></ion-label>
                <ion-radio slot="start" value="TECHNICAL"></ion-radio>
              </ion-item>
              <ion-item>
                <ion-label><span>محتوایی</span></ion-label>
                <ion-radio slot="start" value="CONTENT"></ion-radio>
              </ion-item>
            </ion-radio-group>
          </div>
          <div>
            <div :class="[v$.message.$error ? 'input-box-shadow-error' : 'input-box-shadow', 'flex align-items-center']">
              <label class="space-v">متن گزارش</label>
              <ion-textarea
                v-model="message"
                @change="v$.message.$touch"
                placeholder="لطفا مشکلی که با آن روبرو شده اید را دقیق و با جزئیات شرح دهید..."
                rows="7"
              />
            </div>
            <error-displayer :errors="v$.message.$errors" />
          </div>
          <div>
            <ion-button @click="submit" :disabled="v$.$invalid">
              <ion-icon :icon="sendOutline"></ion-icon>
            </ion-button>
          </div>
        </div>
      </ion-card-content>
    </ion-card>

    <ion-fab vertical="bottom" horizontal="start">
      <ion-fab-button @click="goToMyReports">
        <ion-icon :icon="listOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>

  </ion-content>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  sendOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  bugOutline,
  listOutline,
  chevronForwardCircleOutline
} from 'ionicons/icons'
import { ReportService } from '@/services/ReportService';
import { CreateNewReportDTO } from '@/classes/Report/commands/CreateNewReportDTO';
import { toastController, ToastOptions } from '@ionic/vue';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { useVuelidate } from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { Report } from '@/validators';

export default defineComponent({
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    return {
      reportType: { reportType: helpers.withMessage(() => 'نوع گزارش را مشخص کنید.', Report.type) },
      message: { message: helpers.withMessage(() => 'متن گزارش باید بین ۱۰ تا ۴۰۰ کاراکتر باشد.', Report.message)},
    };
  },
  data() {
    return {
      reportType: '',
      message: '',
      reportedEntityId: this.$route.query.reportedEntityId,
      reportedEntityTitle: this.$route.query.reportedEntityTitle,
      sendOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      bugOutline,
      listOutline,
      chevronForwardCircleOutline,
    };
  },
  methods: {
    async submit() {
      if(this.v$.$invalid) return;
      this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
      let options: ToastOptions;
      try {
        const dto = new CreateNewReportDTO({
          reportType: this.reportType,
          message: this.message,
        });
        await ReportService.createNewReport(dto);
        options = {
          message: 'گزارش شما ثبت شد. ممنون.',
          color: 'success',
          icon: checkmarkCircleOutline,
          duration: 4000,
        }
        await this.$router.push({ name: 'MyReports' });
      } catch(err) {
        options = {
          message: err.message,
          color: 'danger',
          icon: closeCircleOutline,
          duration: 4000,
        }
      } finally {
        this.$store.commit(COMMIT_TYPES.APP_WAITING, false);
        const toast = await toastController.create(options);
        toast.present();
      }
    },
    goToMyReports() {
      this.$router.push({ name: 'MyReports' });
    },
  },
})
</script>
