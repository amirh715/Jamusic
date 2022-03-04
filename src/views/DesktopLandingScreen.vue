<template>
  <div style="width: 100vw; height: 100vh;">
    
    <div class="flex flex-column">
      
      <div style="border-top: 5px solid #ffd700; z-index: 1000;"></div>

      <div id="landing-background">

        <div class="flex flex-column">

          <p style="font-size: 5rem; font-weight: bold; margin-right: 18rem;">اَپلیکیشن جَم</p>
          
          <p style="width: 50%; font-size: 1.5rem; margin-right: 21rem">
            اَپلیکیشن جَم یک سرویس آزمایشی موزیک آنلاین است که امکان دسترسی به هزاران آهنگ از صد ها هنرمند و ده ها سبک مختلف را فراهم می کند.
          </p>

          <div class="flex" style="margin-right: 21rem;">
            <ion-card color="warning">
              <ion-card-content>
                <div class="flex align-items-center">
                  <ion-icon size="large" :icon="alertCircleOutline"></ion-icon>
                  <b class="space-h">لطفا برای استفاده از این سرویس همین آدرس را با گوشی موبایل خود باز کنید. اَپلیکیشن جَم تنها از طریق مرورگر های موبایل قابل استفاده است.</b>
                </div>
              </ion-card-content>
            </ion-card>
          </div>

        </div>

      </div>
    
    </div>

  </div>
</template>

<style lang="scss" scoped>

#landing-background {
  width: 100%;
  height: 100%;
  color: whitesmoke;
  position: absolute;
  background-size: cover;
  background-image: url("../../public/assets/images/dark_street_background.jpg");
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import { alertCircleOutline } from 'ionicons/icons';

export default defineComponent({
  data() {
    return {
      alertCircleOutline,
    };
  },
})
</script>
