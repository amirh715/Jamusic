<template>
  <number-displayer :value="displayValue" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import moment from 'moment-jalaali';
import NumberDisplayer from './NumberDisplayer.vue';

export default defineComponent({
  components: { NumberDisplayer },
  name: 'date-time-displayer',
  props: {
    value: Date,
    format: String,
  },
  computed: {
    displayValue() {
      const format = this.format || ' HH:mm:ss jYYYY/jM/jD';
      return moment(this.value).format(format);
    },
  },
})
</script>
