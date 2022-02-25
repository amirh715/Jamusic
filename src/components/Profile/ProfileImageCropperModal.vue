<template>
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon
          :icon="chevronDownCircleOutline"
          @click="closeModal"
          size="large"
          class="space-h"></ion-icon>
          <b>عکس پروفایل</b>
        <ion-icon
          :icon="chevronDownCircleOutline"
          size="large"
          class="space-h"
          style="opacity: 0"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div class="flex flex-column justify-content-center align-items-center" style="width: 100%; height: 100%;">
      <cropper
        class="cropper"
        :src="imageDataURL"
        :stencil-props="stencilProps"
        :stencil-size="stencilSize"
        :imageRestriction="imageRestriction"
        @change="change"
      />
      <ion-button @click="closeModal" :disabled="!result" class="space-2-v">
        <b class="space-2-h">برو</b>
      </ion-button>
    </div>
  </ion-content>

</template>

<style scoped>
.cropper {
  height: 22rem;
  width: 22rem;
  border: 1px solid black;
  border-radius: 4px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  chevronDownCircleOutline,
} from 'ionicons/icons';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { modalController } from '@ionic/vue';

export default defineComponent({
  name: 'profile-image-cropper',
  components: {
    Cropper,
  },
  emits: ['change', 'selected'],
  props: {
    image: File,
    stencilProps: Object,
    stencilSize: Object,
    imageRestriction: String,
  },
  data() {
    return {
      result: null,
      chevronDownCircleOutline,
    };
  },
  computed: {
    imageDataURL() {
      return URL.createObjectURL(this.image);
    }
  },
  methods: {
    change(event: any) {
      const canvas = event.canvas;
      this.result = canvas.toDataURL();
      this.$emit('change', this.result);
    },
    selected() {
      if(this.result) this.$emit('selected', this.result);
    },
    closeModal() {
      const response = { image: this.result };
      modalController.dismiss(response);
    },
  },
})
</script>
