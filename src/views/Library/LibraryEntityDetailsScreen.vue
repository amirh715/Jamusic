<template>
  <ion-header>
    <ion-toolbar>
      <div class="flex justify-content-between align-items-center">
        <ion-icon
          @click="$router.back()"
          :icon="chevronForwardCircleOutline"
          size="large"
          class="space-h"
        ></ion-icon>
        <b>{{entity && entity.title}}</b>
        <ion-icon
          :icon="bugOutline"
          size="small"
          class="space-h"
          @click="$router.push({ name: 'NewReport', query: { reportedEntityId: entityId, reportedEntityTitle: entity.title } })"
        ></ion-icon>
      </div>
    </ion-toolbar>
  </ion-header>
  <ion-content>
  <div style="display: flex; flex-flow: column; height: 100%;">
    <ion-card class="text-right" style="flex: 0 0 auto;">
      <ion-card-content>
        <div class="flex" style="width: 100%;" @click="playIfArtwork">
          <div>
            <ion-skeleton-text
              v-if="imageLoading"
              style="width: 9rem; height: 9rem;"
              animated
            />
            <!-- <div v-else :style="
              {
                backgroundImage: `url(${image})`,
                backgroundSize: 'contain',
                width: '10rem',
                height: '10rem',
              }"></div> -->
            <ion-thumbnail v-else style="width: 10rem; height: 10rem;">
              <img :src="image || 'assets/images/disc.png'" />
            </ion-thumbnail>
          </div>
          <div
            style="width: 100%"
            class="flex flex-column justify-content-center align-items-start space-2">
            <div v-if="entityLoading">
              <ion-skeleton-text
                style="width: 80%; height: 1.5rem;"
                animated
              />
              <ion-skeleton-text
                class="space-2-v"
                style="width: 70%; height: 1rem;"
                animated
              />
              <ion-skeleton-text
                style="width: 50%;"
                animated
              />
            </div>
            <div v-else>
              <text-banner
                :animate="entity && entity.title && entity.title.length > 8"
                animationSpeed="5s">
                <h1 style="white-space: nowrap;">{{entity && entity.title}}</h1>
              </text-banner>
              <library-entity-rate :rate="entity.rate" class="space-v" />
              <p>
                <number-displayer :value="entity.totalPlayedCount" />
                بار گوش داده شده
              </p>
              <duration-displayer
                :durationInSec="entity.duration"
                writeStyle="text"
              />
            </div>
          </div>
        </div>
        <!-- artwork details (rendered if entity is an artwork) -->
        <div v-if="isArtwork">
          <artwork-details :artwork="entity" @addToPlaylist="openAddArtworkToPlaylistModal" @openOptions="openArtworkOptionsModal" />
        </div>
        <!-- artist details (rendered if entity is an artist) -->
        <div v-if="isArtist && entity.instagramId" class="space-v">
          <artist-details :instagramId="entity.instagramId" />
        </div>
      </ion-card-content>
    </ion-card>
    <!-- album tracks list (rendered if entity is an album) -->
    <ion-card v-if="isAlbum">
      <ion-card-content>
        <album-tracks-list :tracks="entity.tracks" />
      </ion-card-content>
    </ion-card>
    <!-- artist artworks list (rendered if entity is an artist) -->
    <ion-card v-if="isArtist" style="flex: 1 1 auto;">
      <ion-card-content style="height: 100%;">
        <artist-artworks-list :artistId="entity.id" />
      </ion-card-content>
    </ion-card>
    <!-- track lyrcis card (rendered if entity is a track and has lyrics) -->
    <ion-card v-if="isTrack && entity.lyrics">
      <ion-card-content>
        <track-lyrics :lyrics="entity.lyrics" />
      </ion-card-content>
    </ion-card>
  </div>
  </ion-content>

  <mini-player />

</template>

