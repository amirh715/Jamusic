<template>
  
  <ion-content>

    <ion-toolbar>
      <b>گزارش های من</b>
    </ion-toolbar>

    <div v-if="isLoading">
      <ion-card v-for="i in 4" :key="i">
        <ion-card-content>
          <div>
            <div class="flex flex-column" style="width: 100%;">
              <ion-skeleton-text animated style="width: 35%; height: 1.5rem;"/>
              <ion-skeleton-text animated style="width: 100%; height: 1rem;"/>
              <ion-skeleton-text animated style="width: 100%; height: 1rem;"/>
              <ion-skeleton-text animated style="width: 100%; height: 1rem;"/>
            </div>
            <ion-skeleton-text animated style="width: 50%; height: 1rem;" />
          </div>
        </ion-card-content>
      </ion-card>
    </div>
    <report-list-item
      v-else
      v-for="item in myReports"
      :key="item.id"
      :report="item"
    />

  </ion-content>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReportListItem from '@/components/Report/ReportListItem.vue';
import { ReportService } from '@/services/ReportService';
import { toastController } from '@ionic/vue';
import { closeCircleOutline } from 'ionicons/icons';

export default defineComponent({
  components: {
    ReportListItem,
  },
  data() {
    return {
      myReports: [],
      isLoading: true,
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      this.myReports = await ReportService.getAllOfMyReports();
    } catch(err) {
      const toast = toastController.create({
        message: err.response.data.message,
        color: 'danger',
        icon: closeCircleOutline,
        duration: 4000,
      });
      (await toast).present();
    } finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }
  },
})
</script>
