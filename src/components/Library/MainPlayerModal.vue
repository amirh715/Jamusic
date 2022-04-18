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
      class="flex flex-column align-items-center"
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
            @click="goToAlbum"
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
        <ion-skeleton-text v-if="imageLoading" />
        <img v-else :src="image ? toObjectURL(image) : 'assets/images/disc.png'" />
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
          :color="$store.state.player.shuffle ? 'primary' : ''"
          :icon="shuffleOutline"
          style="font-size: 2.5rem;"
          ></ion-icon>
        <div class="text-center" style="width: 60%;">
          <text-banner :animate="currentTrack && currentTrack.title.length > 9" animationSpeed="7s">
            <span style="font-size: 1.9rem; white-space: nowrap; font-weight: bold;">{{currentTrack.title || ''}}</span><br/>
          </text-banner>
          <span>{{currentTrack && currentTrack.artist.title}}</span>
        </div>
        <ion-icon
          @click="toggleRepeat"
          :color="$store.state.player.repeat ? 'primary' : ''"
          :icon="repeatOutline"
          style="font-size: 2.5rem;"
          ></ion-icon>
      </div>
    
      <div class="flex justify-content-between align-items-center" style="width: 80%;">
        <ion-range ref="range"
          :value="currentSeekPosition"
          @ionKnobMoveEnd="seekPositionChanged"
          min="0" max="100">
            <ion-label slot="end" style="min-width: 50px;">
              <duration-displayer style="font-size: 1.4rem;" :durationInSec="currentDuration" />
            </ion-label>
            <ion-label slot="start" style="min-width: 50px;">
              <duration-displayer style="font-size: 1.4rem;" :durationInSec="totalDuration" />
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
import { LibraryService } from '@/services/LibraryService';
import { PlayerManager } from '@/services/PlayerManager';

export default defineComponent({
  name: 'main-player-modal',
  components: {
    LibraryEntityRate,
  },
  data() {
    return {
      image: null,
      imageLoading: false,
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
    currentSeekPosition() {
      return (this.currentDuration * 100) / this.totalDuration;
    },
    playOrPauseIcon() {
      return this.$store.state.player.isPlaying ? pauseCircleOutline : playCircleOutline;
    },
    canSkipBack() {
      const indexOfThisTrackInQueue = this.$store.state.player.currentQueueIndex;
      const canReplayCurrentTrack = this.$store.state.player.currentDuration > 6;
      return indexOfThisTrackInQueue !== 0 || canReplayCurrentTrack;
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
    async seekPositionChanged(ev: CustomEvent) {
      await this.$store.dispatch(ACTION_TYPES.SEEK, ev.detail.value);
    },
    async addToPlaylist() {
      const modal = await modalController.create({
        component: SelectPlaylistModal,
        componentProps: {
          title: `افزودن ${this.currentTrack.title} به پلی لیست`,
          artworkToAdd: this.currentTrack,
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
    goToAlbum() {
      this.$router.push({ name: 'LibraryEntityDetails', query: { id: this.currentTrack.album.id } });
      this.closeModal();
    },
    async getImage() {
      this.imageLoading = true;
      try {
        this.image = await LibraryService.getLibraryEntityImageById(this.currentTrack.id);
      } catch(err) {
        this.image = null;
      } finally {
        this.imageLoading = false;
      }
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
    toObjectURL(blob: Blob) {
      return URL.createObjectURL(blob);
    },
  },
  mounted() {
    this.getImage();
    PlayerManager.addEventListener('trackChanged', () => {
      this.getImage();
    });
  },
})
</script>