<script lang="ts">
import { defineComponent, Prop, PropType } from 'vue'
import { LibraryService } from '@/services/LibraryService'
import LibraryEntityRate from '@/components/Library/LibraryEntityRate.vue';
import { bugOutline } from 'ionicons/icons';
import AlbumTracksList from '@/components/Library/AlbumTracksList.vue';
import ArtistArtworksList from '@/components/Library/ArtistArtworksList.vue';
import TrackLyrics from '@/components/Library/TrackLyrics.vue';
import ArtworkDetails from '@/components/Library/ArtworkDetails.vue';
import { actionSheetController, alertController, modalController, toastController } from '@ionic/vue';
import SelectPlaylistModal from '@/components/Playlist/SelectPlaylistModal.vue';
import { PlaylistDetailsDTO } from '@/classes/Library/query/PlaylistDetailsDTO';
import { chevronForwardCircleOutline, closeCircleOutline } from 'ionicons/icons';
import ArtistDetails from '@/components/Library/ArtistDetails.vue';
import { EditPlaylistDTO } from '@/classes/Library/commands/EditPlaylistDTO';
import { COMMIT_TYPES } from '@/store/COMMIT_TYPES';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';

export default defineComponent({
  components: {
    LibraryEntityRate,
    AlbumTracksList,
    ArtistArtworksList,
    ArtistDetails,
    ArtworkDetails,
    TrackLyrics,
  },
  data() {
    const entityId = this.$route.query.id;
    return {
      image: '',
      imageLoading: true,
      entityId,
      entity: null,
      entityLoading: true,
      bugOutline,
      chevronForwardCircleOutline,
    }
  },
  computed: {
    isAlbum() {
      return this.entity && this.entity.type === 'A';
    },
    isArtist() {
      return this.entity && (this.entity.type === 'B' || this.entity.type === 'S');
    },
    isTrack() {
      return this.entity && this.entity.type === 'T';
    },
    isArtwork() {
      return this.isAlbum || this.isTrack;
    }
  },
  methods: {
    async fetchEntity() {
      try {
        this.entityLoading = true;
        this.entity = await LibraryService.getLibraryEntityById(this.entityId);
      } catch(err) {
        this.$router.back();
        const toast = await toastController.create({
          message: err.message,
          icon: closeCircleOutline,
          color: 'danger',
          duration: 4000,
        });
        await toast.present();
      } finally {
        this.entityLoading = false;
      }
    },
    async fetchImage() {
      try {
        this.imageLoading = true;
        const imageBlob = await LibraryService.getLibraryEntityImageById(this.entityId);
        this.image = URL.createObjectURL(imageBlob);
      } finally {
        this.imageLoading = false;
      }
    },
    async openAddArtworkToPlaylistModal() {
      const modal = await modalController.create({
        component: SelectPlaylistModal,
        componentProps: {
          title: `افزودن ${this.entity.title} به پلی لیست`,
          artworkToAdd: this.entity,
        },
        swipeToClose: true,
      });
      await modal.present();
      const selectedPlaylist: PlaylistDetailsDTO = (await modal.onDidDismiss()).data;
      if(selectedPlaylist) {
        try {
          selectedPlaylist.tracks.push(this.entity);
          const dto = new EditPlaylistDTO({
            id: selectedPlaylist.id,
            title: selectedPlaylist.title,
            trackIds: selectedPlaylist.tracks.map((track) => track.id),
          });
          await LibraryService.editPlaylist(dto);
          this.$store.commit(COMMIT_TYPES.APP_WAITING, true);
        } finally {
          this.$store.commit(COMMIT_TYPES.APP_WAITING, false);
        }
      }
    },
    async openArtworkOptionsModal() {
      const actionSheet = await actionSheetController.create({
        header: this.entity.title,
        buttons: [
          {
            text: 'برو به هنرمند',
            handler: () => {
              this.$router.push({ name: 'LibraryEntityDetails', query: { id: this.entity.artist.id } });
            },
          },
          {
            text: 'بیخیال',
            role: 'cancel',
          },
        ],
      });
      actionSheet.present();
    },
    async playIfArtwork() {
      if(this.isArtwork) {
        this.$store.dispatch(ACTION_TYPES.PLAY, this.entity);
      }
    },
  },
  mounted() {
    this.fetchEntity();
    this.fetchImage();
  },
})
</script>
