<template>
  <number-displayer
    :value="displayValue"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as _ from 'lodash'

export default defineComponent({
  name: 'duration-displayer',
  props: {
    durationInSec: Number,
  },
  computed: {
    displayValue() {
      const hour = "ساعت";
      const minute = "دقیقه";
      const sec = "ثانیه";
      let hourPart = '';
      let minPart = '';
      let secPart = '';
      if(this.durationInSec < 60) {
        secPart = `${this.durationInSec} ${sec}`;
      } else if(this.durationInSec < 3600) {
        minPart = `${_.floor((this.durationInSec / 60)).toString()} ${minute}`;
      } else if(this.durationInSec < 86400) {
        hourPart = `${_.floor((this.durationInSec / 3600)).toString()} ${hour} و`;
        minPart = `${(this.durationInSec % 3600).toString()} ${minute}`;
      } else {
        return 'N/A';
      }
      return `${hourPart} ${minPart} ${secPart}`;
    },
  },
})
</script>
