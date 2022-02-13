<template>
  <ion-header>
    <ion-toolbar>
      <ion-icon
        :icon="bugOutline"
        size="small"
        @click="$router.push({ name: 'NewReport', query: { reportedEntityId: entityId, reportedEntityTitle: entity.title } })"
      ></ion-icon>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <!-- library entity details -->
    <ion-card class="text-right">
      <ion-card-content>
        <div class="flex flex-column">
          <div class="flex">
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
                <img :src="image || 'assets/icon/icon.png'" />
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
                  :text="entity.title"
                  :animate="entity.title.length > 10"
                  :textStyle="{fontWeight: 'bold', fontSize: '1.4rem'}"
                  animationSpeed="5s"
                />
                <library-entity-rate :rate="entity.rate" class="space-v" />
                <p>
                  بار گوش داده شده
                </p>
                <duration-displayer
                  :durationInSec="entity.duration"
                  style="font-size: 0.9rem"
                />
              </div>
            </div>
          </div>
          <!-- artwork details (rendered if entity is an artwork) -->
          <div v-if="isArtwork">
            <artwork-details :artwork="entity" />
          </div>
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
    <ion-card  v-if="isArtist" style="height: fit-content">
      <ion-card-content>
        <artist-artworks-list :artistId="entity.id" />
      </ion-card-content>
    </ion-card>
    <!-- track player (rendered if entity is a track) -->
    <ion-card v-if="isTrack">
      <ion-card-content>
        <track-player
          :trackId="entity.id"
        />
      </ion-card-content>
    </ion-card>
    <!-- track lyrcis card (rendered if entity is a track and has lyrics) -->
    <ion-card v-if="isTrack && entity.lyrics">
      <ion-card-content>
        <track-lyrics :lyrics="entity.lyrics" />
      </ion-card-content>
    </ion-card>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent, Prop } from 'vue'
import { LibraryService } from '@/services/LibraryService'
import LibraryEntityRate from '@/components/Library/LibraryEntityRate.vue';
import { bugOutline } from 'ionicons/icons';
import AlbumTracksList from '@/components/Library/AlbumTracksList.vue';
import ArtistArtworksList from '@/components/Library/ArtistArtworksList.vue';
import TrackPlayer from '@/components/Library/TrackPlayer.vue';
import TrackLyrics from '@/components/Library/TrackLyrics.vue';
import ArtworkDetails from '@/components/Library/ArtworkDetails.vue';

export default defineComponent({
  components: {
    LibraryEntityRate,
    AlbumTracksList,
    ArtistArtworksList,
    TrackPlayer,
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
        console.log(err);
      } finally {
        this.entityLoading = false;
      }
    },
    async fetchImage() {
      try {
        this.imageLoading = true;
        const imageBlob = await LibraryService.getLibraryEntityImageById(this.entityId);
        this.image = URL.createObjectURL(imageBlob);
      } catch(err) {
        console.log(err);
      } finally {
        this.imageLoading = false;
      }
    },
  },
  mounted() {
    this.fetchEntity();
    this.fetchImage();
  },
})
</script>
