<template>
  <ion-content>
    <swiper
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :grabCursor="true"
      dir="rtl"
      style="height: 100vh;"
    >
      <swiper-slide>
        <div>
          <h1>Slide 1</h1>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <h1>Slide 2</h1>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <h1>Slide 3</h1>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <h1>Slide 4</h1>
        </div>
      </swiper-slide>
    </swiper>
  </ion-content>
</template>

<script lang="ts">
import { Swiper } from 'swiper/types';
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const swiper = ref(null);
    const onSwiper = (instance: Swiper) => {
      swiper.value = instance;
    };
    return {
      onSwiper,
      swiper,
    }
  },
  methods: {
    onSlideChange() {
      console.log();
    },
  },
})
</script>
