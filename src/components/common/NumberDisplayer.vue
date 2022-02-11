<template>
  <span>
    {{displayValue}}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as _ from 'lodash';

export default defineComponent({
  name: 'number-displayer',
  props: {
    value: String || Number,
  },
  data() {
    return {
      map: [
        '۰',
        '۱',
        '۲',
        '۳',
        '۴',
        '۵',
        '۶',
        '۷',
        '۸',
        '۹',
      ],
    };
  },
  computed: {
    displayValue() {
      if (_.isNil(this.value)) return '-';
      const numberInString = this.value.toString();
      let result = '';
      for (let i = 0; i < numberInString.length; i++) {
        const index = Number.parseInt(numberInString[i], 10);
        result += index === 0 || index ? this.map[index] : numberInString[i];
      }
      return result;
    },
  },
})
</script>
