import { HttpService } from '../HttpService';
import { decodeJwt } from 'jose';
import { LoginRequestDTO } from '@/classes/Auth/commands/LoginRequestDTO';
import { RequestAccountVerificationDTO } from '@/classes/Auth/commands/RequestAccountVerificationDTO';
import { VerifyAccountDTO } from '@/classes/Auth/commands/VerifyAccountDTO';
import { RequestPasswordResetDTO } from '@/classes/Auth/commands/RequestPasswordResetDTO';
import { ResetPasswordDTO } from '@/classes/Auth/commands/ResetPasswordDTO';
import { RequestEmailVerificationDTO } from '@/classes/Auth/commands/RequestEmailVerificationDTO';
import { SignupRequestDTO } from '@/classes/Auth/commands/SignupRequestDTO';
import { ChangePasswordRequestDTO } from '@/classes/Auth/commands/ChangePasswordRequestDTO';

class AuthService {

  private getAuthToken(): string {
    return localStorage.getItem('token') || '';
  }
  
  public isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  public async login(dto: LoginRequestDTO): Promise<void> {
    try {
      const {
        mobile,
        password
      } = dto;
      const formData = new FormData();
      formData.append('mobile', mobile);
      formData.append('password', password);
      const { data } = await HttpService.post('/user/login', formData);
      localStorage.setItem('token', data.token);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public logout(): void {
    localStorage.removeItem('token');
  }

  public getSubjectId(): string | undefined {
    if(!this.isAuthenticated()) return undefined;
    const payload = decodeJwt(this.getAuthToken());
    if(!payload) return undefined;
    return payload.sub;
  }

  public getSubjectRole(): string | undefined {
    if(!this.isAuthenticated()) return undefined;
    const payload = decodeJwt(this.getAuthToken());
    if(!payload) return undefined;
    return payload.sub;
  }

  public async signup(dto: SignupRequestDTO): Promise<void> {
    try {
      const data = new FormData();
      data.append('name', dto.name);
      data.append('mobile', dto.mobile);
      data.append('password', dto.password);
      await HttpService.post('/user/', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async changePassword(dto: ChangePasswordRequestDTO): Promise<void> {
    try {
      const data = new FormData();
      data.append('id', this.getSubjectId());
      data.append('currentPassword', dto.currentPassword);
      data.append('newPassword', dto.newPassword);
      await HttpService.put('/user/change-password', data);
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async requestAccountVerification(dto: RequestAccountVerificationDTO): Promise<void> {
    try {
      const {
        mobile,
      } = dto;
      const data = new FormData();
      data.append('mobile', mobile);
      await HttpService.post('', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async verifyAccount(dto: VerifyAccountDTO): Promise<void> {
    try {
      const {
        mobile,
        code,
      } = dto;
      const data = new FormData();
      data.append('mobile', mobile);
      data.append('code', code);
      await HttpService.put('/user/verify-account', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async requestPasswordReset(dto: RequestPasswordResetDTO): Promise<void> {
    try {
      const {
        mobile,
      } = dto;
      const data = new FormData();
      data.append('mobile', mobile);
      await HttpService.post('/user/request-password-reset', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    try {
      const {
        mobile,
        code,
        newPassword,
      } = dto;
      const data = new FormData();
      data.append('mobile', mobile);
      data.append('resetCode', code);
      data.append('newPassword', newPassword);
      await HttpService.put('/user/reset-password', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async requestEmailVerification(): Promise<void> {
    try {
      const {
        userId,
      } = new RequestEmailVerificationDTO({ userId: this.getSubjectId() });
      const data = new FormData();
      data.append('id', userId);
      await HttpService.post('/user/request-email-verification', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async sendFCMToken(fcmToken: string): Promise<void> {
    try {
      const data = new FormData();
      data.append('FCMToken', fcmToken);
      await HttpService.post('', data);
    } catch(err) {
      return Promise.reject(err);
    }
  }

}

const INSTANCE = new AuthService();

export {
  INSTANCE as AuthService,
}
