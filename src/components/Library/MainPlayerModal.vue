<template>
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon @click="closeModal" :icon="chevronDownCircleOutline" size="large" class="space-h"></ion-icon>
        <b>{{currentTrack.title || ''}}</b>
        <ion-icon :icon="chevronDownCircleOutline" size="large" class="space-h" style="opacity: 0;"></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div
      class="flex flex-column justify-content-center align-items-center"
      :style="{
        minHeight: '100%',
      }"
    >

        <div class="flex justify-content-between align-items-center space-v" style="width: 80%;">
          <ion-icon id="morePopoverTrigger" size="large" :icon="ellipsisHorizontalCircle"></ion-icon>
        </div>
        <ion-popover trigger="morePopoverTrigger" dismiss-on-select>
          <ion-list>
            <ion-item
              v-if="$store.state.player.currentTrack.artist"
              @click="goToArtist"
            >
              <ion-icon :icon="personOutline"></ion-icon>
              <span class="space-h">برو به هنرمند</span>
            </ion-item>
            <ion-item
              v-if="$store.state.player.currentTrack.album"
              @click="$router.push({ name: 'LibraryEntityDetails', query: { id: $store.state.player.currentTrack.album.id } })"
              >
                <ion-icon :icon="discOutline"></ion-icon>
                <span class="space-h">برو به آلبوم</span>
            </ion-item>
            <ion-item
              @click="goToNewReport"
            >
              <ion-icon :icon="bugOutline"></ion-icon>
              <span class="space-h">گزارش اشکال</span>
            </ion-item>
          </ion-list>
        </ion-popover>
      
        <ion-thumbnail style="width: 20rem; height: 20rem; margin-bottom: 2rem;">
          <img src="assets/images/DiscPlaceholder.png" />
        </ion-thumbnail>

        <div class="flex justify-content-center align-items-center space-2-v" style="width: 80%;">
          <library-entity-rate :rate="currentTrack.rate" size="1.5rem" />
        </div>

        <div class="flex justify-content-between align-items-center" style="width: 80%;">
          <ion-icon @click="addToPlaylist" style="font-size: 2.5rem;" :icon="addCircleOutline"></ion-icon>
          <ion-icon @click="showLyrics" :style="{'font-size': '2.5rem', opacity: currentTrack.lyrics ? '1' : '0'}" :icon="documentTextOutline"></ion-icon>
        </div>
        
        <div class="flex justify-content-between align-items-center" style="width: 80%;">
          <ion-icon
           @click="toggleShuffle"
           :color="$store.state.player.shuffle && 'primary'"
           :icon="shuffleOutline"
           style="font-size: 2.5rem;"
           ></ion-icon>
          <div class="text-center">
            <span style="font-size: 2.5rem;">{{currentTrack.title || ''}}</span><br/>
            <span>{{currentTrack && currentTrack.artist.title}}</span>
          </div>
          <ion-icon
            @click="toggleRepeat"
            :color="$store.state.player.repeat && 'primary'"
            :icon="repeatOutline"
            style="font-size: 2.5rem;"
            ></ion-icon>
        </div>
      
        <div class="flex justify-content-between align-items-center" style="width: 80%;">
          <ion-range :value="currentSeekPosition" @ionChange="seekPositionChanged" min="0" max="100">
            <ion-label slot="end" style="min-width: 50px;">
              <duration-displayer :durationInSec="currentDuration" />
            </ion-label>
            <ion-label slot="start" style="min-width: 50px;">
              <duration-displayer :durationInSec="totalDuration" />
            </ion-label>
          </ion-range>
        </div>

        <div class="flex justify-content-center align-items-center">
          <ion-icon
            @click="skipForward"
            :icon="playSkipForwardOutline"
            :style="{
              fontSize: '2.5rem',
              opacity: canSkipForward ? '1' : '0.4'
            }"></ion-icon>
          <ion-icon @click="playOrPause" style="font-size: 6rem;" :icon="playOrPauseIcon"></ion-icon>
          <ion-icon
            @click="skipBack"
            :icon="playSkipBackOutline"
            :style="{
              fontSize: '2.5rem',
              opacity: canSkipBack ? '1' : '0.4'
            }"></ion-icon>
        </div>

        <div v-if="currentTrack.lyrics" ref="lyrics" style="width: 80%;">
          <p>{{currentTrack.lyrics}}</p>
        </div>
    
    </div>
  </ion-content>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  chevronDownCircleOutline,
  playCircleOutline,
  pauseCircleOutline,
  playSkipForwardOutline,
  playSkipBackOutline,
  repeatOutline,
  shuffleOutline,
  documentTextOutline,
  addCircleOutline,
  ellipsisHorizontalCircle,
  personOutline,
  bugOutline,
  discOutline,
} from 'ionicons/icons';
import { modalController } from '@ionic/vue';
import SelectPlaylistModal from '@/components/Playlist/SelectPlaylistModal.vue';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';
import LibraryEntityRate from '@/components/Library/LibraryEntityRate.vue';

