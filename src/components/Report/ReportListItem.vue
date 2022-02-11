<template>
  <div class="flex justify-content-between">
    Report
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ReportDetails } from '@/classes/Report/query/ReportDetails'

export default defineComponent({
  name: 'report-list-item',
  props: {
    report: ReportDetails,
  }
})
</script>
