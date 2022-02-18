<template>
  
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="goBack" :icon="chevronForwardCircleOutline" class="space-h" size="large"></ion-icon>
        <b>گزارش های من</b>
        <ion-icon :icon="chevronForwardCircleOutline" style="opacity: 0;" class="space-h" size="large"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>

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
import { closeCircleOutline, chevronForwardCircleOutline } from 'ionicons/icons';

export default defineComponent({
  components: {
    ReportListItem,
  },
  data() {
    return {
      myReports: [],
      isLoading: true,
      chevronForwardCircleOutline,
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'ProfileInfo' });
    },
  },
  async mounted() {
    this.isLoading = true;
    try {
      this.myReports = await ReportService.getAllOfMyReports();
    } catch(err) {
      const toast = toastController.create({
        message: err.message,
        color: 'danger',
        icon: closeCircleOutline,
        duration: 4000,
      });
      (await toast).present();
      this.$router.push({ name: 'Profile' });
    } finally {
      this.isLoading = false;
    }
  },
})
</script>