export default defineComponent({
  name: 'main-player-modal',
  components: {
    LibraryEntityRate,
  },
  data() {
    return {
      chevronDownCircleOutline,
      playSkipForwardOutline,
      playSkipBackOutline,
      repeatOutline,
      shuffleOutline,
      documentTextOutline,
      addCircleOutline,
      ellipsisHorizontalCircle,
      personOutline,
      bugOutline,
      discOutline,
    }
  },
  computed: {
    currentTrack() {
      return this.$store.state.player.currentTrack || '';
    },
    currentDuration() {
      return this.$store.state.player.currentDuration;
    },
    totalDuration() {
      return this.$store.state.player.totalDuration;
    },
    playOrPauseIcon() {
      return this.$store.state.player.isPlaying ? pauseCircleOutline : playCircleOutline;
    },
    canSkipBack() {
      const indexOfThisTrackInQueue = this.$store.state.player.currentQueueIndex;
      return indexOfThisTrackInQueue !== 0;
    },
    canSkipForward() {
      const indexOfThisTrackInQueue = this.$store.state.player.currentQueueIndex;
      const queueLength = this.$store.state.player.queue.length;
      return indexOfThisTrackInQueue + 1 !== queueLength;
    },
  },
  methods: {
    async playOrPause() {
      if(this.$store.state.player.isPlaying) {
        await this.$store.dispatch(ACTION_TYPES.PAUSE);
      } else {
        await this.$store.dispatch(ACTION_TYPES.RESUME);
      }
    },
    async skipForward() {
      if(!this.canSkipForward) return;
      await this.$store.dispatch(ACTION_TYPES.SKIP_FORWARD);
    },
    async skipBack() {
      if(!this.canSkipBack) return;
      await this.$store.dispatch(ACTION_TYPES.SKIP_BACK);
    },
    seekPositionChanged(ev: CustomEvent) {
      this.$store.dispatch(ACTION_TYPES.SEEK, ev.detail.value);
    },
    async addToPlaylist() {
      const modal = await modalController.create({
        component: SelectPlaylistModal,
        componentProps: {
          title: `افزودن ${this.currentTrack.title} به پلی لیست`,
          trackToAdd: this.entity,
        },
        swipeToClose: true,
      });
      await modal.present();
    },
    toggleShuffle() {
      const currentShuffleOnState = this.$store.state.player.shuffle;
      this.$store.dispatch(ACTION_TYPES.CHANGE_SHUFFLE, !currentShuffleOnState);
    },
    toggleRepeat() {
      const currentRepeatOnState = this.$store.state.player.repeat;
      this.$store.dispatch(ACTION_TYPES.CHANGE_REPEAT, !currentRepeatOnState);
    },
    showLyrics() {
      if(this.currentTrack.lyrics) {
        this.$refs.lyrics.scrollIntoView({ behavior: 'smooth' });
      }
    },
    closeModal() {
      modalController.dismiss();
    },
    goToArtist() {
      this.closeModal();
      this.$router.push({
        name: 'LibraryEntityDetails',
        query: { id: this.$store.state.player.currentTrack.artist.id } 
      });
    },
    async goToNewReport() {
      this.closeModal();
      this.$router.push({
        name: 'NewReport',
        query: {
          reportedEntityId: this.currentTrack.id,
          reportedEntityTitle: this.currentTrack.title,
        }
      });
    },
  },
})
</script>
