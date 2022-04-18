import { floor, random } from 'lodash';
import { Howl } from 'howler';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';
import { Timer } from '@/utils/Timer';
import { MediaSessionActionHandlers } from './MediaSessionActionHandlers';

class PlayerManager extends EventTarget {

  private howler: Howl;
  private soundId: number;
  private currentTrack: TrackDetailsDTO;
  private repeatOn: boolean;
  private shuffleOn: boolean;
  private queue: TrackDetailsDTO[];
  private currentQueueIndex: number;
  private durationPlayed: Timer;
  private timerId: number;

  public constructor() {
    super();
    this.queue = [];
    this.currentQueueIndex = 0;
  }

  private static initHowl(): Howl {
    return null;
  }

  public async play(): Promise<void> {
    this.currentTrack = this.queue[this.currentQueueIndex];
    if(this.howler) {
      this.howler.stop();
      this.howler = null;
    }
    
    navigator.mediaSession.setActionHandler('play', MediaSessionActionHandlers.onPlay);
    navigator.mediaSession.setActionHandler('pause', MediaSessionActionHandlers.onPause);
    navigator.mediaSession.setActionHandler('stop', MediaSessionActionHandlers.onStop);
    // navigator.mediaSession.setActionHandler('seekto', MediaSessionActionHandlers.onSeek);
    navigator.mediaSession.setActionHandler('previoustrack', MediaSessionActionHandlers.onPrevTrack);
    navigator.mediaSession.setActionHandler('nexttrack', MediaSessionActionHandlers.onNextTrack);
    navigator.mediaSession.metadata = new MediaMetadata({
      title: this.currentTrack.title,
      artist: this.currentTrack.artist.title,
      album: (this.currentTrack.album && this.currentTrack.album.title) || '',
      artwork: [{ src: 'assets/images/disc.png' }],
    });

    this.howler = new Howl({
      src: `https://api.jamusicapp.ir/v1/library/audio/${this.currentTrack.id}`,
      format: ['mp3'],
      html5: true,
      onload: () => {
        this.durationPlayed = new Timer();
        this.timerId = setInterval(() => {
          if(this.durationPlayed.getDuration() === 7) {
            this.dispatchEvent(
              new CustomEvent(
                'trackPlayed', {
                  detail: {
                    playedTrack: this.currentTrack,
                  }
              })
            );
            clearInterval(this.timerId);
          }
        }, 1000, []);
      },
      onplay: () => {
        this.durationPlayed.start();
        this.dispatchEvent(new CustomEvent('play'));
      },
      onpause: () => {
        this.durationPlayed.stop();
      },
      onstop: () => {
        this.durationPlayed.stop();
      },
      onend: () => {
        this.durationPlayed.reset();
        this.dispatchEvent(new CustomEvent('end'));
        if(this.isRepeatOn()) {
          this.play();
          return;
        }
        if(this.isShuffleOn()) {
          this.currentQueueIndex = random(0, this.queue.length - 1);
          this.currentTrack = this.queue[this.currentQueueIndex];
          this.play();
          return;
        }
        if(this.currentQueueIndex + 1 < this.queue.length) {
          this.skipForward();
          this.play();
        }
      },
    });
    
    this.soundId = this.howler.play();
    return Promise.resolve();

  }

  public resume(): void {
    this.soundId = this.howler.play();
  }

  public pause(): void {
    this.howler.pause(this.soundId);
  }

  public stop(): void {
    this.howler.stop(this.soundId);
  }

  public seek(duration: number): void {
    this.howler.seek(duration, this.soundId);
  }

  public skipForward(): void {
    if(this.currentQueueIndex + 1 > this.queue.length) return;
    this.currentQueueIndex++;
    this.currentTrack = this.queue[this.currentQueueIndex];
    this.dispatchEvent(new CustomEvent('skipForward'));
    this.dispatchEvent(new CustomEvent('trackChanged'));
  }

  public skipBack(): void {
    if(this.currentQueueIndex < 1) return;
    this.currentQueueIndex--;
    this.currentTrack = this.queue[this.currentQueueIndex];
    this.dispatchEvent(new CustomEvent('skipBack'));
    this.dispatchEvent(new CustomEvent('trackChanged'));
  }

  public mute(): void {
    this.howler.mute(true, this.soundId);
  }

  public unmute(): void {
    this.howler.mute(false, this.soundId);
  }

  public shuffle(shuffleOn: boolean): void {
    this.shuffleOn = shuffleOn;
  }

  public repeat(repeatOn: boolean): void {
    this.repeatOn = repeatOn;
  }

  public setVolume(volume: number): void {
    this.howler.volume(volume, this.soundId);
  }

  public addToQueue(trackToAdd: TrackDetailsDTO): void {
    if(!trackToAdd) return;
    const index = this.queue.length;
    this.queue[index] = trackToAdd;
    this.currentTrack = this.queue[index];
  }

  public fillInQueue(tracks: TrackDetailsDTO[]): void {
    if(tracks.length > 0) {
      this.queue = tracks;
      this.currentTrack = this.queue[0];
      this.currentQueueIndex = 0;
    }
  }

  public clearQueue(): void {
    this.queue = [];
    this.currentTrack = null;
    this.currentQueueIndex = 0;
  }

  public getCurrentTrack(): TrackDetailsDTO {
    return this.currentTrack;
  }

  public getCurrentDuration(): number {
    return floor(this.howler.seek()) || 0;
  }

  public getTotalDuration(): number {
    // return floor(this.howler.duration()) || 0;
    return this.currentTrack.duration;
  }

  public getPlayQueue(): TrackDetailsDTO[] {
    return this.queue;
  }

  public getCurrentPlayQueueIndex(): number {
    return this.currentQueueIndex;
  }

  public isQueueEmpty(): boolean {
    return this.queue.length === 0;
  }

  public isOnMute(): boolean {
    return this.howler.mute();
  }

  public isStopped(): boolean {
    return this.getCurrentDuration() === 0;
  }

  public isPlaying(): boolean {
    return this.howler.playing();
  }

  public isPaused(): boolean {
    return !this.howler.playing();
  }

  public isShuffleOn(): boolean {
    return this.shuffleOn;
  }

  public isRepeatOn(): boolean {
    return this.repeatOn;
  }

}

const INSTANCE = new PlayerManager();

export {
  INSTANCE as PlayerManager,
}
