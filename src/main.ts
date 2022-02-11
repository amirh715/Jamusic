import { createApp } from 'vue'
import App from './App.vue'
import store from './store';
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

// Global styles
import './theme/style.css';

process.env.baseApiURL = 'http://localhost:4567/api/v1';

const app = createApp(App)
  .use(IonicVue)
  .use(store)
  .use(router);

import TextBanner from '@/components/common/TextBanner.vue';
import BackgroundPlaceholder from '@/components/common/BackgroundPlaceholder.vue';
import NumberDisplayer from '@/components/common/NumberDisplayer.vue';
import DurationDisplayer from '@/components/common/DurationDisplayer.vue';

app.component('TextBanner', TextBanner);
app.component('BackgroundPlaceholder', BackgroundPlaceholder);
app.component('NumberDisplayer', NumberDisplayer);
app.component('DurationDisplayer', DurationDisplayer);

import {
  IonIcon,
  IonFooter,
  IonToolbar,
  IonHeader,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonBackButton,
  IonButtons,
  IonSearchbar,
  IonList,
  IonListHeader,
  IonLoading,
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonThumbnail,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSlides,
  IonSlide,
  IonToast,
  IonInput,
  IonButton,
} from '@ionic/vue';

app.component('IonIcon', IonIcon);
app.component('IonFooter', IonFooter);
app.component('IonToolbar', IonToolbar);
app.component('IonHeader', IonHeader);
app.component('IonContent', IonContent);
app.component('IonCard', IonCard);
app.component('IonCardHeader', IonCardHeader);
app.component('IonCardContent', IonCardContent);
app.component('IonCardSubtitle', IonCardSubtitle);
app.component('IonBackButton', IonBackButton);
app.component('IonButtons', IonButtons);
app.component('IonSearchbar', IonSearchbar);
app.component('IonList', IonList);
app.component('IonListHeader', IonListHeader);
app.component('IonLoading', IonLoading);
app.component('IonItem', IonItem);
app.component('IonAvatar', IonAvatar);
app.component('IonSkeletonText', IonSkeletonText);
app.component('IonThumbnail', IonThumbnail);
app.component('IonInfiniteScroll', IonInfiniteScroll);
app.component('IonInfiniteScrollContent', IonInfiniteScrollContent);
app.component('IonSlides', IonSlides);
app.component('IonSlide', IonSlide);
app.component('IonToast', IonToast);
app.component('IonInput', IonInput);
app.component('IonButton', IonButton);

router.isReady().then(() => {
  app.mount('#app');
});