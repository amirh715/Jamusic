<template>
  <number-displayer
    :value="displayValue"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { floor } from 'lodash'

export default defineComponent({
  name: 'duration-displayer',
  props: {
    durationInSec: Number,
    writeStyle: Object as PropType<'clock' | 'text'>,
  },
  computed: {
    displayValue() {
      let hour = 0;
      let min = 0;
      let sec = 0;
      let hourPart = '';
      let minPart = '';
      let secPart = '';
      
      if(this.durationInSec < 60) {
        sec = floor(this.durationInSec);
      } else if(this.durationInSec < 3600) {
        min = floor(this.durationInSec / 60);
        sec = floor(this.durationInSec % 60);
      } else if(this.durationInSec < 86400) {
        hour = floor(this.durationInSec / 3600);
        min = floor(this.durationInSec % 3600);
        sec = floor(this.min % 3600);
      } else {
        return '--‌ : --';
      }

      switch(this.writeStyle) {
        case 'clock':
          if(hour > 0) hourPart = hour < 10 ? `0${hour}:` : `${hour}:`;
          minPart = min < 10 ? `0${min}:` : `${min}:`;
          secPart = sec < 10 ? `0${sec}` : `${sec}`;
          break;
        case 'text':
          if(hour > 0) {
            hourPart = `${hour} ساعت ${min > 0 && ' و '}`;
          }
          if(min > 0) {
            minPart = `${min} دقیقه ${sec > 0 && ' و '}`;
          }
          if(sec > 0) {
            secPart = `${sec} ثانیه`;
          }
          break;
        default:
          if(hour > 0) hourPart = hour < 10 ? `0${hour}:` : `${hour}:`;
          minPart = min < 10 ? `0${min}:` : `${min}:`;
          secPart = sec < 10 ? `0${sec}` : `${sec}`;
      }
      return `${hourPart}${minPart}${secPart}`;
    },
  },
})
</script>
