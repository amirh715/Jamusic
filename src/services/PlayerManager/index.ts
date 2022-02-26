import * as _ from 'lodash';
import { Howl } from 'howler';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';
import { LibraryService } from '../LibraryService';
import { Timer } from '@/utils/Timer';

class PlayerManager extends EventTarget {

  private howler: Howl;
  private soundId: number;
  private currentTrack: TrackDetailsDTO;
  private repeatOn: boolean;
  private shuffleOn: boolean;
  private stopped: boolean;
  private queue: TrackDetailsDTO[];
  private currentQueueIndex: number;
  private currentDuration: number;
  private totalDuration: number;
  private durationPlayed: Timer;
  private timerId: number;

  public constructor() {
    super();
    this.queue = [];
  }

  private static initHowl(): Howl {
    return null;
  }

  public async play(): Promise<void> {
    try {
      if(!this.currentTrack) return Promise.reject(new Error('Current track is not present'));
      this.currentTrack = this.queue[this.currentQueueIndex];
      const blob = await LibraryService.getTrackAudioById(this.currentTrack.id);
      if(this.howler) {
        this.howler.stop();
        this.howler = null;
      }
      this.howler = new Howl({
        src: URL.createObjectURL(blob),
        format: ['mp3'],
        html5: true,
        onload: () => {
          this.durationPlayed = new Timer();
          this.timerId = setInterval(() => {
            if(this.durationPlayed.getDuration() === 7) {
              this.dispatchEvent(new Event('trackPlayed'));
              clearInterval(this.timerId);
            }
          }, 1000, []);
        },
        onplay: () => {
          this.durationPlayed.start();
        },
        onpause: () => {
          this.durationPlayed.stop();
        },
        onstop: () => {
          this.durationPlayed.stop();
        },
        onend: () => {
          this.stop();
          this.durationPlayed.reset();
          if(this.isRepeatOn()) {
            this.play();
            return;
          }
          if(this.isShuffleOn()) {
            this.currentQueueIndex = _.random(0, this.queue.length - 1);
            this.currentTrack = this.queue[this.currentQueueIndex];
            this.play();
          }
        },
      });
      
      this.soundId = this.howler.play();
      this.stopped = false;
      return Promise.resolve();

    } catch(err) {
      console.log(err);
    }
  }

  public resume(): void {
    this.soundId = this.howler.play();
  }

  public pause(): void {
    this.howler.pause(this.soundId);
  }

  public stop(): void {
    this.howler.stop(this.soundId);
    this.stopped = true;
  }

  public seek(duration: number): void {
    this.howler.seek(duration, this.soundId);
  }

  public skipForward(): void {
    if(this.currentQueueIndex + 1 > this.queue.length) return;
    this.currentQueueIndex++;
    this.currentTrack = this.queue[this.currentQueueIndex];
    if(this.isPlaying() && !this.isPaused())
      this.play();
  }

  public skipBack(): void {
    if(this.currentQueueIndex < 1) return;
    this.currentQueueIndex--;
    this.currentTrack = this.queue[this.currentQueueIndex];
    if(this.isPlaying() && !this.isPaused())
      this.play();
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
    const index = this.queue.length;
    this.queue[index] = trackToAdd;
    this.currentTrack = this.queue[index];
  }

  public fillInQueue(tracks: TrackDetailsDTO[]): void {
    if(this.howler) this.stop();
    if(tracks.length > 0) {
      this.queue = tracks;
      this.currentTrack = this.queue[0];
      this.currentQueueIndex = 0;
    }
  }

  public clearQueue(): void {
    this.queue = [];
    this.currentQueueIndex = 0;
    this.currentTrack = null;
  }

  public getCurrentTrack(): TrackDetailsDTO {
    return this.currentTrack;
  }

  public getCurrentDuration(): number {
    return this.currentDuration;
  }

  public getTotalDuration(): number {
    return this.totalDuration;
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
    return this.stopped;
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
