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

const app = createApp(App)
  .use(IonicVue)
  .use(store)
  .use(router);

import TextBanner from '@/components/common/TextBanner.vue';
import BackgroundPlaceholder from '@/components/common/BackgroundPlaceholder.vue';
import NumberDisplayer from '@/components/common/NumberDisplayer.vue';
import DurationDisplayer from '@/components/common/DurationDisplayer.vue';
import DateTimeDisplayer from '@/components/common/DateTimeDisplayer.vue';
import MiniPlayer from '@/components/Library/MiniPlayer.vue';
import ErrorDisplayer from '@/components/common/ErrorDisplayer.vue';

app.component('TextBanner', TextBanner);
app.component('BackgroundPlaceholder', BackgroundPlaceholder);
app.component('NumberDisplayer', NumberDisplayer);
app.component('DurationDisplayer', DurationDisplayer);
app.component('DateTimeDisplayer', DateTimeDisplayer);
app.component('MiniPlayer', MiniPlayer);
app.component('ErrorDisplayer', ErrorDisplayer);

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
  IonRange,
  IonChip,
  IonFab,
  IonFabButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonCheckbox,
  IonPopover,
  IonRadioGroup,
  IonRadio,
  IonLabel,
  IonText,
} from '@ionic/vue';
import {
  Swiper,
  SwiperSlide,
} from 'swiper/vue';
import { PlayerManager } from './services/PlayerManager';
import { LibraryService } from './services/LibraryService';
import { DatabaseManager } from './services/DatabaseManager';
import { PlayedTrackDTO } from './classes/Library/commands/PlayedTrackDTO';
import { TrackDetailsDTO } from './classes/Library/query/TrackDetailsDTO';

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
app.component('Swiper', Swiper);
app.component('SwiperSlide', SwiperSlide);
app.component('IonRange', IonRange);
app.component('IonChip', IonChip);
app.component('IonFab', IonFab);
app.component('IonFabButton', IonFabButton);
app.component('IonSelect', IonSelect);
app.component('IonSelectOption', IonSelectOption);
app.component('IonTextarea', IonTextarea);
app.component('IonCheckbox', IonCheckbox);
app.component('IonPopover', IonPopover);
app.component('IonRadioGroup', IonRadioGroup);
app.component('IonRadio', IonRadio);
app.component('IonLabel', IonLabel);
app.component('IonText', IonText);

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker-dev.js')
    .then((registration) => console.log(registration))
    .catch(err => console.log(err));
  navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then((registration) => console.log(registration))
    .catch(err => console.log(err));
}

(async () => {
  const unsentPlayedTrackRecordsCount = await DatabaseManager.playedTracks.count();
  if(unsentPlayedTrackRecordsCount > 0) {
    const records = await DatabaseManager.playedTracks.toArray();
    for(const record of records) {
      const dto = new PlayedTrackDTO({ trackId: record.trackId, playedAt: record.playedAt });
      await LibraryService.playTrack(dto);
      await DatabaseManager.playedTracks.delete(record.id);
    }
  }
})();

(async () => {
  PlayerManager.addEventListener('trackPlayed', async (ev: CustomEvent) => {
    const playedTrack = ev.detail.playedTrack as TrackDetailsDTO;
    const id = await DatabaseManager.playedTracks.add({
      trackId: playedTrack.id,
      playedAt: new Date(),
    });
    const dto = new PlayedTrackDTO({
      trackId: playedTrack.id,
      playedAt: new Date(),
    });
    await LibraryService.playTrack(dto);
    await DatabaseManager.playedTracks.delete(id);
  });
})();

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { AuthService } from './services/AuthService';

(async () => {
  try {
    const app = initializeApp({
      apiKey: "AIzaSyC39bXdJAlAjLapfKqL3nrKPNzUXkg95xs",
      authDomain: "jamusic-5fd24.firebaseapp.com",
      projectId: "jamusic-5fd24",
      storageBucket: "jamusic-5fd24.appspot.com",
      messagingSenderId: "603123320217",
      appId: "1:603123320217:web:ae3f3c0753e9d59af53f08",
      measurementId: "G-5S74EZ7PD9",    
    });
    const messaging = getMessaging(app);
    const currentToken = await getToken(messaging, {
      vapidKey: 'BORT7Rl_GFJE-IaNyl8nih6FRmRMQUHijKUpbNy1kIkAm1E4khGtobXs4gPhCZarcpThVsaJ9rtOkQfZymc67g0'
    });
    if(currentToken) {
      AuthService.sendFCMToken(currentToken);
    }
    onMessage(messaging, (payload) => {
      if(payload.data) {
        const command = payload.data.COMMAND;
        if(command === 'USER_BLOCKED') localStorage.removeItem('token');
      }
    });
  } catch(err) {
    console.log(err);
  }
})();

router.isReady().then(() => {
  app.mount('#app');
});
