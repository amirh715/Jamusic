import Vuex from 'vuex';
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

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    isAppWaiting: false,
    player: {
      isPlaying: false,
      queue: [],
      currentTrack: null,
      playQueueIndex: 0,
      playQueue: [],
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
      playQueueIndex,
      playQueue,
      currentDuration,
      totalDuration,
    }) {
      state.player.isPlaying = true;
      state.player.currentTrack = currentTrack;
      state.player.playQueueIndex = playQueueIndex;
      state.player.playQueue = playQueue;
      state.player.currentDuration = currentDuration;
      state.player.totalDuration = totalDuration;
    },
    [COMMIT_TYPES.PAUSED](state) {
      state.player.isPlaying = false;
    },
    [COMMIT_TYPES.STOPPED](state) {
      state.player.isPlaying = false;
    },
    [COMMIT_TYPES.APP_WAITING](state, isAppWaiting: boolean) {
      state.isAppWaiting = isAppWaiting;
    },
  },
  actions: {
    async [ACTION_TYPES.LOGIN]({ commit, dispatch }, { mobile, password }): Promise<void> {
      try {
        const dto = new LoginRequestDTO({ mobile, password });
        await AuthService.login(dto);
        commit(COMMIT_TYPES.AUTHENTICATED);
        await router.push({ name: 'Home' });
      } catch(err) {
        console.log(err);
        // handle unverified account here
        if(err.response && err.response.data) {
          const apiError = err.response.data;
          // user account is not verified
          if(apiError.type === 'UserIsNotVerifiedError')
            await dispatch(ACTION_TYPES.REQUEST_ACCOUNT_VERIFICATION, { mobile });
        }
        return Promise.reject(err);
      }
    },
    async [ACTION_TYPES.LOGOUT]({ commit }): Promise<void> {
      try {
        commit(COMMIT_TYPES.UNAUTHENTICATED);
        await this.dispatch(ACTION_TYPES.STOP);
        await router.push({ name: 'Signup' });
      } catch(err) {
        console.log(err);
      }
    },
    async [ACTION_TYPES.SIGNUP](
      { dispatch },
      params: { mobile: string, name: string, password: string }
    ): Promise<void> {
      try {
        const dto = new SignupRequestDTO(params);
        await AuthService.signup(dto);
        await dispatch(ACTION_TYPES.REQUEST_ACCOUNT_VERIFICATION, { mobile: params.mobile });
      } catch(err) {
        console.log(err);
      }
    },
    async [ACTION_TYPES.REQUEST_PASSWORD_RESET](
      { commit },
      mobile: string
    ): Promise<void> {
      try {
        const dto = new RequestPasswordResetDTO({ mobile });
        await AuthService.requestPasswordReset(dto);
        await router.push({ name: 'ForgotPassword' });
      } catch(err) {
        console.log(err);
      }
    },
    async [ACTION_TYPES.RESET_PASSWORD](
      { commit },
      params: { mobile: string, code: string, newPassword: string }
    ): Promise<void> {
      try {
        const dto = new ResetPasswordDTO(params);
        await AuthService.resetPassword(dto);
        await router.push({ name: 'Login' });
      } catch(err) {
        console.log(err);
      }
    },
    async [ACTION_TYPES.REQUEST_ACCOUNT_VERIFICATION]({ commit }, { mobile }): Promise<void> {
      try {
        const dto = new RequestAccountVerificationDTO({ mobile });
        await AuthService.requestAccountVerification(dto);
        await router.push({ name: 'AccountVerification' });
      } catch(err) {
        console.log(err);
      }
    },
    async [ACTION_TYPES.VERIFY_ACCOUNT]({ commit }, { mobile, code }): Promise<void> {
      try {
        const dto = new VerifyAccountDTO({ mobile, code });
        await AuthService.verifyAccount(dto);
        await router.push({ name: 'Login' });
      } catch(err) {
        console.log(err);
      }
    },
    async [ACTION_TYPES.PLAY]({ commit }): Promise<void> {
      try {
        await PlayerManager.play();
        commit(COMMIT_TYPES.PLAYING);
      } catch(err) {
        console.log(err);
      }
    },
    [ACTION_TYPES.PAUSE]({ commit }): void {
      PlayerManager.pause();
      commit(COMMIT_TYPES.PAUSED);
    },
    [ACTION_TYPES.STOP]({ commit }): void {
      PlayerManager.stop();
      commit(COMMIT_TYPES.STOPPED);
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
