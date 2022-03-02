import { Store } from 'vuex';
import router from '@/router';
import { AuthService } from '@/services/AuthService';
import { LoginRequestDTO } from '@/classes/Auth/commands/LoginRequestDTO';
import { COMMIT_TYPES } from './COMMIT_TYPES';
import { ACTION_TYPES } from './ACTION_TYPES';
import { SignupRequestDTO } from '@/classes/Auth/commands/SignupRequestDTO';
import { RequestAccountVerificationDTO } from '@/classes/Auth/commands/RequestAccountVerificationDTO';
import { VerifyAccountDTO } from '@/classes/Auth/commands/VerifyAccountDTO';
import { ResetPasswordDTO } from '@/classes/Auth/commands/ResetPasswordDTO';
import { RequestPasswordResetDTO } from '@/classes/Auth/commands/RequestPasswordResetDTO';
import { PlayerManager } from '@/services/PlayerManager';
import { TrackDetailsDTO } from '@/classes/Library/query/TrackDetailsDTO';

let timerId: number;

export default new Store({
  state: {
    isAuthenticated: false,
    isAppWaiting: false,
    homeScreenTabIndex: 0,
    player: {
      isPlaying: false,
      isStopped: true,
      queue: [],
      currentTrack: null,
      currentQueueIndex: 0,
      currentDuration: 0,
      totalDuration: 0,
      repeat: false,
      shuffle: false,
    },
  },
  mutations: {
    [COMMIT_TYPES.AUTHENTICATED](state) {
      state.isAuthenticated = true;
    },
    [COMMIT_TYPES.UNAUTHENTICATED](state) {
      state.isAuthenticated = false;
    },
    [COMMIT_TYPES.CHANGE_APP_WAITING](state, isAppWaiting) {
      state.isAppWaiting = isAppWaiting;
    },
    [COMMIT_TYPES.CHANGE_REPEAT](state, repeat) {
      state.player.repeat = repeat;
    },
    [COMMIT_TYPES.CHANGE_SHUFFLE](state, shuffle) {
      state.player.shuffle = shuffle;
    },
    [COMMIT_TYPES.PLAYING](state, {
      currentTrack,
      currentQueueIndex,
      queue,
      currentDuration,
      totalDuration,
    }) {
      state.player.isPlaying = true;
      state.player.isStopped = false;
      state.player.queue = queue;
      state.player.currentTrack = currentTrack;
      state.player.currentQueueIndex = currentQueueIndex;
      state.player.currentDuration = currentDuration;
      state.player.totalDuration = totalDuration;
    },
    [COMMIT_TYPES.SEEK](state, currentDuration) {
      state.player.currentDuration = currentDuration;
    },
    [COMMIT_TYPES.TOTAL_DURATION](state, totalDuration) {
      state.player.totalDuration = totalDuration;
    },
    [COMMIT_TYPES.PAUSED](state) {
      state.player.isPlaying = false;
    },
    [COMMIT_TYPES.STOPPED](state, currentTrack?: TrackDetailsDTO) {
      state.player.isPlaying = false;
      state.player.isStopped = true;
      state.player.currentTrack = currentTrack;
      state.player.currentDuration = 0;
      state.player.totalDuration = 0;
    },
    [COMMIT_TYPES.APP_WAITING](state, isAppWaiting: boolean) {
      state.isAppWaiting = isAppWaiting;
    },
    [COMMIT_TYPES.HOME_SCREEN_TAB_INDEX](state, index: number) {
      state.homeScreenTabIndex = index;
    },
  },
  actions: {
    async [ACTION_TYPES.LOGIN]({ commit, dispatch }, { mobile, password }): Promise<void> {
      try {
        commit(COMMIT_TYPES.APP_WAITING, true);
        const dto = new LoginRequestDTO({ mobile, password });
        await AuthService.login(dto);
        commit(COMMIT_TYPES.AUTHENTICATED);
        await router.push({ name: 'Home' });
      } catch(err) {
        // handle unverified account here
        if(err.response && err.response.data) {
          const apiError = err.response.data;
          // user account is not verified
          if(apiError.type === 'UserIsNotVerifiedError')
            await dispatch(ACTION_TYPES.REQUEST_ACCOUNT_VERIFICATION, { mobile });
        }
        return Promise.reject(err);
      } finally {
        commit(COMMIT_TYPES.APP_WAITING, false);
      }
    },
    async [ACTION_TYPES.LOGOUT]({ commit }): Promise<void> {
      try {
        commit(COMMIT_TYPES.APP_WAITING, true);
        commit(COMMIT_TYPES.UNAUTHENTICATED);
        AuthService.logout();
        await router.push({ name: 'Signup' });
      } catch(err) {
        return Promise.reject(err);
      } finally {
        commit(COMMIT_TYPES.APP_WAITING, false);
      }
    },
    async [ACTION_TYPES.SIGNUP](
      { commit, dispatch },
      params: { mobile: string, name: string, password: string }
    ): Promise<void> {
      try {
        commit(COMMIT_TYPES.APP_WAITING, true);
        const dto = new SignupRequestDTO(params);
        await AuthService.signup(dto);
        await dispatch(ACTION_TYPES.REQUEST_ACCOUNT_VERIFICATION, { mobile: params.mobile });
      } catch(err) {
        return Promise.reject(err);
      } finally {
        commit(COMMIT_TYPES.APP_WAITING, false);
      }
    },
    async [ACTION_TYPES.REQUEST_PASSWORD_RESET](
      { commit },
      mobile: string
    ): Promise<void> {
      try {
        commit(COMMIT_TYPES.APP_WAITING, true);
        const dto = new RequestPasswordResetDTO({ mobile });
        await AuthService.requestPasswordReset(dto);
        await router.push({ name: 'ForgotPassword' });
      } catch(err) {
        return Promise.reject(err);
      } finally {
        commit(COMMIT_TYPES.APP_WAITING, false);
      }
    },
    async [ACTION_TYPES.RESET_PASSWORD](
      { commit },
      params: { mobile: string, code: string, newPassword: string }
    ): Promise<void> {
      try {
        commit(COMMIT_TYPES.APP_WAITING, true);
        const dto = new ResetPasswordDTO(params);
        await AuthService.resetPassword(dto);
        await router.push({ name: 'Login' });
      } catch(err) {
        return Promise.reject(err);
      } finally {
        commit(COMMIT_TYPES.APP_WAITING, false);
      }
    },
    async [ACTION_TYPES.REQUEST_ACCOUNT_VERIFICATION]({ commit }, { mobile }): Promise<void> {
      try {
        const dto = new RequestAccountVerificationDTO({ mobile });
        await AuthService.requestAccountVerification(dto);
        await router.push({ name: 'AccountVerification' });
      } catch(err) {
        return Promise.reject(err);
      }
    },
    async [ACTION_TYPES.VERIFY_ACCOUNT]({ commit }, { mobile, code }): Promise<void> {
      try {
        commit(COMMIT_TYPES.APP_WAITING, true);
        const dto = new VerifyAccountDTO({ mobile, code });
        await AuthService.verifyAccount(dto);
        await router.push({ name: 'Login' });
      } catch(err) {
        return Promise.reject(err);
      } finally {
        commit(COMMIT_TYPES.APP_WAITING, false);
      }
    },
    async [ACTION_TYPES.PLAY]({ state, commit, dispatch }, trackToAddToQueue?: TrackDetailsDTO): Promise<void> {
      try {
        if(trackToAddToQueue) {
          dispatch(ACTION_TYPES.ADD_TO_PLAY_QUEUE, trackToAddToQueue);
        }
        await PlayerManager.play();
        PlayerManager.addEventListener('end', () => {
          commit(COMMIT_TYPES.STOPPED);
        });
        PlayerManager.addEventListener('play', () => {
          commit(COMMIT_TYPES.PLAYING, {
            currentTrack: PlayerManager.getCurrentTrack(),
            currentQueueIndex: PlayerManager.getCurrentPlayQueueIndex(),
            queue: PlayerManager.getPlayQueue(),
            currentDuration: PlayerManager.getCurrentDuration(),
            totalDuration: PlayerManager.getTotalDuration(),
          });
        });
        PlayerManager.addEventListener('skipBack', () => {
          commit(COMMIT_TYPES.STOPPED, PlayerManager.getCurrentTrack());
        });
        PlayerManager.addEventListener('skipForward', () => {
          commit(COMMIT_TYPES.STOPPED, PlayerManager.getCurrentTrack());
        });
        commit(
          COMMIT_TYPES.PLAYING,
          {
            currentTrack: PlayerManager.getCurrentTrack(),
            currentQueueIndex: PlayerManager.getCurrentPlayQueueIndex(),
            queue: PlayerManager.getPlayQueue(),
            currentDuration: PlayerManager.getCurrentDuration(),
            totalDuration: PlayerManager.getTotalDuration(),
          }
        );
        setTimeout(() => commit(COMMIT_TYPES.TOTAL_DURATION, PlayerManager.getTotalDuration()), 100);
        timerId = setInterval(() => {
          const newDuration = PlayerManager.getCurrentDuration();
          if(state.player.currentDuration === newDuration) return;
          commit(
            COMMIT_TYPES.SEEK,
            newDuration,
          );
        }, 1000);
      } catch(err) {
        return Promise.reject(err);
      }
    },
    async [ACTION_TYPES.RESUME]({ commit }): Promise<void> {
      try {
        PlayerManager.resume();
        commit(
          COMMIT_TYPES.PLAYING,
          {
            currentTrack: PlayerManager.getCurrentTrack(),
            currentQueueIndex: PlayerManager.getCurrentPlayQueueIndex(),
            queue: PlayerManager.getPlayQueue(),
            currentDuration: PlayerManager.getCurrentDuration(),
            totalDuration: PlayerManager.getTotalDuration(),
          }
        );
      } catch(err) {
        return Promise.reject(err);
      }
    },
    [ACTION_TYPES.SEEK]({ state }, seekPosition: number) {
      const duration = (seekPosition * state.player.totalDuration) / 100;
      PlayerManager.seek(duration);
    },
    [ACTION_TYPES.ADD_TO_PLAY_QUEUE]({ commit }, trackToAdd: TrackDetailsDTO): void {
      PlayerManager.addToQueue(trackToAdd);
    },
    [ACTION_TYPES.FILL_PLAY_QUEUE]({ commit }, tracksToReplace: TrackDetailsDTO[]): void {
      PlayerManager.fillInQueue(tracksToReplace);
    },
    [ACTION_TYPES.PAUSE]({ commit }): void {
      PlayerManager.pause();
      commit(COMMIT_TYPES.PAUSED);
    },
    [ACTION_TYPES.STOP]({ commit }): void {
      PlayerManager.stop();
      commit(COMMIT_TYPES.STOPPED);
    },
    [ACTION_TYPES.SKIP_BACK]({ commit }): void {
      PlayerManager.skipBack();
    },
    [ACTION_TYPES.SKIP_FORWARD]({ commit }): void {
      PlayerManager.skipForward();
    },
    [ACTION_TYPES.CHANGE_REPEAT]({ commit }, repeatOn: boolean): void {
      PlayerManager.repeat(repeatOn);
      commit(COMMIT_TYPES.CHANGE_REPEAT, repeatOn);
    },
    [ACTION_TYPES.CHANGE_SHUFFLE]({ commit }, shuffleOn: boolean): void {
      PlayerManager.shuffle(shuffleOn);
      commit(COMMIT_TYPES.CHANGE_SHUFFLE, shuffleOn);
    },
  },
});
