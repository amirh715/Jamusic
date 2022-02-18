<template>
  
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="goBack" :icon="chevronForwardCircleOutline" size="large" class="space-h"></ion-icon>
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
          <div class="flex justify-content-center align-items-center space-v">
            <ion-label class="space-h">نوع گزارش</ion-label>
            <ion-select
              v-model="reportType"
              cancel-text="بیخیال"
              ok-text="برو"
              title="نوع گزارش"
              style="width: 8rem">
                <ion-select-option value="TECHNICAL">
                  <span>فنی</span>
                </ion-select-option>
                <ion-select-option value="CONTENT">
                  <span>محتوایی</span>
                </ion-select-option>
            </ion-select>
          </div>
          <label class="space-v">متن گزارش</label>
          <ion-textarea
            v-model="message"
            placeholder="لطفا مشکلی که با آن روبرو شده اید را دقیق و با جزئیات شرح دهید..."
            rows="7"
          />
          <div>
            <ion-button @click="submit">
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

export default defineComponent({
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
    goBack() {
      this.$router.push({ name: 'ProfileInfo' });
    },
  },
})
</script>
