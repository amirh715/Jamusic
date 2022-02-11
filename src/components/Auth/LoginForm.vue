<template>
  <div>
    <ion-card>
      <ion-card-header class="text-center">
        <h3>ورود</h3>
      </ion-card-header>
      <ion-card-content>
        <div>
          <ion-item>
            <ion-input
              type="tel"
              v-model="mobile"
            ></ion-input>
            <ion-label>موبایل</ion-label>
          </ion-item>
          <ion-item>
            <ion-input
              type="password"
              v-model="password"
            ></ion-input>
            <ion-label>رمز</ion-label>
          </ion-item>
          <ion-button :disabled="true">
            برو
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
    <ion-router-link to="/fuck">
      رمزم رو فراموش کردم
    </ion-router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'login-form',
  emits: ['submit'],
  data() {
    return {
      mobile: '',
      password: '',
    };
  },
})
</script>
