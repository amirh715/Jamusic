<template>
  <ion-card>
    <ion-card-content>
      <div class="flex flex-column justify-content-between">
        <p style="line-height: 1.8rem">
          <b>متن گزارش:</b><br/>
          {{report.message}}
        </p>
        <div class="flex justify-content-between align-items-center">
          <ion-chip :color="reportStatusColor">
            <ion-icon :icon="reportStatusIcon" :color="reportStatusColor"></ion-icon>
            <ion-label><b>{{reportStatusDisplayValue}}</b></ion-label>
          </ion-chip>
          <p style="width: 50%">
            تاریخ گزارش:‌ <date-time-displayer :value="report.createdAt" format="jYYYY/jMM/jDD" />
          </p>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ReportDetails } from '@/classes/Report/query/ReportDetails'
import {
  checkmarkOutline,
  checkmarkDoneOutline,
  informationCircleOutline,
  hourglassOutline,
} from 'ionicons/icons'

export default defineComponent({
  name: 'report-list-item',
  props: {
    report: ReportDetails,
    loading: Boolean,
  },
  computed: {
    reportStatusDisplayValue() {
      if(this.report) {
        if(this.report.status === 'PENDING_ASSIGNMENT')
          return 'ثبت شده';
        if(this.report.status === 'ASSIGNED')
          return 'در انتظار پردازش';
        if(this.report.status === 'PROCESSED')
          return 'پردازش شده';
      }
      return 'منتظر باشید...';
    },
    reportStatusIcon() {
      if(this.report) {
        if(this.report.status === 'PENDING_ASSIGNMENT')
          return informationCircleOutline;
        if(this.report.status === 'ASSIGNED')
          return checkmarkOutline;
        if(this.report.status === '')
          return checkmarkDoneOutline;
      }
      return hourglassOutline;
    },
    reportStatusColor() {
      if(this.report) {
        if(this.report.status === 'PENDING_ASSIGNMENT')
          return 'warning';
        if(this.report.status === 'ASSIGNED')
          return 'warning';
        if(this.report.status === 'PROCESSED')
          return 'success';
      }
      return 'warning';
    },
  },
})
</script>
