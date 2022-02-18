import * as _ from 'lodash';
import { HttpService } from '../HttpService';
import { EditProfileDTO } from '@/classes/Profile/commands/EditProfileDTO';
import { ProfileDetails } from '@/classes/Profile/query/ProfileDetails';
import { AuthService } from '../AuthService';

class ProfileService {

  public async getMyProfile(): Promise<ProfileDetails> {
    try {
      const { data } = await HttpService.get(`/user/${AuthService.getSubjectId()}`);
      return Promise.resolve(new ProfileDetails(data));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async editMyProfile(dto: EditProfileDTO): Promise<void> {
    try {
      const {
        name,
        email,
        removeProfileImage,
      } = dto;
      const data = new FormData();
      data.append('name', name);
      data.append('email', email);
      data.append('removeProfileImage', _.toString(removeProfileImage));
      await HttpService.put('', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getMyProfileImage(): Promise<Blob> {
    try {
      const { data } = await HttpService.get('/user/image', '', { responseType: 'blob' });
      return Promise.resolve(new Blob([data]));
    } catch(err) {
      return Promise.reject(err);
    }
  }

}

const INSTANCE = new ProfileService();

export {
  INSTANCE as ProfileService,
}
