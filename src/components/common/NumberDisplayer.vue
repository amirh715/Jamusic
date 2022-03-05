<template>
  <span>
    {{displayValue}}
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { isNil } from 'lodash';

export default defineComponent({
  name: 'number-displayer',
  props: ['value'],
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
      if (isNil(this.value)) return '-';
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
