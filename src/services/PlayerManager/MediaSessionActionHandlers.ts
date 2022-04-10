import store from '@/store';
import { ACTION_TYPES } from '@/store/ACTION_TYPES';

class MediaSessionActionHandlers {
  static async onPlay() {
    await store.dispatch(ACTION_TYPES.RESUME);
    navigator.mediaSession.playbackState = 'playing';
  }

  static async onPause() {
    store.dispatch(ACTION_TYPES.PAUSE);
    navigator.mediaSession.playbackState = 'paused';
  }

  static onStop() {
    store.dispatch(ACTION_TYPES.STOP);
    navigator.mediaSession.playbackState = 'paused';
  }

  static onSeek(args: { seekTime: number, fastSeek: boolean }) {
    store.dispatch(ACTION_TYPES.SEEK, args.seekTime);
  }

  static onPrevTrack() {
    store.dispatch(ACTION_TYPES.SKIP_BACK);
  }

  static onNextTrack() {
    store.dispatch(ACTION_TYPES.SKIP_FORWARD);
  }
}

export {
  MediaSessionActionHandlers,
}
